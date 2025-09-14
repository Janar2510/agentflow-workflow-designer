import ast
import re
import asyncio
from typing import Dict, Any, List
from datetime import datetime

class CodeAnalyzerAgent:
    """Custom agent for analyzing code quality, security, and best practices"""
    
    def __init__(self, config: Dict[str, Any], llm=None):
        self.config = config
        self.llm = llm
        self.security_patterns = self._load_security_patterns()
        self.quality_rules = self._load_quality_rules()
    
    async def execute(self, input_data: Dict[str, Any], context: Any) -> Dict[str, Any]:
        """Execute code analysis"""
        
        code = input_data.get('code', '')
        language = input_data.get('language', 'python')
        
        if not code:
            raise ValueError("No code provided for analysis")
        
        analysis_results = {
            'language': language,
            'timestamp': datetime.utcnow().isoformat(),
            'analysis': {}
        }
        
        if language.lower() == 'python':
            analysis_results['analysis'] = await self._analyze_python_code(code)
        elif language.lower() in ['javascript', 'typescript']:
            analysis_results['analysis'] = await self._analyze_javascript_code(code)
        else:
            analysis_results['analysis'] = await self._analyze_generic_code(code, language)
        
        # Generate summary and recommendations
        analysis_results['summary'] = self._generate_summary(analysis_results['analysis'])
        analysis_results['recommendations'] = self._generate_recommendations(analysis_results['analysis'])
        
        return {
            'output': analysis_results,
            'variables': {
                'code_quality_score': analysis_results['analysis'].get('quality_score', 0),
                'security_issues_count': len(analysis_results['analysis'].get('security_issues', [])),
                'total_lines': analysis_results['analysis'].get('total_lines', 0)
            }
        }
    
    async def _analyze_python_code(self, code: str) -> Dict[str, Any]:
        """Analyze Python code specifically"""
        
        try:
            tree = ast.parse(code)
        except SyntaxError as e:
            return {
                'syntax_errors': [str(e)],
                'quality_score': 0,
                'analysis_status': 'failed'
            }
        
        analysis = {
            'syntax_errors': [],
            'security_issues': [],
            'quality_issues': [],
            'complexity_metrics': {},
            'total_lines': len(code.splitlines()),
            'analysis_status': 'completed'
        }
        
        # Security analysis
        security_issues = self._check_security_patterns(code)
        analysis['security_issues'] = security_issues
        
        # Complexity analysis
        complexity = self._calculate_complexity(tree)
        analysis['complexity_metrics'] = complexity
        
        # Code quality checks
        quality_issues = self._check_code_quality(code, tree)
        analysis['quality_issues'] = quality_issues
        
        # Calculate overall quality score
        analysis['quality_score'] = self._calculate_quality_score(analysis)
        
        return analysis
    
    async def _analyze_javascript_code(self, code: str) -> Dict[str, Any]:
        """Analyze JavaScript/TypeScript code"""
        
        analysis = {
            'security_issues': [],
            'quality_issues': [],
            'total_lines': len(code.splitlines()),
            'analysis_status': 'completed'
        }
        
        # Basic pattern-based analysis for JavaScript
        security_issues = self._check_security_patterns(code)
        analysis['security_issues'] = security_issues
        
        # JavaScript-specific quality checks
        quality_issues = self._check_js_quality(code)
        analysis['quality_issues'] = quality_issues
        
        analysis['quality_score'] = self._calculate_quality_score(analysis)
        
        return analysis
    
    async def _analyze_generic_code(self, code: str, language: str) -> Dict[str, Any]:
        """Generic code analysis for unsupported languages"""
        
        analysis = {
            'security_issues': [],
            'quality_issues': [],
            'total_lines': len(code.splitlines()),
            'analysis_status': 'limited',
            'message': f'Limited analysis available for {language}'
        }
        
        # Basic security pattern checking
        security_issues = self._check_security_patterns(code)
        analysis['security_issues'] = security_issues
        
        analysis['quality_score'] = max(50, 100 - len(security_issues) * 10)
        
        return analysis
    
    def _check_security_patterns(self, code: str) -> List[Dict[str, Any]]:
        """Check for common security vulnerabilities"""
        
        issues = []
        
        for pattern_name, pattern_info in self.security_patterns.items():
            matches = re.finditer(pattern_info['pattern'], code, re.IGNORECASE | re.MULTILINE)
            
            for match in matches:
                line_number = code[:match.start()].count('\n') + 1
                issues.append({
                    'type': 'security',
                    'severity': pattern_info['severity'],
                    'pattern': pattern_name,
                    'description': pattern_info['description'],
                    'line': line_number,
                    'matched_text': match.group(0),
                    'recommendation': pattern_info['recommendation']
                })
        
        return issues
    
    def _calculate_complexity(self, tree: ast.AST) -> Dict[str, Any]:
        """Calculate cyclomatic complexity and other metrics"""
        
        class ComplexityVisitor(ast.NodeVisitor):
            def __init__(self):
                self.complexity = 1  # Base complexity
                self.functions = 0
                self.classes = 0
                self.max_depth = 0
                self.current_depth = 0
            
            def visit_If(self, node):
                self.complexity += 1
                self._visit_with_depth(node)
            
            def visit_For(self, node):
                self.complexity += 1
                self._visit_with_depth(node)
            
            def visit_While(self, node):
                self.complexity += 1
                self._visit_with_depth(node)
            
            def visit_Try(self, node):
                self.complexity += 1
                self._visit_with_depth(node)
            
            def visit_FunctionDef(self, node):
                self.functions += 1
                self._visit_with_depth(node)
            
            def visit_ClassDef(self, node):
                self.classes += 1
                self._visit_with_depth(node)
            
            def _visit_with_depth(self, node):
                self.current_depth += 1
                self.max_depth = max(self.max_depth, self.current_depth)
                self.generic_visit(node)
                self.current_depth -= 1
        
        visitor = ComplexityVisitor()
        visitor.visit(tree)
        
        return {
            'cyclomatic_complexity': visitor.complexity,
            'function_count': visitor.functions,
            'class_count': visitor.classes,
            'max_nesting_depth': visitor.max_depth
        }
    
    def _check_code_quality(self, code: str, tree: ast.AST) -> List[Dict[str, Any]]:
        """Check for code quality issues"""
        
        issues = []
        
        # Check line length
        for i, line in enumerate(code.splitlines(), 1):
            if len(line) > 120:
                issues.append({
                    'type': 'quality',
                    'severity': 'low',
                    'description': f'Line too long ({len(line)} characters)',
                    'line': i,
                    'recommendation': 'Keep lines under 120 characters'
                })
        
        # Check for TODO/FIXME comments
        todo_pattern = re.compile(r'#\s*(TODO|FIXME|XXX|HACK)', re.IGNORECASE)
        for i, line in enumerate(code.splitlines(), 1):
            if todo_pattern.search(line):
                issues.append({
                    'type': 'quality',
                    'severity': 'info',
                    'description': 'Found TODO/FIXME comment',
                    'line': i,
                    'recommendation': 'Consider addressing pending tasks'
                })
        
        return issues
    
    def _check_js_quality(self, code: str) -> List[Dict[str, Any]]:
        """JavaScript-specific quality checks"""
        
        issues = []
        
        # Check for var usage (prefer let/const)
        var_pattern = re.compile(r'\bvar\s+\w+', re.MULTILINE)
        for match in var_pattern.finditer(code):
            line_number = code[:match.start()].count('\n') + 1
            issues.append({
                'type': 'quality',
                'severity': 'medium',
                'description': 'Use of var instead of let/const',
                'line': line_number,
                'recommendation': 'Use let or const instead of var'
            })
        
        # Check for console.log in production code
        console_pattern = re.compile(r'console\.(log|debug|info)', re.MULTILINE)
        for match in console_pattern.finditer(code):
            line_number = code[:match.start()].count('\n') + 1
            issues.append({
                'type': 'quality',
                'severity': 'low',
                'description': 'Console statement found',
                'line': line_number,
                'recommendation': 'Remove console statements from production code'
            })
        
        return issues
    
    def _calculate_quality_score(self, analysis: Dict[str, Any]) -> int:
        """Calculate overall quality score (0-100)"""
        
        base_score = 100
        
        # Deduct points for security issues
        security_issues = analysis.get('security_issues', [])
        for issue in security_issues:
            if issue['severity'] == 'critical':
                base_score -= 20
            elif issue['severity'] == 'high':
                base_score -= 10
            elif issue['severity'] == 'medium':
                base_score -= 5
            else:
                base_score -= 2
        
        # Deduct points for quality issues
        quality_issues = analysis.get('quality_issues', [])
        for issue in quality_issues:
            if issue['severity'] == 'high':
                base_score -= 5
            elif issue['severity'] == 'medium':
                base_score -= 3
            else:
                base_score -= 1
        
        # Deduct points for high complexity
        complexity = analysis.get('complexity_metrics', {})
        cyclomatic = complexity.get('cyclomatic_complexity', 1)
        if cyclomatic > 20:
            base_score -= 15
        elif cyclomatic > 10:
            base_score -= 10
        elif cyclomatic > 5:
            base_score -= 5
        
        return max(0, min(100, base_score))
    
    def _generate_summary(self, analysis: Dict[str, Any]) -> str:
        """Generate human-readable summary"""
        
        security_count = len(analysis.get('security_issues', []))
        quality_count = len(analysis.get('quality_issues', []))
        score = analysis.get('quality_score', 0)
        
        if score >= 90:
            quality_level = "Excellent"
        elif score >= 75:
            quality_level = "Good"
        elif score >= 50:
            quality_level = "Fair"
        else:
            quality_level = "Poor"
        
        summary = f"Code quality: {quality_level} (Score: {score}/100). "
        
        if security_count > 0:
            summary += f"Found {security_count} security issue(s). "
        else:
            summary += "No security issues detected. "
        
        if quality_count > 0:
            summary += f"Found {quality_count} quality issue(s)."
        else:
            summary += "No quality issues detected."
        
        return summary
    
    def _generate_recommendations(self, analysis: Dict[str, Any]) -> List[str]:
        """Generate actionable recommendations"""
        
        recommendations = []
        
        security_issues = analysis.get('security_issues', [])
        critical_security = [i for i in security_issues if i['severity'] == 'critical']
        
        if critical_security:
            recommendations.append("🚨 Address critical security vulnerabilities immediately")
        
        complexity = analysis.get('complexity_metrics', {})
        if complexity.get('cyclomatic_complexity', 1) > 10:
            recommendations.append("🔄 Consider refactoring complex functions to improve maintainability")
        
        if analysis.get('total_lines', 0) > 1000:
            recommendations.append("📦 Consider breaking large files into smaller modules")
        
        quality_issues = analysis.get('quality_issues', [])
        if len(quality_issues) > 10:
            recommendations.append("🧹 Clean up code quality issues to improve readability")
        
        if not recommendations:
            recommendations.append("✅ Code looks good! Consider adding more comprehensive tests")
        
        return recommendations
    
    def _load_security_patterns(self) -> Dict[str, Dict[str, str]]:
        """Load security vulnerability patterns"""
        
        return {
            'sql_injection': {
                'pattern': r'(execute|query|cursor\.execute)\s*\(\s*["\'].*%[sd].*["\']',
                'severity': 'critical',
                'description': 'Potential SQL injection vulnerability',
                'recommendation': 'Use parameterized queries or prepared statements'
            },
            'hardcoded_password': {
                'pattern': r'(password|pwd|pass)\s*=\s*["\'][^"\']{3,}["\']',
                'severity': 'high',
                'description': 'Hardcoded password detected',
                'recommendation': 'Use environment variables or secure configuration'
            },
            'eval_usage': {
                'pattern': r'\beval\s*\(',
                'severity': 'high',
                'description': 'Use of eval() function',
                'recommendation': 'Avoid eval() as it can execute arbitrary code'
            },
            'md5_usage': {
                'pattern': r'\bmd5\s*\(',
                'severity': 'medium',
                'description': 'Use of MD5 hash algorithm',
                'recommendation': 'Use SHA-256 or stronger hash algorithms'
            }
        }
    
    def _load_quality_rules(self) -> Dict[str, Dict[str, str]]:
        """Load code quality rules"""
        
        return {
            'long_lines': {
                'pattern': r'.{121,}',
                'severity': 'low',
                'description': 'Line too long',
                'recommendation': 'Keep lines under 120 characters'
            },
            'trailing_whitespace': {
                'pattern': r' +$',
                'severity': 'low',
                'description': 'Trailing whitespace',
                'recommendation': 'Remove trailing whitespace'
            }
        }