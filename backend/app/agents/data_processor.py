import pandas as pd
import numpy as np
import json
from typing import Dict, Any, List, Union
from datetime import datetime

class DataProcessorAgent:
    """Custom agent for data processing and transformation operations"""
    
    def __init__(self, config: Dict[str, Any], llm=None):
        self.config = config
        self.llm = llm
        self.supported_operations = self._get_supported_operations()
    
    async def execute(self, input_data: Dict[str, Any], context: Any) -> Dict[str, Any]:
        """Execute data processing operation"""
        
        data = input_data.get('data')
        operation = input_data.get('operation')
        parameters = input_data.get('parameters', {})
        
        if not data:
            raise ValueError("No data provided for processing")
        
        if not operation:
            raise ValueError("No operation specified")
        
        if operation not in self.supported_operations:
            raise ValueError(f"Unsupported operation: {operation}")
        
        # Convert data to pandas DataFrame if it's not already
        df = self._prepare_dataframe(data)
        
        # Execute the operation
        result_df, metadata = await self._execute_operation(df, operation, parameters)
        
        # Convert result back to the desired format
        output_format = parameters.get('output_format', 'records')
        processed_data = self._format_output(result_df, output_format)
        
        return {
            'output': {
                'data': processed_data,
                'metadata': metadata,
                'operation': operation,
                'timestamp': datetime.utcnow().isoformat()
            },
            'variables': {
                'processed_rows': len(result_df),
                'columns_count': len(result_df.columns),
                'operation_success': True
            }
        }
    
    def _prepare_dataframe(self, data: Any) -> pd.DataFrame:
        """Convert input data to pandas DataFrame"""
        
        if isinstance(data, pd.DataFrame):
            return data
        elif isinstance(data, list):
            if data and isinstance(data[0], dict):
                return pd.DataFrame(data)
            else:
                return pd.DataFrame({'values': data})
        elif isinstance(data, dict):
            return pd.DataFrame([data])
        elif isinstance(data, str):
            # Try to parse as JSON
            try:
                parsed_data = json.loads(data)
                return self._prepare_dataframe(parsed_data)
            except json.JSONDecodeError:
                # Treat as CSV
                from io import StringIO
                return pd.read_csv(StringIO(data))
        else:
            raise ValueError(f"Unsupported data type: {type(data)}")
    
    async def _execute_operation(
        self, 
        df: pd.DataFrame, 
        operation: str, 
        parameters: Dict[str, Any]
    ) -> tuple[pd.DataFrame, Dict[str, Any]]:
        """Execute the specified data operation"""
        
        metadata = {
            'original_shape': df.shape,
            'operation_parameters': parameters
        }
        
        if operation == 'filter':
            result_df = self._filter_data(df, parameters)
        elif operation == 'sort':
            result_df = self._sort_data(df, parameters)
        elif operation == 'group_by':
            result_df = self._group_data(df, parameters)
        elif operation == 'aggregate':
            result_df = self._aggregate_data(df, parameters)
        elif operation == 'transform':
            result_df = self._transform_data(df, parameters)
        elif operation == 'join':
            result_df = self._join_data(df, parameters)
        elif operation == 'pivot':
            result_df = self._pivot_data(df, parameters)
        elif operation == 'clean':
            result_df = self._clean_data(df, parameters)
        elif operation == 'sample':
            result_df = self._sample_data(df, parameters)
        elif operation == 'statistics':
            result_df = self._calculate_statistics(df, parameters)
        else:
            raise ValueError(f"Operation not implemented: {operation}")
        
        metadata['result_shape'] = result_df.shape
        metadata['columns'] = list(result_df.columns)
        
        return result_df, metadata
    
    def _filter_data(self, df: pd.DataFrame, parameters: Dict[str, Any]) -> pd.DataFrame:
        """Filter data based on conditions"""
        
        conditions = parameters.get('conditions', [])
        
        for condition in conditions:
            column = condition.get('column')
            operator = condition.get('operator')
            value = condition.get('value')
            
            if column not in df.columns:
                continue
            
            if operator == 'equals':
                df = df[df[column] == value]
            elif operator == 'not_equals':
                df = df[df[column] != value]
            elif operator == 'greater_than':
                df = df[df[column] > value]
            elif operator == 'less_than':
                df = df[df[column] < value]
            elif operator == 'contains':
                df = df[df[column].astype(str).str.contains(str(value), na=False)]
            elif operator == 'in':
                df = df[df[column].isin(value if isinstance(value, list) else [value])]
        
        return df
    
    def _sort_data(self, df: pd.DataFrame, parameters: Dict[str, Any]) -> pd.DataFrame:
        """Sort data by specified columns"""
        
        sort_by = parameters.get('sort_by', [])
        if isinstance(sort_by, str):
            sort_by = [sort_by]
        
        ascending = parameters.get('ascending', True)
        if isinstance(ascending, bool):
            ascending = [ascending] * len(sort_by)
        
        return df.sort_values(by=sort_by, ascending=ascending)
    
    def _group_data(self, df: pd.DataFrame, parameters: Dict[str, Any]) -> pd.DataFrame:
        """Group data by specified columns"""
        
        group_by = parameters.get('group_by', [])
        if isinstance(group_by, str):
            group_by = [group_by]
        
        agg_functions = parameters.get('aggregations', {'count': 'size'})
        
        grouped = df.groupby(group_by)
        
        result_parts = []
        for func_name, func_or_column in agg_functions.items():
            if func_or_column == 'size':
                result_parts.append(grouped.size().rename(func_name))
            elif isinstance(func_or_column, dict):
                # Multiple aggregations per column
                for column, func in func_or_column.items():
                    if column in df.columns:
                        result_parts.append(grouped[column].agg(func).rename(f"{column}_{func}"))
            else:
                # Single aggregation
                if func_or_column in df.columns:
                    result_parts.append(grouped[func_or_column].agg(func_name))
        
        if result_parts:
            result = pd.concat(result_parts, axis=1).reset_index()
        else:
            result = grouped.first().reset_index()
        
        return result
    
    def _aggregate_data(self, df: pd.DataFrame, parameters: Dict[str, Any]) -> pd.DataFrame:
        """Perform aggregation operations"""
        
        agg_config = parameters.get('aggregations', {})
        
        if not agg_config:
            # Default aggregation
            numeric_columns = df.select_dtypes(include=[np.number]).columns
            agg_config = {col: ['mean', 'sum', 'count'] for col in numeric_columns}
        
        result = df.agg(agg_config)
        
        # Flatten MultiIndex columns if present
        if isinstance(result.columns, pd.MultiIndex):
            result.columns = ['_'.join(col).strip() for col in result.columns.values]
        
        return result.reset_index()
    
    def _transform_data(self, df: pd.DataFrame, parameters: Dict[str, Any]) -> pd.DataFrame:
        """Transform data using specified operations"""
        
        transformations = parameters.get('transformations', [])
        result_df = df.copy()
        
        for transform in transformations:
            operation = transform.get('operation')
            column = transform.get('column')
            target_column = transform.get('target_column', column)
            value = transform.get('value')
            
            if column not in result_df.columns:
                continue
            
            if operation == 'add':
                result_df[target_column] = result_df[column] + value
            elif operation == 'multiply':
                result_df[target_column] = result_df[column] * value
            elif operation == 'uppercase':
                result_df[target_column] = result_df[column].astype(str).str.upper()
            elif operation == 'lowercase':
                result_df[target_column] = result_df[column].astype(str).str.lower()
            elif operation == 'normalize':
                # Min-max normalization
                min_val = result_df[column].min()
                max_val = result_df[column].max()
                result_df[target_column] = (result_df[column] - min_val) / (max_val - min_val)
            elif operation == 'standardize':
                # Z-score standardization
                mean_val = result_df[column].mean()
                std_val = result_df[column].std()
                result_df[target_column] = (result_df[column] - mean_val) / std_val
        
        return result_df
    
    def _clean_data(self, df: pd.DataFrame, parameters: Dict[str, Any]) -> pd.DataFrame:
        """Clean data by removing/fixing issues"""
        
        operations = parameters.get('operations', ['remove_duplicates', 'handle_missing'])
        result_df = df.copy()
        
        for operation in operations:
            if operation == 'remove_duplicates':
                result_df = result_df.drop_duplicates()
            elif operation == 'handle_missing':
                strategy = parameters.get('missing_strategy', 'drop')
                if strategy == 'drop':
                    result_df = result_df.dropna()
                elif strategy == 'forward_fill':
                    result_df = result_df.fillna(method='ffill')
                elif strategy == 'backward_fill':
                    result_df = result_df.fillna(method='bfill')
                elif strategy == 'mean':
                    numeric_columns = result_df.select_dtypes(include=[np.number]).columns
                    result_df[numeric_columns] = result_df[numeric_columns].fillna(
                        result_df[numeric_columns].mean()
                    )
            elif operation == 'remove_outliers':
                # Remove outliers using IQR method
                numeric_columns = result_df.select_dtypes(include=[np.number]).columns
                for col in numeric_columns:
                    Q1 = result_df[col].quantile(0.25)
                    Q3 = result_df[col].quantile(0.75)
                    IQR = Q3 - Q1
                    lower_bound = Q1 - 1.5 * IQR
                    upper_bound = Q3 + 1.5 * IQR
                    result_df = result_df[
                        (result_df[col] >= lower_bound) & (result_df[col] <= upper_bound)
                    ]
        
        return result_df
    
    def _sample_data(self, df: pd.DataFrame, parameters: Dict[str, Any]) -> pd.DataFrame:
        """Sample data using various strategies"""
        
        method = parameters.get('method', 'random')
        size = parameters.get('size', 100)
        
        if method == 'random':
            return df.sample(n=min(size, len(df)), random_state=42)
        elif method == 'head':
            return df.head(size)
        elif method == 'tail':
            return df.tail(size)
        elif method == 'stratified':
            # Stratified sampling by specified column
            column = parameters.get('stratify_column')
            if column and column in df.columns:
                return df.groupby(column).apply(
                    lambda x: x.sample(n=min(size // df[column].nunique(), len(x)), random_state=42)
                ).reset_index(drop=True)
        
        return df.sample(n=min(size, len(df)), random_state=42)
    
    def _calculate_statistics(self, df: pd.DataFrame, parameters: Dict[str, Any]) -> pd.DataFrame:
        """Calculate statistical summaries"""
        
        include_columns = parameters.get('columns', 'all')
        
        if include_columns == 'all':
            stats_df = df.describe(include='all')
        elif include_columns == 'numeric':
            stats_df = df.describe(include=[np.number])
        else:
            # Specific columns
            if isinstance(include_columns, str):
                include_columns = [include_columns]
            available_columns = [col for col in include_columns if col in df.columns]
            stats_df = df[available_columns].describe(include='all')
        
        return stats_df.reset_index()
    
    def _join_data(self, df: pd.DataFrame, parameters: Dict[str, Any]) -> pd.DataFrame:
        """Join with another dataset"""
        
        join_data = parameters.get('join_data', [])
        join_on = parameters.get('join_on', [])
        join_type = parameters.get('join_type', 'inner')
        
        if not join_data:
            return df
        
        join_df = pd.DataFrame(join_data)
        
        if join_on:
            return df.merge(join_df, on=join_on, how=join_type)
        else:
            return pd.concat([df, join_df], ignore_index=True)
    
    def _pivot_data(self, df: pd.DataFrame, parameters: Dict[str, Any]) -> pd.DataFrame:
        """Pivot data based on specified columns"""
        
        index = parameters.get('index', [])
        columns = parameters.get('columns', [])
        values = parameters.get('values', [])
        aggfunc = parameters.get('aggfunc', 'mean')
        
        if not index or not columns or not values:
            return df
        
        return df.pivot_table(
            index=index,
            columns=columns,
            values=values,
            aggfunc=aggfunc,
            fill_value=0
        ).reset_index()
    
    def _format_output(self, df: pd.DataFrame, output_format: str) -> Any:
        """Format the output dataframe according to specified format"""
        
        if output_format == 'records':
            return df.to_dict('records')
        elif output_format == 'list':
            return df.values.tolist()
        elif output_format == 'dict':
            return df.to_dict()
        elif output_format == 'json':
            return df.to_json(orient='records')
        elif output_format == 'csv':
            return df.to_csv(index=False)
        else:
            return df.to_dict('records')  # Default format
    
    def _get_supported_operations(self) -> List[str]:
        """Get list of supported operations"""
        
        return [
            'filter',
            'sort',
            'group_by',
            'aggregate',
            'transform',
            'join',
            'pivot',
            'clean',
            'sample',
            'statistics'
        ]