import asyncio
import logging
from typing import Dict, Any, List, Optional, Union
from datetime import datetime
import json
import sqlite3
import psycopg2
import pymysql
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
import pandas as pd

logger = logging.getLogger(__name__)

class DatabaseQueryAgent:
    """Custom agent for database operations and queries"""
    
    def __init__(self, config: Dict[str, Any], llm=None):
        self.config = config
        self.llm = llm
        self.db_type = config.get('db_type', 'sqlite')
        self.connection_string = config.get('connection_string')
        self.host = config.get('host', 'localhost')
        self.port = config.get('port', 5432)
        self.database = config.get('database')
        self.username = config.get('username')
        self.password = config.get('password')
        self.engine = None
        self.Session = None
    
    async def execute(self, input_data: Dict[str, Any], context: Any) -> Dict[str, Any]:
        """Execute database operation"""
        
        try:
            operation = input_data.get('operation', 'query')
            query = input_data.get('query')
            parameters = input_data.get('parameters', {})
            
            if not query:
                raise ValueError("SQL query is required")
            
            # Initialize database connection if needed
            if not self.engine:
                await self._initialize_connection()
            
            # Execute operation
            if operation == 'query':
                result = await self._execute_query(query, parameters)
            elif operation == 'insert':
                result = await self._execute_insert(query, parameters)
            elif operation == 'update':
                result = await self._execute_update(query, parameters)
            elif operation == 'delete':
                result = await self._execute_delete(query, parameters)
            elif operation == 'create_table':
                result = await self._execute_create_table(query, parameters)
            elif operation == 'drop_table':
                result = await self._execute_drop_table(query, parameters)
            elif operation == 'describe_table':
                result = await self._describe_table(query, parameters)
            elif operation == 'list_tables':
                result = await self._list_tables()
            else:
                raise ValueError(f"Unsupported operation: {operation}")
            
            return {
                'output': result,
                'variables': {
                    'operation_success': True,
                    'rows_affected': result.get('rows_affected', 0),
                    'operation_type': operation
                }
            }
            
        except Exception as e:
            logger.error(f"Database operation failed: {e}", exc_info=True)
            return {
                'output': {'error': str(e)},
                'variables': {
                    'operation_success': False,
                    'error_message': str(e)
                }
            }
    
    async def _initialize_connection(self):
        """Initialize database connection"""
        
        if self.connection_string:
            self.engine = create_engine(self.connection_string)
        else:
            # Build connection string based on database type
            if self.db_type == 'postgresql':
                conn_str = f"postgresql://{self.username}:{self.password}@{self.host}:{self.port}/{self.database}"
            elif self.db_type == 'mysql':
                conn_str = f"mysql+pymysql://{self.username}:{self.password}@{self.host}:{self.port}/{self.database}"
            elif self.db_type == 'sqlite':
                conn_str = f"sqlite:///{self.database}"
            else:
                raise ValueError(f"Unsupported database type: {self.db_type}")
            
            self.engine = create_engine(conn_str)
        
        self.Session = sessionmaker(bind=self.engine)
    
    async def _execute_query(self, query: str, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Execute SELECT query"""
        
        with self.engine.connect() as connection:
            result = connection.execute(text(query), parameters)
            
            # Convert to list of dictionaries
            columns = result.keys()
            rows = result.fetchall()
            
            data = []
            for row in rows:
                row_dict = {}
                for i, column in enumerate(columns):
                    value = row[i]
                    # Convert datetime objects to ISO format
                    if isinstance(value, datetime):
                        value = value.isoformat()
                    row_dict[column] = value
                data.append(row_dict)
            
            return {
                'data': data,
                'columns': list(columns),
                'row_count': len(data),
                'query': query
            }
    
    async def _execute_insert(self, query: str, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Execute INSERT query"""
        
        with self.engine.connect() as connection:
            result = connection.execute(text(query), parameters)
            connection.commit()
            
            return {
                'rows_affected': result.rowcount,
                'query': query,
                'operation': 'insert'
            }
    
    async def _execute_update(self, query: str, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Execute UPDATE query"""
        
        with self.engine.connect() as connection:
            result = connection.execute(text(query), parameters)
            connection.commit()
            
            return {
                'rows_affected': result.rowcount,
                'query': query,
                'operation': 'update'
            }
    
    async def _execute_delete(self, query: str, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Execute DELETE query"""
        
        with self.engine.connect() as connection:
            result = connection.execute(text(query), parameters)
            connection.commit()
            
            return {
                'rows_affected': result.rowcount,
                'query': query,
                'operation': 'delete'
            }
    
    async def _execute_create_table(self, query: str, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Execute CREATE TABLE query"""
        
        with self.engine.connect() as connection:
            connection.execute(text(query), parameters)
            connection.commit()
            
            return {
                'query': query,
                'operation': 'create_table',
                'success': True
            }
    
    async def _execute_drop_table(self, query: str, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Execute DROP TABLE query"""
        
        with self.engine.connect() as connection:
            connection.execute(text(query), parameters)
            connection.commit()
            
            return {
                'query': query,
                'operation': 'drop_table',
                'success': True
            }
    
    async def _describe_table(self, table_name: str, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Describe table structure"""
        
        if self.db_type == 'postgresql':
            query = """
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns
            WHERE table_name = :table_name
            ORDER BY ordinal_position
            """
        elif self.db_type == 'mysql':
            query = f"DESCRIBE {table_name}"
        elif self.db_type == 'sqlite':
            query = f"PRAGMA table_info({table_name})"
        else:
            raise ValueError(f"Table description not supported for {self.db_type}")
        
        with self.engine.connect() as connection:
            result = connection.execute(text(query), {'table_name': table_name})
            columns = result.keys()
            rows = result.fetchall()
            
            data = []
            for row in rows:
                row_dict = {}
                for i, column in enumerate(columns):
                    row_dict[column] = row[i]
                data.append(row_dict)
            
            return {
                'table_name': table_name,
                'columns': data,
                'column_count': len(data)
            }
    
    async def _list_tables(self) -> Dict[str, Any]:
        """List all tables in the database"""
        
        if self.db_type == 'postgresql':
            query = """
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
            """
        elif self.db_type == 'mysql':
            query = "SHOW TABLES"
        elif self.db_type == 'sqlite':
            query = "SELECT name FROM sqlite_master WHERE type='table'"
        else:
            raise ValueError(f"Table listing not supported for {self.db_type}")
        
        with self.engine.connect() as connection:
            result = connection.execute(text(query))
            tables = [row[0] for row in result.fetchall()]
            
            return {
                'tables': tables,
                'table_count': len(tables)
            }
    
    async def execute_batch_queries(self, queries: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Execute multiple queries in a transaction"""
        
        results = []
        successful = 0
        failed = 0
        
        with self.engine.connect() as connection:
            transaction = connection.begin()
            
            try:
                for query_data in queries:
                    try:
                        query = query_data['query']
                        parameters = query_data.get('parameters', {})
                        operation = query_data.get('operation', 'query')
                        
                        result = connection.execute(text(query), parameters)
                        
                        if operation in ['insert', 'update', 'delete']:
                            rows_affected = result.rowcount
                        else:
                            rows_affected = 0
                        
                        results.append({
                            'query': query,
                            'operation': operation,
                            'success': True,
                            'rows_affected': rows_affected
                        })
                        successful += 1
                        
                    except Exception as e:
                        results.append({
                            'query': query_data.get('query', ''),
                            'operation': query_data.get('operation', 'query'),
                            'success': False,
                            'error': str(e)
                        })
                        failed += 1
                
                transaction.commit()
                
            except Exception as e:
                transaction.rollback()
                raise e
        
        return {
            'batch_results': results,
            'total_queries': len(queries),
            'successful': successful,
            'failed': failed,
            'success_rate': (successful / len(queries)) * 100 if queries else 0
        }
    
    async def export_to_csv(self, query: str, output_path: str, parameters: Dict[str, Any] = None) -> Dict[str, Any]:
        """Export query results to CSV file"""
        
        with self.engine.connect() as connection:
            result = connection.execute(text(query), parameters or {})
            df = pd.DataFrame(result.fetchall(), columns=result.keys())
            df.to_csv(output_path, index=False)
            
            return {
                'output_path': output_path,
                'rows_exported': len(df),
                'columns_exported': len(df.columns),
                'query': query
            }
    
    async def import_from_csv(self, table_name: str, csv_path: str, **kwargs) -> Dict[str, Any]:
        """Import data from CSV file to table"""
        
        df = pd.read_csv(csv_path)
        
        with self.engine.connect() as connection:
            df.to_sql(table_name, connection, if_exists=kwargs.get('if_exists', 'append'), index=False)
            
            return {
                'table_name': table_name,
                'rows_imported': len(df),
                'columns_imported': len(df.columns),
                'csv_path': csv_path
            }
    
    def validate_query(self, query: str) -> Dict[str, Any]:
        """Validate SQL query syntax"""
        
        try:
            # Basic validation - check for dangerous operations
            dangerous_keywords = ['DROP', 'DELETE', 'TRUNCATE', 'ALTER', 'CREATE', 'INSERT', 'UPDATE']
            query_upper = query.upper()
            
            warnings = []
            for keyword in dangerous_keywords:
                if keyword in query_upper:
                    warnings.append(f"Query contains {keyword} operation")
            
            # Check for basic SQL structure
            if not any(keyword in query_upper for keyword in ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP']):
                return {
                    'valid': False,
                    'error': 'Query does not contain valid SQL operation'
                }
            
            return {
                'valid': True,
                'warnings': warnings,
                'query_type': self._detect_query_type(query)
            }
            
        except Exception as e:
            return {
                'valid': False,
                'error': str(e)
            }
    
    def _detect_query_type(self, query: str) -> str:
        """Detect the type of SQL query"""
        
        query_upper = query.upper().strip()
        
        if query_upper.startswith('SELECT'):
            return 'SELECT'
        elif query_upper.startswith('INSERT'):
            return 'INSERT'
        elif query_upper.startswith('UPDATE'):
            return 'UPDATE'
        elif query_upper.startswith('DELETE'):
            return 'DELETE'
        elif query_upper.startswith('CREATE'):
            return 'CREATE'
        elif query_upper.startswith('DROP'):
            return 'DROP'
        else:
            return 'UNKNOWN'
    
    async def get_database_info(self) -> Dict[str, Any]:
        """Get database information and statistics"""
        
        with self.engine.connect() as connection:
            if self.db_type == 'postgresql':
                # Get database size
                size_query = "SELECT pg_size_pretty(pg_database_size(current_database())) as size"
                size_result = connection.execute(text(size_query)).fetchone()
                
                # Get table count
                table_count_query = """
                SELECT COUNT(*) as table_count
                FROM information_schema.tables
                WHERE table_schema = 'public'
                """
                table_count_result = connection.execute(text(table_count_query)).fetchone()
                
                return {
                    'database_type': 'PostgreSQL',
                    'database_size': size_result[0] if size_result else 'Unknown',
                    'table_count': table_count_result[0] if table_count_result else 0,
                    'connection_string': str(self.engine.url).replace(self.password, '***') if self.password else str(self.engine.url)
                }
            
            elif self.db_type == 'mysql':
                # Get database size
                size_query = "SELECT ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'DB Size in MB' FROM information_schema.tables WHERE table_schema = DATABASE()"
                size_result = connection.execute(text(size_query)).fetchone()
                
                # Get table count
                table_count_query = "SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = DATABASE()"
                table_count_result = connection.execute(text(table_count_query)).fetchone()
                
                return {
                    'database_type': 'MySQL',
                    'database_size': f"{size_result[0]} MB" if size_result else 'Unknown',
                    'table_count': table_count_result[0] if table_count_result else 0,
                    'connection_string': str(self.engine.url).replace(self.password, '***') if self.password else str(self.engine.url)
                }
            
            elif self.db_type == 'sqlite':
                # Get database file size
                import os
                db_path = self.database
                file_size = os.path.getsize(db_path) if os.path.exists(db_path) else 0
                
                # Get table count
                table_count_query = "SELECT COUNT(*) as table_count FROM sqlite_master WHERE type='table'"
                table_count_result = connection.execute(text(table_count_query)).fetchone()
                
                return {
                    'database_type': 'SQLite',
                    'database_size': f"{file_size / 1024 / 1024:.2f} MB",
                    'table_count': table_count_result[0] if table_count_result else 0,
                    'database_path': db_path
                }
            
            else:
                return {
                    'database_type': self.db_type,
                    'connection_string': str(self.engine.url).replace(self.password, '***') if self.password else str(self.engine.url)
                }

