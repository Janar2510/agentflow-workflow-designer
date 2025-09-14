import asyncio
import aiohttp
import logging
from typing import Dict, Any, Optional
from datetime import datetime
import json

logger = logging.getLogger(__name__)

class APICallerAgent:
    """Agent for making HTTP API calls and processing responses"""
    
    def __init__(self, config: Dict[str, Any], llm=None):
        self.config = config
        self.llm = llm
        self.timeout = config.get('timeout', 30)
        self.retries = config.get('retries', 3)
        self.retry_delay = config.get('retry_delay', 1)
        
    async def execute(self, input_data: Dict[str, Any], context: Any) -> Dict[str, Any]:
        """Execute API call with given parameters"""
        
        try:
            url = input_data.get('url')
            method = input_data.get('method', 'GET').upper()
            headers = input_data.get('headers', {})
            data = input_data.get('data', {})
            params = input_data.get('params', {})
            
            if not url:
                raise ValueError("URL is required for API calls")
            
            logger.info(f"Making {method} request to {url}")
            
            # Prepare request data
            request_data = self._prepare_request_data(data, method)
            
            # Make API call with retries
            response_data = await self._make_request_with_retries(
                url, method, headers, request_data, params
            )
            
            # Process response
            processed_response = await self._process_response(response_data, input_data)
            
            return {
                'status': 'completed',
                'output': processed_response,
                'metadata': {
                    'url': url,
                    'method': method,
                    'status_code': response_data.get('status_code'),
                    'response_time': response_data.get('response_time'),
                    'timestamp': datetime.utcnow().isoformat()
                },
                'variables': {
                    'api_response': processed_response,
                    'status_code': response_data.get('status_code'),
                    'response_data': response_data.get('data')
                }
            }
            
        except Exception as e:
            logger.error(f"API call failed: {e}", exc_info=True)
            return {
                'status': 'failed',
                'error': str(e),
                'metadata': {
                    'url': input_data.get('url'),
                    'method': input_data.get('method', 'GET'),
                    'error_time': datetime.utcnow().isoformat()
                }
            }
    
    def _prepare_request_data(self, data: Dict[str, Any], method: str) -> Optional[Any]:
        """Prepare request data based on method"""
        
        if method in ['GET', 'DELETE']:
            return None
        
        if not data:
            return None
        
        # Convert to JSON if it's a dict
        if isinstance(data, dict):
            return json.dumps(data)
        
        return data
    
    async def _make_request_with_retries(
        self, 
        url: str, 
        method: str, 
        headers: Dict[str, str], 
        data: Optional[Any], 
        params: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Make API request with retry logic"""
        
        last_exception = None
        
        for attempt in range(self.retries + 1):
            try:
                start_time = datetime.utcnow()
                
                async with aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=self.timeout)) as session:
                    async with session.request(
                        method=method,
                        url=url,
                        headers=headers,
                        data=data,
                        params=params
                    ) as response:
                        
                        response_time = (datetime.utcnow() - start_time).total_seconds()
                        
                        # Read response content
                        content_type = response.headers.get('content-type', '')
                        
                        if 'application/json' in content_type:
                            response_data = await response.json()
                        elif 'text/' in content_type:
                            response_data = await response.text()
                        else:
                            response_data = await response.read()
                        
                        return {
                            'status_code': response.status,
                            'data': response_data,
                            'headers': dict(response.headers),
                            'response_time': response_time,
                            'success': response.status < 400
                        }
                        
            except Exception as e:
                last_exception = e
                logger.warning(f"API call attempt {attempt + 1} failed: {e}")
                
                if attempt < self.retries:
                    await asyncio.sleep(self.retry_delay * (2 ** attempt))  # Exponential backoff
                else:
                    raise last_exception
        
        raise last_exception
    
    async def _process_response(self, response_data: Dict[str, Any], input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process API response based on configuration"""
        
        processing_config = input_data.get('processing', {})
        extract_fields = processing_config.get('extract_fields', [])
        transform_config = processing_config.get('transform', {})
        
        result = {
            'status_code': response_data.get('status_code'),
            'success': response_data.get('success', False),
            'data': response_data.get('data'),
            'headers': response_data.get('headers', {}),
            'response_time': response_data.get('response_time')
        }
        
        # Extract specific fields if configured
        if extract_fields and isinstance(response_data.get('data'), dict):
            extracted = {}
            for field in extract_fields:
                if field in response_data['data']:
                    extracted[field] = response_data['data'][field]
            result['extracted'] = extracted
        
        # Apply transformations if configured
        if transform_config:
            result['transformed'] = await self._apply_transformations(
                response_data.get('data'), 
                transform_config
            )
        
        # Add validation results
        validation_config = processing_config.get('validation', {})
        if validation_config:
            result['validation'] = await self._validate_response(
                response_data.get('data'), 
                validation_config
            )
        
        return result
    
    async def _apply_transformations(self, data: Any, transform_config: Dict[str, Any]) -> Any:
        """Apply data transformations to response"""
        
        if not data or not transform_config:
            return data
        
        # Simple transformations
        if isinstance(data, dict):
            transformed = data.copy()
            
            # Field mapping
            field_mapping = transform_config.get('field_mapping', {})
            for old_field, new_field in field_mapping.items():
                if old_field in transformed:
                    transformed[new_field] = transformed.pop(old_field)
            
            # Value transformations
            value_transforms = transform_config.get('value_transforms', {})
            for field, transform in value_transforms.items():
                if field in transformed:
                    if transform.get('type') == 'uppercase':
                        transformed[field] = str(transformed[field]).upper()
                    elif transform.get('type') == 'lowercase':
                        transformed[field] = str(transformed[field]).lower()
                    elif transform.get('type') == 'format':
                        transformed[field] = str(transformed[field]).format(**transform.get('params', {}))
            
            return transformed
        
        return data
    
    async def _validate_response(self, data: Any, validation_config: Dict[str, Any]) -> Dict[str, Any]:
        """Validate response data against schema or rules"""
        
        validation_result = {
            'valid': True,
            'errors': [],
            'warnings': []
        }
        
        if not data:
            validation_result['valid'] = False
            validation_result['errors'].append('No data received')
            return validation_result
        
        # Required fields validation
        required_fields = validation_config.get('required_fields', [])
        if isinstance(data, dict):
            for field in required_fields:
                if field not in data:
                    validation_result['valid'] = False
                    validation_result['errors'].append(f'Required field missing: {field}')
        
        # Type validation
        type_validation = validation_config.get('type_validation', {})
        if isinstance(data, dict):
            for field, expected_type in type_validation.items():
                if field in data:
                    actual_type = type(data[field]).__name__
                    if actual_type != expected_type:
                        validation_result['warnings'].append(
                            f'Field {field} expected {expected_type}, got {actual_type}'
                        )
        
        # Value range validation
        range_validation = validation_config.get('range_validation', {})
        if isinstance(data, dict):
            for field, range_config in range_validation.items():
                if field in data and isinstance(data[field], (int, float)):
                    value = data[field]
                    if 'min' in range_config and value < range_config['min']:
                        validation_result['warnings'].append(
                            f'Field {field} value {value} below minimum {range_config["min"]}'
                        )
                    if 'max' in range_config and value > range_config['max']:
                        validation_result['warnings'].append(
                            f'Field {field} value {value} above maximum {range_config["max"]}'
                        )
        
        return validation_result

