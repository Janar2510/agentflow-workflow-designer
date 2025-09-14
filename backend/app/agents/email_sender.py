import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from typing import Dict, Any, List, Optional
from datetime import datetime
import asyncio
import aiofiles

class EmailSenderAgent:
    """Custom agent for sending emails with various configurations"""
    
    def __init__(self, config: Dict[str, Any], llm=None):
        self.config = config
        self.llm = llm
        self.smtp_server = config.get('smtp_server', 'smtp.gmail.com')
        self.smtp_port = config.get('smtp_port', 587)
        self.username = config.get('username')
        self.password = config.get('password')
        self.use_tls = config.get('use_tls', True)
        self.use_ssl = config.get('use_ssl', False)
    
    async def execute(self, input_data: Dict[str, Any], context: Any) -> Dict[str, Any]:
        """Execute email sending operation"""
        
        try:
            # Extract email parameters
            to_emails = input_data.get('to', [])
            cc_emails = input_data.get('cc', [])
            bcc_emails = input_data.get('bcc', [])
            subject = input_data.get('subject', '')
            body = input_data.get('body', '')
            html_body = input_data.get('html_body')
            attachments = input_data.get('attachments', [])
            from_email = input_data.get('from', self.username)
            
            # Validate required fields
            if not to_emails:
                raise ValueError("Recipient email addresses are required")
            
            if not subject:
                raise ValueError("Email subject is required")
            
            if not body and not html_body:
                raise ValueError("Email body or HTML body is required")
            
            # Create email message
            message = await self._create_email_message(
                from_email=from_email,
                to_emails=to_emails,
                cc_emails=cc_emails,
                bcc_emails=bcc_emails,
                subject=subject,
                body=body,
                html_body=html_body,
                attachments=attachments
            )
            
            # Send email
            result = await self._send_email(message, to_emails + cc_emails + bcc_emails)
            
            return {
                'output': result,
                'variables': {
                    'email_sent': True,
                    'recipients_count': len(to_emails),
                    'attachments_count': len(attachments),
                    'message_id': result.get('message_id')
                }
            }
            
        except Exception as e:
            return {
                'output': {'error': str(e)},
                'variables': {
                    'email_sent': False,
                    'error_message': str(e)
                }
            }
    
    async def _create_email_message(
        self,
        from_email: str,
        to_emails: List[str],
        cc_emails: List[str],
        bcc_emails: List[str],
        subject: str,
        body: str,
        html_body: Optional[str],
        attachments: List[Dict[str, Any]]
    ) -> MIMEMultipart:
        """Create email message with all components"""
        
        # Create message container
        message = MIMEMultipart('alternative')
        message['From'] = from_email
        message['To'] = ', '.join(to_emails)
        message['Subject'] = subject
        
        if cc_emails:
            message['Cc'] = ', '.join(cc_emails)
        
        # Add text body
        if body:
            text_part = MIMEText(body, 'plain', 'utf-8')
            message.attach(text_part)
        
        # Add HTML body
        if html_body:
            html_part = MIMEText(html_body, 'html', 'utf-8')
            message.attach(html_part)
        
        # Add attachments
        for attachment in attachments:
            await self._add_attachment(message, attachment)
        
        return message
    
    async def _add_attachment(self, message: MIMEMultipart, attachment: Dict[str, Any]) -> None:
        """Add attachment to email message"""
        
        file_path = attachment.get('file_path')
        file_content = attachment.get('content')
        filename = attachment.get('filename')
        mime_type = attachment.get('mime_type', 'application/octet-stream')
        
        if file_path:
            # Read file from path
            async with aiofiles.open(file_path, 'rb') as f:
                file_data = await f.read()
            if not filename:
                filename = file_path.split('/')[-1]
        elif file_content:
            # Use provided content
            file_data = file_content.encode() if isinstance(file_content, str) else file_content
        else:
            raise ValueError("Either file_path or content must be provided for attachment")
        
        # Create attachment
        part = MIMEBase(*mime_type.split('/'))
        part.set_payload(file_data)
        encoders.encode_base64(part)
        part.add_header(
            'Content-Disposition',
            f'attachment; filename= {filename}'
        )
        message.attach(part)
    
    async def _send_email(self, message: MIMEMultipart, all_recipients: List[str]) -> Dict[str, Any]:
        """Send email using SMTP"""
        
        if not self.username or not self.password:
            raise ValueError("SMTP username and password must be configured")
        
        # Create SMTP session
        if self.use_ssl:
            context = ssl.create_default_context()
            server = smtplib.SMTP_SSL(self.smtp_server, self.smtp_port, context=context)
        else:
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            if self.use_tls:
                server.starttls()
        
        try:
            # Login and send email
            server.login(self.username, self.password)
            text = message.as_string()
            server.sendmail(message['From'], all_recipients, text)
            
            return {
                'status': 'sent',
                'message_id': message.get('Message-ID'),
                'timestamp': datetime.utcnow().isoformat(),
                'recipients': all_recipients,
                'smtp_server': self.smtp_server
            }
            
        finally:
            server.quit()
    
    async def send_bulk_emails(self, email_templates: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Send multiple emails with different content"""
        
        results = []
        successful = 0
        failed = 0
        
        for template in email_templates:
            try:
                result = await self.execute(template, None)
                results.append(result)
                if result['variables']['email_sent']:
                    successful += 1
                else:
                    failed += 1
            except Exception as e:
                results.append({
                    'output': {'error': str(e)},
                    'variables': {'email_sent': False, 'error_message': str(e)}
                })
                failed += 1
        
        return {
            'bulk_send_results': results,
            'total_emails': len(email_templates),
            'successful': successful,
            'failed': failed,
            'success_rate': (successful / len(email_templates)) * 100 if email_templates else 0
        }
    
    async def send_template_email(
        self,
        template_path: str,
        template_variables: Dict[str, Any],
        to_emails: List[str],
        subject: str,
        **kwargs
    ) -> Dict[str, Any]:
        """Send email using HTML template"""
        
        try:
            # Load template
            async with aiofiles.open(template_path, 'r', encoding='utf-8') as f:
                template_content = await f.read()
            
            # Replace variables in template
            html_body = template_content
            for key, value in template_variables.items():
                html_body = html_body.replace(f'{{{{{key}}}}}', str(value))
            
            # Send email
            email_data = {
                'to': to_emails,
                'subject': subject,
                'html_body': html_body,
                **kwargs
            }
            
            return await self.execute(email_data, None)
            
        except Exception as e:
            return {
                'output': {'error': str(e)},
                'variables': {
                    'email_sent': False,
                    'error_message': str(e)
                }
            }
    
    def validate_email_address(self, email: str) -> bool:
        """Validate email address format"""
        
        import re
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(pattern, email) is not None
    
    async def get_email_servers(self, domain: str) -> List[Dict[str, Any]]:
        """Get SMTP servers for a domain"""
        
        import dns.resolver
        
        try:
            mx_records = dns.resolver.resolve(domain, 'MX')
            servers = []
            
            for record in mx_records:
                servers.append({
                    'host': str(record.exchange),
                    'priority': record.preference
                })
            
            return sorted(servers, key=lambda x: x['priority'])
            
        except Exception as e:
            return [{'error': str(e)}]
    
    def create_email_signature(self, name: str, title: str, company: str, **kwargs) -> str:
        """Create professional email signature"""
        
        signature = f"""
{name}
{title}
{company}

"""
        
        if 'phone' in kwargs:
            signature += f"Phone: {kwargs['phone']}\n"
        if 'email' in kwargs:
            signature += f"Email: {kwargs['email']}\n"
        if 'website' in kwargs:
            signature += f"Website: {kwargs['website']}\n"
        
        return signature.strip()
    
    async def schedule_email(
        self,
        email_data: Dict[str, Any],
        send_time: datetime,
        **kwargs
    ) -> Dict[str, Any]:
        """Schedule email for future sending (requires external scheduler)"""
        
        # This would typically integrate with a job queue like Celery or RQ
        # For now, we'll just return the scheduled information
        
        return {
            'output': {
                'scheduled': True,
                'send_time': send_time.isoformat(),
                'email_data': email_data,
                'note': 'Email scheduling requires external job queue integration'
            },
            'variables': {
                'email_scheduled': True,
                'scheduled_time': send_time.isoformat()
            }
        }

