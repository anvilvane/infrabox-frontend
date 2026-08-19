'use client'
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacyPolicy() {
  return (
    <>
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <p className="text-gray-600 mb-8">
            <strong>Last Updated:</strong> February 9, 2026
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p>
              This Privacy Policy outlines how Infrabox (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), 
              collects, uses, processes, and discloses your information through your use of our services. This policy 
              is designed to comply with data protection laws including the General Data Protection Regulation (GDPR) 
              for users within the European Union, the California Consumer Privacy Act (CCPA), and other applicable 
              laws globally.
            </p>
            <p>
              By using Infrabox&apos;s services, you acknowledge that you have read, understood, and agree to be bound 
              by this Privacy Policy. If you do not agree with this policy, please do not use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information Collection</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">2.1 Personal Information</h3>
            <p>
              We collect personal information that you provide during account setup and use of our services, 
              including but not limited to your name, email address, company information, and contact details.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">2.2 Billing Information</h3>
            <p>
              We collect payment details and transaction history necessary for financial processing, billing, 
              and compliance with applicable financial regulations.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">2.3 Service Usage Data</h3>
            <p>
              We automatically collect information on how you interact with our services, including access logs, 
              device data, IP addresses, browser type, operating system, email delivery metrics, and other usage details.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">2.4 Cookies and Tracking Technologies</h3>
            <p>
              We use cookies and similar tracking technologies to monitor interactions with our services, 
              improve user experience, and deliver relevant marketing messages.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Use of Information</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">3.1 Service Provisioning</h3>
            <p>
              To provide, manage, and maintain our email deliverability services, including account creation, 
              Google Workspace account provisioning, billing, and customer support.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">3.2 Customer Support</h3>
            <p>
              To offer technical assistance, troubleshoot delivery issues, and respond to queries related to our services.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">3.3 Service Improvements</h3>
            <p>
              To enhance and optimize our email infrastructure, delivery rates, and service offerings based on 
              user feedback and performance analytics.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">3.4 Compliance and Enforcement</h3>
            <p>
              To comply with legal requirements, prevent fraud, enforce our Terms of Service, and maintain 
              the security and integrity of our platform.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">3.5 Marketing Communications</h3>
            <p>
              To send you promotional materials, service updates, and relevant communications about our services, 
              subject to your consent where required by applicable law.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Sharing and Disclosure</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">4.1 Service Providers</h3>
            <p>
              Information may be shared with third-party companies that assist in providing our services, 
              such as Google Cloud Platform, payment processors, analytics providers, and infrastructure partners, 
              under strict data protection agreements.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">4.2 Legal Obligations</h3>
            <p>
              We may disclose your information if required by law, such as to comply with a subpoena, 
              court order, regulatory request, or other legal processes.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">4.3 Business Transfers</h3>
            <p>
              In the event of a merger, acquisition, restructuring, or bankruptcy, customer information 
              may be part of the transferred assets, subject to the same privacy protections.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">4.4 Affiliates and Partners</h3>
            <p>
              We may share your information with our corporate affiliates and trusted partners, 
              who will use that information in accordance with this Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect against unauthorized access, 
              alteration, disclosure, or destruction of data. These comprehensive security measures include:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>End-to-end encryption for data transmission and storage</li>
              <li>Advanced firewall protection and intrusion detection systems</li>
              <li>Secure Socket Layer (SSL) technology for all data transfers</li>
              <li>Regular security assessments and penetration testing</li>
              <li>Multi-factor authentication for administrative access</li>
              <li>Regular security training for our staff</li>
              <li>Adherence to industry-standard security practices</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. International Data Transfers</h2>
            <p>
              Infrabox operates globally and information we collect may be stored and processed in any country 
              where we or our service providers maintain facilities, including the United States
              and the European Union.
            </p>
            <p>
              By using our services, you consent to the transfer of information to countries outside of your 
              country of residence, which may have different data protection rules than in your country. 
              We ensure that all international transfers are protected by appropriate safeguards, including 
              Standard Contractual Clauses approved by the European Commission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Your Rights</h2>
            <p>
              Depending on your location and applicable laws, you may have the following rights regarding your personal data:
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">7.1 Access and Correction</h3>
            <p>
              You have the right to access and correct your personal information at any time through your account dashboard.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">7.2 Data Deletion</h3>
            <p>
              You may request the deletion of your personal information, subject to certain legal and contractual obligations.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">7.3 Objection and Restriction</h3>
            <p>
              You can object to the processing of your personal data and request the restriction of processing under certain circumstances.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">7.4 Data Portability</h3>
            <p>
              You have the right to data portability, allowing you to obtain a copy of your personal data in a structured, machine-readable format.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">7.5 Consent Withdrawal</h3>
            <p>
              Where we process your personal data based on your consent, you have the right to withdraw that consent at any time.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Legal Basis for Processing</h2>
            <p>We process personal data on the following legal bases:</p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Consent:</strong> Where you have given us clear consent to process your personal data for a specific purpose.</li>
              <li><strong>Contractual Necessity:</strong> Where processing is necessary for the performance of a contract with you or to take steps at your request before entering into a contract.</li>
              <li><strong>Legal Obligation:</strong> Where processing is necessary for compliance with a legal obligation to which we are subject.</li>
              <li><strong>Legitimate Interests:</strong> Where processing is necessary for the purposes of legitimate interests pursued by us or a third party, and your interests and fundamental rights do not override those interests.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Data Retention</h2>
            <p>
              We retain your personal data only as long as necessary to provide you with our services, 
              comply with our legal obligations, resolve disputes, and enforce our agreements. 
              Specific retention periods vary based on the type of data and the purpose for which it was collected.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Children&apos;s Privacy</h2>
            <p>
              Our services are not directed to individuals under the age of 18, and we do not knowingly 
              collect personal information from children under 18. If we become aware that a child under 18 
              has provided us with personal information, we will delete such information from our systems promptly.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Third-Party Links and Services</h2>
            <p>
              Our website and services may contain links to other websites and third-party services, 
              including Google Workspace. We are not responsible for the privacy practices or content of those sites. 
              We encourage you to read the privacy policies of any linked sites or services you visit.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Data Breach Response</h2>
            <p>
              In the unlikely event of a data breach that poses a risk to your rights and freedoms, 
              we will notify the relevant supervisory authorities within 72 hours and affected individuals 
              without undue delay, in accordance with applicable data protection laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Changes to This Privacy Policy</h2>
            <p>
              We may update this policy from time to time by posting a new version on our website. 
              Material changes will be communicated to you via email or through prominent notice on our platform. 
              You are advised to review this page periodically for any changes. Continued use of our services 
              after any modifications constitutes acceptance of the revised policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Contact Information</h2>
            <p>
              If you have any questions about this Privacy Policy, wish to exercise your rights, 
              or need to report a privacy concern, please contact us through our website&apos;s contact form 
              or customer support channels.
            </p>
            <p>
              <strong>Infrabox</strong><br />
              {/* TODO: replace with the registered operating entity and its
                  address before relying on these terms commercially. */}
              Registered entity details to be confirmed
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Trademarks and Affiliation</h2>
            <p>
              Trademarks mentioned in this policy belong to their respective trademark owners, and Infrabox 
              may or may not have direct affiliation with these email service providers. By using our services, 
              you acknowledge and accept that Infrabox acts as a reseller of email accounts from various providers 
              and is not liable for the outcomes occurring due to the usage of these accounts.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">16. Effective Date</h2>
            <p>
              This Privacy Policy is effective as of February 9, 2026, and will remain in effect 
              except with respect to any changes in its provisions in the future, which will be 
              in effect immediately after being posted on this page.
            </p>
            <p>
              By using Infrabox services, you agree to this comprehensive Privacy Policy.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}