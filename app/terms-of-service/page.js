'use client'
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TermsOfService() {
  return (
    <>
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8  py-24">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <p className="text-gray-600 mb-8">
            <strong>Last Updated:</strong> February 9, 2026
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p>
              Welcome to Infrabox. By subscribing to and utilizing our services, you agree to be bound by these 
              Terms of Service (&quot;Terms&quot;). It is vital that you read and understand this document thoroughly before 
              using our services. These Terms constitute a legally binding agreement between you and Infrabox, 
              the company operating Infrabox.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Service Description</h2>
            <p>
              Infrabox offers a subscription-based service primarily for the setup and management of email mailboxes 
              and domains tailored for email outreach and email deliverability optimization. Our services include:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Google Workspace Setup:</strong> Provision and management of US-IP Google Workspace mailboxes optimized for deliverability.</li>
              <li><strong>Microsoft Outlook 365 Setup:</strong> Provision and management of Microsoft Outlook 365 mailboxes.</li>
              <li><strong>SMTP Email Accounts:</strong> Provision and management of high-deliverability SMTP email accounts.</li>
              <li><strong>DNS Management:</strong> Configuration and maintenance of DNS records including DKIM, SPF, and DMARC for optimal deliverability.</li>
              <li><strong>Domain Services:</strong> Assistance with domain registration, transfers, and renewals.</li>
              <li><strong>Deliverability Infrastructure:</strong> Enterprise-grade email infrastructure and inbox delivery optimization.</li>
              <li><strong>Third-Party Integrations:</strong> Facilitation of integration with supported third-party platforms for enhanced functionality, such as various email marketing and automation tools.</li>
            </ul>
            <p>
              Infrabox is a reseller of email accounts from various email service providers and vendors. As such, 
              Infrabox is not liable for the outcomes occurring due to the usage of these accounts. Trademarks 
              mentioned belong to their respective trademark owners, and Infrabox may or may not have direct 
              affiliation with these email service providers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Obligations</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">3.1 Account Setup</h3>
            <p>
              Users must provide complete and accurate information during account creation and maintain the 
              confidentiality and security of their login credentials. Users are responsible for all activities 
              that occur under their account.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">3.2 Legal Compliance</h3>
            <p>
              Users must adhere to all applicable local, national, and international laws regarding their use 
              of the services, including data protection and anti-spam regulations such as the CAN-SPAM Act, 
              GDPR, and other relevant legislation.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">3.3 Prohibited Activities</h3>
            <p>Users must not engage in activities that violate these terms of service, including but not limited to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Sending unsolicited bulk emails (spam)</li>
              <li>Using the service for illegal purposes</li>
              <li>Introducing harmful software or engaging in activities that disrupt the service</li>
              <li>Attempting to gain unauthorized access to other users&apos; accounts or data</li>
              <li>Violating the terms of service of third-party email providers</li>
              <li>Engaging in activities that could damage Infrabox&apos;s reputation or deliverability infrastructure</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Payment Terms</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">4.1 Fees</h3>
            <p>
              Fees for our services are billed in advance on a monthly, quarterly, or yearly basis depending
              on the plan selected. All fees are generally non-refundable, including cases where purchases from
              email service providers are non-refundable. All fees are stated in USD unless otherwise specified.
              Wallet credit top-ups and per-mailbox renewal charges are also non-refundable once processed.
              Domain registrations are non-refundable once provisioned. For full details on refund exceptions
              and billing disputes, please refer to our{' '}
              <a href="/refund-policy" className="text-[#1240cc] underline">Refund Policy</a>.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">4.2 Subscription Renewal and Cancellation</h3>
            <p>
              Subscriptions automatically renew at the end of each billing cycle (monthly, quarterly, or yearly).
              Users can cancel their subscription at any time via their account dashboard, with cancellation
              taking effect at the end of the current billing period. No pro-rata refunds will be provided for
              unused time within a billing cycle.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">4.3 Price Changes</h3>
            <p>
              Infrabox reserves the right to modify pricing for its services. Users will be notified of any
              price changes at least 30 days in advance, and continued use of the service after the effective
              date constitutes acceptance of the new pricing.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">4.4 Chargebacks and Billing Disputes</h3>
            <p>
              Users must contact Infrabox at{' '}
              <a href="mailto:finance@infrabox.software" className="text-[#1240cc] underline">finance@infrabox.software</a>{' '}
              before filing any payment dispute or chargeback with their bank or payment provider. Filing an
              unauthorized chargeback may result in immediate account suspension and forfeiture of wallet
              credits. Please see our <a href="/refund-policy" className="text-[#1240cc] underline">Refund Policy</a>{' '}
              for the complete dispute resolution process.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Intellectual Property</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">5.1 License Grant</h3>
            <p>
              Infrabox grants users a non-exclusive, non-transferable, limited license to use the services 
              for their internal business operations during the term of their subscription.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">5.2 Ownership</h3>
            <p>
              Infrabox retains all ownership and intellectual property rights in the services, associated software, 
              and branding. Trademarks mentioned belong to their respective trademark owners, and Infrabox may or 
              may not have direct affiliation with these email service providers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Termination</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">6.1 Termination by Infrabox</h3>
            <p>
              Infrabox may terminate or suspend access to the services immediately, without prior notice or liability,
              if you breach these Terms or violate our Acceptable Use Policy. Upon termination for cause,
              your right to use the services will cease immediately and no refund will be issued. If Infrabox
              terminates your account without cause, a pro-rata refund of prepaid fees for the remaining billing
              period will be issued in accordance with our{' '}
              <a href="/refund-policy" className="text-[#1240cc] underline">Refund Policy</a>.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">6.2 Termination by User</h3>
            <p>
              Users may terminate their subscription at any time, with termination taking effect at the end of 
              the current billing period. Users remain responsible for all charges incurred through the end of 
              the billing period.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Disclaimer of Warranties</h2>
            <p>
              Infrabox provides the services on an &quot;as is&quot; and &quot;as available&quot; basis without any warranties, 
              whether express, implied, or statutory, including, but not limited to, warranties of merchantability, 
              fitness for a particular purpose, and non-infringement. Infrabox does not warrant that the services 
              will be uninterrupted, secure, or error-free.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitation of Liability</h2>
            <p>
              Infrabox will not be liable for any indirect, incidental, special, consequential, or punitive damages, 
              including lost profits, data, or use of the service, whether in an action in contract, tort (including negligence) 
              or otherwise. Users agree that Infrabox is not responsible for the suspension or health of their email accounts 
              once purchased, nor for any consequences arising from the purchase and use of our services.
            </p>
            <p>
              Infrabox cannot be held liable by either users or their recipients for any damage of any sort or any other
              possible losses occurring from the usage of the accounts purchased from Infrabox. The total liability of
              Infrabox shall not exceed the amount paid by the user for the services in the one (1) month immediately preceding the claim.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Anti-Spam and Compliance</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">9.1 Compliance with Anti-Spam Laws</h3>
            <p>
              Users must comply with all applicable anti-spam laws, including but not limited to the CAN-SPAM Act, 
              GDPR, and other relevant legislation. This includes obtaining proper consent from email recipients 
              and providing clear opt-out mechanisms in every email sent.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">9.2 Prohibition of Unsolicited Bulk Emails</h3>
            <p>
              Users are strictly prohibited from using the services to send unsolicited bulk emails. All email 
              campaigns must target only those recipients who have shown a legitimate interest in the subject 
              matter or have opted in to receive such communications.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. User Responsibilities Regarding Email Content</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">10.1 Content Guidelines</h3>
            <p>
              Users must ensure that all emails sent using Infrabox adhere to high standards of content quality. 
              Emails must not contain offensive, misleading, harmful, or otherwise inappropriate content.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">10.2 Prohibition of Deceptive Practices</h3>
            <p>
              Users must not engage in deceptive practices. This includes ensuring that subject lines accurately 
              reflect the content of the email and that any promotional material is clearly identified as such.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Opt-Out Mechanisms</h2>
            <p>
              Every email sent via Infrabox must include a clear, straightforward mechanism for recipients to 
              opt out of future communications. This opt-out process should be easy to use and must be respected 
              promptly by the sender.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Security Measures</h2>
            <p>
              Infrabox implements appropriate security protocols to protect data against unauthorized access, 
              alteration, disclosure, or destruction. These measures include internal reviews of our data collection, 
              storage, and processing practices, as well as physical security measures to guard against unauthorized 
              access to systems where we store personal data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Third-Party Service Providers</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">13.1 Use of Third-Party Services</h3>
            <p>
              We may employ third-party companies and individuals to facilitate our service, provide the service 
              on our behalf, perform service-related tasks, or assist us in analyzing how our service is used. 
              These third parties have access to your personal data only to perform these tasks on our behalf 
              and are obligated not to disclose or use it for any other purpose.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">13.2 Service Providers Include</h3>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Analytics Providers:</strong> Such as Google Analytics to monitor and analyze web traffic</li>
              <li><strong>Cloud Infrastructure:</strong> Various cloud service providers for hosting and infrastructure</li>
              <li><strong>Payment Processors:</strong> Such as Stripe for processing payments</li>
              <li><strong>Email Service Providers:</strong> Including Google Workspace and other email platforms</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Data Protection</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">14.1 Use of Data</h3>
            <p>
              We collect and use your data in accordance with our Privacy Policy, which details how we handle, 
              store, and secure your personal and business data.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">14.2 Compliance</h3>
            <p>
              We comply with the General Data Protection Regulation (GDPR) for EU residents and other applicable 
              data protection laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Data Breach Response</h2>
            <p>
              In the event of a data breach, Infrabox has protocols in place to promptly address the situation. 
              We will notify affected users and relevant authorities as required by law and take steps to mitigate 
              the impact of the breach.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">16. Children&apos;s Privacy</h2>
            <p>
              Infrabox services are not directed to individuals under the age of 18. We do not knowingly collect 
              personally identifiable information from children under 18. If we become aware that a child under 18 
              has provided us with personal data, we will take steps to delete such information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">17. General Provisions</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">17.1 Modifications to Terms</h3>
            <p>
              Infrabox may modify these terms at any time. Material changes will be communicated to users via 
              email or through prominent notice on our platform. Continued use of the services after changes 
              constitute acceptance of the new terms.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">17.2 Governing Law</h3>
            <p>
              {/* TODO: set the governing law and forum once the operating entity is
                  confirmed. Left unstated rather than naming a jurisdiction we cannot stand behind. */}
              The governing law and the courts that hear any dispute arising from these terms
              will be those of the jurisdiction in which Infrabox is registered. Contact us at
              the address below if you need this confirmed before entering into an agreement.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">17.3 Severability</h3>
            <p>
              If any provision of these terms is found to be unenforceable or invalid, that provision will be 
              limited or eliminated to the minimum extent necessary so that the other provisions of these terms 
              remain in full force and effect and enforceable.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">17.4 Entire Agreement</h3>
            <p>
              These terms constitute the entire agreement between users and Infrabox regarding the use of the
              services and supersede all prior agreements and understandings.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">17.5 Enterprise Agreements</h3>
            <p>
              Where a customer has executed a separately signed enterprise Service Level Agreement or order form
              with Infrabox, the terms of that agreement take precedence over these Terms of Service to the extent
              of any conflict. This includes but is not limited to termination notice periods, liability caps, refund
              terms, and support commitments. These Terms of Service apply as the default for all users who do not
              have a separately executed enterprise agreement in place.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">18. User Consent and Responsibilities</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">18.1 Consent</h3>
            <p>
              By using our services, you consent to the collection and use of your personal data as described 
              in our Privacy Policy and these Terms of Service.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">18.2 User Responsibilities</h3>
            <p>
              Users are responsible for ensuring the accuracy of the personal data they provide and for keeping 
              their account information up-to-date. Users must also ensure that they have the necessary rights 
              to provide any third-party data they share with us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">19. Contact Information</h2>
            <p>
              For questions regarding these terms, please reach out to us via our website&apos;s contact form or 
              customer support channels. For legal notices, please send correspondence through our designated 
              contact methods as outlined on our website.
            </p>
            <p>
              <strong>Infrabox</strong><br />
              {/* TODO: replace with the registered operating entity and its
                  address before relying on these terms commercially. */}
              Registered entity details to be confirmed
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">20. Effective Date</h2>
            <p>
              These Terms of Service are effective as of February 9, 2026, and will remain in effect except 
              with respect to any changes in their provisions in the future, which will be in effect immediately 
              after being posted on this page.
            </p>
            <p>
              By using Infrabox services, you agree to these Terms of Service. If you have any questions or 
              concerns about these Terms of Service, please contact us through our customer support channels.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}