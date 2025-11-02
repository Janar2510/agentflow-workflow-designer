import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import './AuthPage.css'

export const TermsOfServicePage: React.FC = () => {
  return (
    <div className="auth-page">
      <div className="auth-container" style={{ maxWidth: '900px' }}>
        <Link to="/" className="auth-back-link">
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <div className="auth-card">
          <div style={{ padding: '40px' }}>
            <h1 className="auth-title" style={{ marginBottom: '16px', textAlign: 'left' }}>
              Terms of Service
            </h1>
            <p style={{ color: 'rgba(255, 255, 255, 0.6)', marginBottom: '40px', fontSize: '16px' }}>
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <div style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.8', fontSize: '15px' }}>
              <section style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff', marginBottom: '16px', background: 'linear-gradient(135deg, #8BE9FD 0%, #FF79C6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  1. Agreement to Terms
                </h2>
                <p style={{ marginBottom: '16px' }}>
                  By accessing or using AgentFlow ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the Service.
                </p>
                <p>
                  These Terms apply to all users, including visitors, registered users, and contributors of content, services, or other materials on the platform.
                </p>
              </section>

              <section style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff', marginBottom: '16px', background: 'linear-gradient(135deg, #8BE9FD 0%, #FF79C6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  2. Description of Service
                </h2>
                <p style={{ marginBottom: '12px' }}>
                  AgentFlow is a visual workflow automation platform that enables users to:
                </p>
                <ul style={{ marginLeft: '24px', marginBottom: '16px' }}>
                  <li>Create, design, and execute AI-powered workflows</li>
                  <li>Integrate with various third-party services and APIs</li>
                  <li>Collaborate with team members on workflow projects</li>
                  <li>Share and discover workflow templates</li>
                  <li>Access community features and resources</li>
                </ul>
                <p>
                  We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time, with or without notice.
                </p>
              </section>

              <section style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff', marginBottom: '16px', background: 'linear-gradient(135deg, #8BE9FD 0%, #FF79C6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  3. User Accounts
                </h2>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#ffffff', marginTop: '24px', marginBottom: '12px' }}>
                  3.1 Registration
                </h3>
                <p style={{ marginBottom: '16px' }}>
                  To access certain features, you must create an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate and current.
                </p>

                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#ffffff', marginTop: '24px', marginBottom: '12px' }}>
                  3.2 Account Security
                </h3>
                <p style={{ marginBottom: '12px' }}>
                  You are responsible for:
                </p>
                <ul style={{ marginLeft: '24px', marginBottom: '16px' }}>
                  <li>Maintaining the confidentiality of your account credentials</li>
                  <li>All activities that occur under your account</li>
                  <li>Notifying us immediately of any unauthorized use</li>
                  <li>Ensuring you log out from shared devices</li>
                </ul>

                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#ffffff', marginTop: '24px', marginBottom: '12px' }}>
                  3.3 Account Termination
                </h3>
                <p>
                  We reserve the right to suspend or terminate your account at any time for violation of these Terms, fraudulent activity, or any other reason we deem necessary.
                </p>
              </section>

              <section style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff', marginBottom: '16px', background: 'linear-gradient(135deg, #8BE9FD 0%, #FF79C6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  4. Acceptable Use
                </h2>
                <p style={{ marginBottom: '12px' }}>
                  You agree not to use the Service to:
                </p>
                <ul style={{ marginLeft: '24px', marginBottom: '16px' }}>
                  <li>Violate any applicable laws, regulations, or third-party rights</li>
                  <li>Transmit malware, viruses, or any harmful code</li>
                  <li>Engage in unauthorized access to other systems or data</li>
                  <li>Spam, harass, or abuse other users</li>
                  <li>Impersonate others or misrepresent your identity</li>
                  <li>Interfere with or disrupt the Service or servers</li>
                  <li>Reverse engineer, decompile, or attempt to extract source code</li>
                  <li>Use automated systems to access the Service without permission</li>
                </ul>
                <p>
                  Violation of these rules may result in immediate account termination and legal action.
                </p>
              </section>

              <section style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff', marginBottom: '16px', background: 'linear-gradient(135deg, #8BE9FD 0%, #FF79C6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  5. Intellectual Property
                </h2>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#ffffff', marginTop: '24px', marginBottom: '12px' }}>
                  5.1 Our Content
                </h3>
                <p style={{ marginBottom: '16px' }}>
                  The Service, including its original content, features, functionality, design, and trademarks, is owned by AgentFlow and protected by international copyright, trademark, and other intellectual property laws.
                </p>

                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#ffffff', marginTop: '24px', marginBottom: '12px' }}>
                  5.2 Your Content
                </h3>
                <p style={{ marginBottom: '12px' }}>
                  You retain ownership of content you create using the Service. By using the Service, you grant us:
                </p>
                <ul style={{ marginLeft: '24px', marginBottom: '16px' }}>
                  <li>A worldwide, non-exclusive, royalty-free license to use, store, and process your content to provide the Service</li>
                  <li>Permission to display your content on the platform</li>
                  <li>The right to create aggregated, anonymized analytics data</li>
                </ul>

                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#ffffff', marginTop: '24px', marginBottom: '12px' }}>
                  5.3 Third-Party Content
                </h3>
                <p>
                  The Service may include content from third parties. We are not responsible for the accuracy or availability of third-party content, and your use of such content is at your own risk.
                </p>
              </section>

              <section style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff', marginBottom: '16px', background: 'linear-gradient(135deg, #8BE9FD 0%, #FF79C6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  6. Payment Terms
                </h2>
                <p style={{ marginBottom: '12px' }}>
                  If you subscribe to premium features:
                </p>
                <ul style={{ marginLeft: '24px', marginBottom: '16px' }}>
                  <li>Fees are billed in advance on a recurring basis</li>
                  <li>All fees are non-refundable unless otherwise stated</li>
                  <li>You authorize us to charge your payment method automatically</li>
                  <li>Price changes will be communicated with at least 30 days notice</li>
                  <li>Failure to pay may result in service suspension</li>
                </ul>
              </section>

              <section style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff', marginBottom: '16px', background: 'linear-gradient(135deg, #8BE9FD 0%, #FF79C6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  7. Service Availability
                </h2>
                <p>
                  We strive to maintain high availability but do not guarantee uninterrupted, error-free service. The Service may be unavailable due to maintenance, updates, technical issues, or circumstances beyond our control. We are not liable for any damages resulting from service interruptions.
                </p>
              </section>

              <section style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff', marginBottom: '16px', background: 'linear-gradient(135deg, #8BE9FD 0%, #FF79C6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  8. Disclaimers and Limitations of Liability
                </h2>
                <p style={{ marginBottom: '12px' }}>
                  <strong>THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.</strong> We disclaim all warranties, including merchantability, fitness for a particular purpose, and non-infringement.
                </p>
                <p style={{ marginBottom: '12px' }}>
                  To the maximum extent permitted by law, AgentFlow shall not be liable for:
                </p>
                <ul style={{ marginLeft: '24px', marginBottom: '16px' }}>
                  <li>Indirect, incidental, special, or consequential damages</li>
                  <li>Loss of profits, data, or business opportunities</li>
                  <li>Damages resulting from use or inability to use the Service</li>
                  <li>Unauthorized access to or alteration of your data</li>
                </ul>
                <p>
                  Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim.
                </p>
              </section>

              <section style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff', marginBottom: '16px', background: 'linear-gradient(135deg, #8BE9FD 0%, #FF79C6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  9. Indemnification
                </h2>
                <p>
                  You agree to indemnify and hold harmless AgentFlow, its affiliates, officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from your use of the Service, violation of these Terms, or infringement of any rights of another.
                </p>
              </section>

              <section style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff', marginBottom: '16px', background: 'linear-gradient(135deg, #8BE9FD 0%, #FF79C6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  10. Modifications to Terms
                </h2>
                <p>
                  We reserve the right to modify these Terms at any time. We will notify you of material changes via email or prominent notice on the Service. Continued use of the Service after changes constitutes acceptance of the new Terms.
                </p>
              </section>

              <section style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff', marginBottom: '16px', background: 'linear-gradient(135deg, #8BE9FD 0%, #FF79C6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  11. Governing Law
                </h2>
                <p>
                  These Terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law provisions. Any disputes arising from these Terms shall be resolved through binding arbitration or in courts of competent jurisdiction.
                </p>
              </section>

              <section style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff', marginBottom: '16px', background: 'linear-gradient(135deg, #8BE9FD 0%, #FF79C6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  12. Contact Information
                </h2>
                <p style={{ marginBottom: '8px' }}>
                  For questions about these Terms, please contact us:
                </p>
                <p style={{ marginBottom: '4px' }}>
                  <strong>Email:</strong> legal@agentflow.com
                </p>
                <p style={{ marginBottom: '4px' }}>
                  <strong>Address:</strong> AgentFlow Legal Team
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsOfServicePage

