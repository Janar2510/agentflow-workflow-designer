import os
import json
import csv
import asyncio
import aiofiles
from typing import Dict, Any, List, Union
from datetime import datetime
from pathlib import Path
import mimetypes

class FileHandlerAgent:
    """Custom agent for file operations and management"""
    
    def __init__(self, config: Dict[str, Any], llm=None):
        self.config = config
        self.llm = llm
        self.supported_formats = self._get_supported_formats()
        self.max_file_size = config.get('max_file_size', 10 * 1024 * 1024)  # 10MB default
    
    async def execute(self, input_data: Dict[str, Any], context: Any) -> Dict[str, Any]:
        """Execute file operation"""
        
        operation = input_data.get('operation')
        file_path = input_data.get('file_path')
        content = input_data.get('content')
        parameters = input_data.get('parameters', {})
        
        if not operation:
            raise ValueError("No operation specified")
        
        if operation in ['read', 'write', 'delete', 'copy', 'move'] and not file_path:
            raise ValueError("File path is required for this operation")
        
        try:
            if operation == 'read':
                result = await self._read_file(file_path, parameters)
            elif operation == 'write':
                result = await self._write_file(file_path, content, parameters)
            elif operation == 'delete':
                result = await self._delete_file(file_path)
            elif operation == 'copy':
                result = await self._copy_file(file_path, parameters.get('destination'))
            elif operation == 'move':
                result = await self._move_file(file_path, parameters.get('destination'))
            elif operation == 'list':
                result = await self._list_files(parameters.get('directory', '.'), parameters)
            elif operation == 'info':
                result = await self._get_file_info(file_path)
            elif operation == 'search':
                result = await self._search_files(parameters.get('directory', '.'), parameters)
            elif operation == 'compress':
                result = await self._compress_files(parameters.get('files', []), parameters)
            elif operation == 'extract':
                result = await self._extract_archive(file_path, parameters)
            else:
                raise ValueError(f"Unsupported operation: {operation}")
            
            return {
                'output': result,
                'variables': {
                    'operation_success': True,
                    'files_processed': result.get('files_processed', 1),
                    'operation_type': operation
                }
            }
            
        except Exception as e:
            return {
                'output': {'error': str(e)},
                'variables': {
                    'operation_success': False,
                    'error_message': str(e)
                }
            }
    
    async def _read_file(self, file_path: str, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Read file content"""
        
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")
        
        file_size = os.path.getsize(file_path)
        if file_size > self.max_file_size:
            raise ValueError(f"File too large: {file_size} bytes (max: {self.max_file_size})")
        
        file_format = parameters.get('format', 'auto')
        encoding = parameters.get('encoding', 'utf-8')
        
        async with aiofiles.open(file_path, 'r', encoding=encoding) as f:
            content = await f.read()
        
        # Auto-detect format if not specified
        if file_format == 'auto':
            file_format = self._detect_file_format(file_path, content)
        
        # Parse content based on format
        parsed_content = self._parse_content(content, file_format)
        
        return {
            'file_path': file_path,
            'file_size': file_size,
            'format': file_format,
            'content': parsed_content,
            'raw_content': content,
            'mime_type': mimetypes.guess_type(file_path)[0]
        }
    
    async def _write_file(self, file_path: str, content: Any, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Write content to file"""
        
        file_format = parameters.get('format', 'auto')
        encoding = parameters.get('encoding', 'utf-8')
        create_dirs = parameters.get('create_dirs', True)
        
        # Create directory if needed
        if create_dirs:
            os.makedirs(os.path.dirname(file_path), exist_ok=True)
        
        # Convert content to string based on format
        if file_format == 'json' and isinstance(content, (dict, list)):
            content_str = json.dumps(content, indent=2)
        elif file_format == 'csv' and isinstance(content, list):
            content_str = self._list_to_csv(content)
        else:
            content_str = str(content)
        
        async with aiofiles.open(file_path, 'w', encoding=encoding) as f:
            await f.write(content_str)
        
        return {
            'file_path': file_path,
            'bytes_written': len(content_str.encode(encoding)),
            'format': file_format,
            'created': True
        }
    
    async def _delete_file(self, file_path: str) -> Dict[str, Any]:
        """Delete file"""
        
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")
        
        os.remove(file_path)
        
        return {
            'file_path': file_path,
            'deleted': True
        }
    
    async def _copy_file(self, source_path: str, destination_path: str) -> Dict[str, Any]:
        """Copy file to destination"""
        
        if not os.path.exists(source_path):
            raise FileNotFoundError(f"Source file not found: {source_path}")
        
        # Create destination directory if needed
        os.makedirs(os.path.dirname(destination_path), exist_ok=True)
        
        # Copy file
        import shutil
        shutil.copy2(source_path, destination_path)
        
        return {
            'source_path': source_path,
            'destination_path': destination_path,
            'copied': True
        }
    
    async def _move_file(self, source_path: str, destination_path: str) -> Dict[str, Any]:
        """Move file to destination"""
        
        if not os.path.exists(source_path):
            raise FileNotFoundError(f"Source file not found: {source_path}")
        
        # Create destination directory if needed
        os.makedirs(os.path.dirname(destination_path), exist_ok=True)
        
        # Move file
        import shutil
        shutil.move(source_path, destination_path)
        
        return {
            'source_path': source_path,
            'destination_path': destination_path,
            'moved': True
        }
    
    async def _list_files(self, directory: str, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """List files in directory"""
        
        if not os.path.exists(directory):
            raise FileNotFoundError(f"Directory not found: {directory}")
        
        recursive = parameters.get('recursive', False)
        pattern = parameters.get('pattern', '*')
        include_hidden = parameters.get('include_hidden', False)
        
        files = []
        directories = []
        
        if recursive:
            for root, dirs, filenames in os.walk(directory):
                # Filter hidden files/directories
                if not include_hidden:
                    dirs[:] = [d for d in dirs if not d.startswith('.')]
                    filenames = [f for f in filenames if not f.startswith('.')]
                
                for filename in filenames:
                    if self._matches_pattern(filename, pattern):
                        file_path = os.path.join(root, filename)
                        file_info = await self._get_file_info(file_path)
                        files.append(file_info)
        else:
            for item in os.listdir(directory):
                if not include_hidden and item.startswith('.'):
                    continue
                
                item_path = os.path.join(directory, item)
                if os.path.isfile(item_path) and self._matches_pattern(item, pattern):
                    file_info = await self._get_file_info(item_path)
                    files.append(file_info)
                elif os.path.isdir(item_path):
                    directories.append(item)
        
        return {
            'directory': directory,
            'files': files,
            'directories': directories,
            'total_files': len(files),
            'total_directories': len(directories)
        }
    
    async def _get_file_info(self, file_path: str) -> Dict[str, Any]:
        """Get file information"""
        
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")
        
        stat = os.stat(file_path)
        
        return {
            'path': file_path,
            'name': os.path.basename(file_path),
            'size': stat.st_size,
            'created': datetime.fromtimestamp(stat.st_ctime).isoformat(),
            'modified': datetime.fromtimestamp(stat.st_mtime).isoformat(),
            'is_file': os.path.isfile(file_path),
            'is_directory': os.path.isdir(file_path),
            'mime_type': mimetypes.guess_type(file_path)[0]
        }
    
    async def _search_files(self, directory: str, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Search for files matching criteria"""
        
        pattern = parameters.get('pattern', '*')
        content_search = parameters.get('content_search')
        file_types = parameters.get('file_types', [])
        min_size = parameters.get('min_size', 0)
        max_size = parameters.get('max_size', float('inf'))
        
        matching_files = []
        
        for root, dirs, filenames in os.walk(directory):
            for filename in filenames:
                file_path = os.path.join(root, filename)
                
                # Check pattern match
                if not self._matches_pattern(filename, pattern):
                    continue
                
                # Check file type
                if file_types:
                    file_ext = os.path.splitext(filename)[1].lower()
                    if file_ext not in file_types:
                        continue
                
                # Check file size
                file_size = os.path.getsize(file_path)
                if file_size < min_size or file_size > max_size:
                    continue
                
                # Check content search
                if content_search:
                    try:
                        async with aiofiles.open(file_path, 'r', encoding='utf-8') as f:
                            content = await f.read()
                        if content_search.lower() not in content.lower():
                            continue
                    except:
                        continue
                
                file_info = await self._get_file_info(file_path)
                matching_files.append(file_info)
        
        return {
            'directory': directory,
            'search_criteria': parameters,
            'matching_files': matching_files,
            'total_matches': len(matching_files)
        }
    
    async def _compress_files(self, files: List[str], parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Compress files into archive"""
        
        import zipfile
        
        archive_path = parameters.get('archive_path', 'archive.zip')
        compression = parameters.get('compression', zipfile.ZIP_DEFLATED)
        
        with zipfile.ZipFile(archive_path, 'w', compression) as zipf:
            for file_path in files:
                if os.path.exists(file_path):
                    zipf.write(file_path, os.path.basename(file_path))
        
        return {
            'archive_path': archive_path,
            'files_compressed': len(files),
            'compression_type': 'zip'
        }
    
    async def _extract_archive(self, archive_path: str, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Extract archive file"""
        
        import zipfile
        
        extract_to = parameters.get('extract_to', './extracted')
        os.makedirs(extract_to, exist_ok=True)
        
        with zipfile.ZipFile(archive_path, 'r') as zipf:
            zipf.extractall(extract_to)
            extracted_files = zipf.namelist()
        
        return {
            'archive_path': archive_path,
            'extract_to': extract_to,
            'extracted_files': extracted_files,
            'total_files': len(extracted_files)
        }
    
    def _detect_file_format(self, file_path: str, content: str) -> str:
        """Auto-detect file format"""
        
        extension = os.path.splitext(file_path)[1].lower()
        
        if extension in ['.json']:
            return 'json'
        elif extension in ['.csv']:
            return 'csv'
        elif extension in ['.txt', '.md']:
            return 'text'
        elif extension in ['.yaml', '.yml']:
            return 'yaml'
        elif extension in ['.xml']:
            return 'xml'
        else:
            # Try to detect by content
            try:
                json.loads(content)
                return 'json'
            except:
                pass
            
            if ',' in content and '\n' in content:
                return 'csv'
            
            return 'text'
    
    def _parse_content(self, content: str, file_format: str) -> Any:
        """Parse content based on format"""
        
        if file_format == 'json':
            try:
                return json.loads(content)
            except json.JSONDecodeError:
                return content
        elif file_format == 'csv':
            try:
                import io
                csv_reader = csv.DictReader(io.StringIO(content))
                return list(csv_reader)
            except:
                return content
        elif file_format == 'yaml':
            try:
                import yaml
                return yaml.safe_load(content)
            except:
                return content
        else:
            return content
    
    def _list_to_csv(self, data: List[Dict[str, Any]]) -> str:
        """Convert list of dictionaries to CSV string"""
        
        if not data:
            return ""
        
        import io
        output = io.StringIO()
        writer = csv.DictWriter(output, fieldnames=data[0].keys())
        writer.writeheader()
        writer.writerows(data)
        return output.getvalue()
    
    def _matches_pattern(self, filename: str, pattern: str) -> bool:
        """Check if filename matches pattern"""
        
        import fnmatch
        return fnmatch.fnmatch(filename, pattern)
    
    def _get_supported_formats(self) -> List[str]:
        """Get list of supported file formats"""
        
        return ['json', 'csv', 'text', 'yaml', 'xml', 'auto']

