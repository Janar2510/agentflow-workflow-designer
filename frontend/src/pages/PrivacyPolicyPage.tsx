import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import './AuthPage.css'

export const PrivacyPolicyPage: React.FC = () => {
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
              Privacy Policy
            </h1>
            <p style={{ color: 'rgba(255, 255, 255, 0.6)', marginBottom: '40px', fontSize: '16px' }}>
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <div style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.8', fontSize: '15px' }}>
              <section style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff', marginBottom: '16px', background: 'linear-gradient(135deg, #8BE9FD 0%, #FF79C6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  1. Introduction
                </h2>
                <p style={{ marginBottom: '16px' }}>
                  AgentFlow ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform and services.
                </p>
                <p>
                  By accessing or using AgentFlow, you agree to the collection and use of information in accordance with this policy.
                </p>
              </section>

              <section style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff', marginBottom: '16px', background: 'linear-gradient(135deg, #8BE9FD 0%, #FF79C6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  2. Information We Collect
                </h2>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#ffffff', marginTop: '24px', marginBottom: '12px' }}>
                  2.1 Personal Information
                </h3>
                <p style={{ marginBottom: '12px' }}>
                  We may collect personal information that you provide directly to us, including:
                </p>
                <ul style={{ marginLeft: '24px', marginBottom: '16px' }}>
                  <li>Name and contact information (email address, phone number)</li>
                  <li>Account credentials (username, password)</li>
                  <li>Profile information and preferences</li>
                  <li>Payment information for premium services</li>
                  <li>Communication data (emails, messages, support requests)</li>
                </ul>

                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#ffffff', marginTop: '24px', marginBottom: '12px' }}>
                  2.2 Usage Data
                </h3>
                <p style={{ marginBottom: '12px' }}>
                  We automatically collect information about how you interact with our platform:
                </p>
                <ul style={{ marginLeft: '24px', marginBottom: '16px' }}>
                  <li>Log data (IP address, browser type, device information)</li>
                  <li>Usage patterns and feature interactions</li>
                  <li>Workflow execution data and performance metrics</li>
                  <li>Error reports and diagnostic information</li>
                </ul>

                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#ffffff', marginTop: '24px', marginBottom: '12px' }}>
                  2.3 Cookies and Tracking Technologies
                </h3>
                <p>
                  We use cookies, web beacons, and similar technologies to enhance your experience, analyze usage patterns, and personalize content. You can control cookie preferences through your browser settings.
                </p>
              </section>

              <section style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff', marginBottom: '16px', background: 'linear-gradient(135deg, #8BE9FD 0%, #FF79C6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  3. How We Use Your Information
                </h2>
                <p style={{ marginBottom: '12px' }}>
                  We use the collected information for various purposes:
                </p>
                <ul style={{ marginLeft: '24px', marginBottom: '16px' }}>
                  <li>To provide, maintain, and improve our services</li>
                  <li>To process transactions and manage your account</li>
                  <li>To communicate with you about service updates, security alerts, and support</li>
                  <li>To personalize your experience and deliver relevant content</li>
                  <li>To analyze usage patterns and optimize platform performance</li>
                  <li>To detect, prevent, and address technical issues and security threats</li>
                  <li>To comply with legal obligations and enforce our terms</li>
                </ul>
              </section>

              <section style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff', marginBottom: '16px', background: 'linear-gradient(135deg, #8BE9FD 0%, #FF79C6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  4. Information Sharing and Disclosure
                </h2>
                <p style={{ marginBottom: '12px' }}>
                  We do not sell your personal information. We may share your information only in the following circumstances:
                </p>
                <ul style={{ marginLeft: '24px', marginBottom: '16px' }}>
                  <li><strong>Service Providers:</strong> With trusted third-party vendors who assist in operating our platform</li>
                  <li><strong>Legal Requirements:</strong> When required by law, court order, or government regulation</li>
                  <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
                  <li><strong>Consent:</strong> With your explicit permission for specific purposes</li>
                  <li><strong>Security:</strong> To protect our rights, privacy, safety, or property</li>
                </ul>
              </section>

              <section style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff', marginBottom: '16px', background: 'linear-gradient(135deg, #8BE9FD 0%, #FF79C6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  5. Data Security
                </h2>
                <p>
                  We implement industry-standard security measures to protect your information, including encryption, secure authentication, and regular security audits. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                </p>
              </section>

              <section style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff', marginBottom: '16px', background: 'linear-gradient(135deg, #8BE9FD 0%, #FF79C6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  6. Your Rights
                </h2>
                <p style={{ marginBottom: '12px' }}>
                  Depending on your location, you may have the following rights:
                </p>
                <ul style={{ marginLeft: '24px', marginBottom: '16px' }}>
                  <li><strong>Access:</strong> Request access to your personal data</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                  <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                  <li><strong>Objection:</strong> Object to processing of your personal data</li>
                  <li><strong>Withdrawal:</strong> Withdraw consent for data processing</li>
                </ul>
                <p>
                  To exercise these rights, please contact us at privacy@agentflow.com.
                </p>
              </section>

              <section style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff', marginBottom: '16px', background: 'linear-gradient(135deg, #8BE9FD 0%, #FF79C6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  7. Data Retention
                </h2>
                <p>
                  We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required or permitted by law. When you delete your account, we will delete or anonymize your personal data within a reasonable timeframe.
                </p>
              </section>

              <section style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff', marginBottom: '16px', background: 'linear-gradient(135deg, #8BE9FD 0%, #FF79C6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  8. Children's Privacy
                </h2>
                <p>
                  AgentFlow is not intended for users under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have collected information from a child, we will take steps to delete it promptly.
                </p>
              </section>

              <section style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff', marginBottom: '16px', background: 'linear-gradient(135deg, #8BE9FD 0%, #FF79C6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  9. International Data Transfers
                </h2>
                <p>
                  Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy.
                </p>
              </section>

              <section style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff', marginBottom: '16px', background: 'linear-gradient(135deg, #8BE9FD 0%, #FF79C6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  10. Changes to This Privacy Policy
                </h2>
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date. You are advised to review this policy periodically.
                </p>
              </section>

              <section style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff', marginBottom: '16px', background: 'linear-gradient(135deg, #8BE9FD 0%, #FF79C6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  11. Contact Us
                </h2>
                <p style={{ marginBottom: '8px' }}>
                  If you have questions about this Privacy Policy, please contact us:
                </p>
                <p style={{ marginBottom: '4px' }}>
                  <strong>Email:</strong> privacy@agentflow.com
                </p>
                <p style={{ marginBottom: '4px' }}>
                  <strong>Address:</strong> AgentFlow Privacy Team
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicyPage

