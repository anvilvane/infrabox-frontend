'use client'
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AcceptableUsePolicy() {
  return (
    <>
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Acceptable Use Policy</h1>

          <p className="text-gray-600 mb-8">
            <strong>Last Updated:</strong> June 7, 2026
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Overview</h2>
            <p>
              Infrabox provides authenticated email infrastructure services powered by official Google Workspace
              and Microsoft 365 mailboxes. This Acceptable Use Policy (&quot;Policy&quot;) applies to all customers,
              users, and any third parties who access or use Infrabox services. By using Infrabox, you agree to
              comply with this Policy and all applicable laws and regulations.
            </p>
            <p>
              This Policy outlines prohibited uses, our commitment to legitimate email practices, and our
              enforcement actions for violations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Prohibited Uses</h2>
            <p>
              Infrabox strictly prohibits customers from using our services for:
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">A. Spam and Unsolicited Email</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Sending unsolicited bulk email or spam to recipients who have not explicitly opted in to receive communications</li>
              <li>Sending email to purchased or harvested email lists</li>
              <li>Using techniques to evade spam filters, including snowshoeing (sending from multiple domains/IPs to dilute reputation metrics) or waterfalling (cycling email lists through multiple providers)</li>
              <li>Sending email to invalid, dormant, or non-responsive addresses for the purpose of gaining reputation</li>
              <li>Misrepresenting the purpose or content of email campaigns in subject lines or headers</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">B. Phishing, Fraud, and Deception</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Spoofing sender identities or impersonating legitimate organizations</li>
              <li>Creating fake or misleading sender addresses, domain names, or headers</li>
              <li>Phishing attacks designed to collect sensitive information (credentials, financial data, etc.)</li>
              <li>Email campaigns containing fraudulent claims or misleading content</li>
              <li>Creating counterfeit websites or mimicking banking/payment systems</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">C. Malware and Security Threats</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Distributing malware, viruses, ransomware, or other malicious code</li>
              <li>Sending emails with trojan horses or worms</li>
              <li>Distributing compromised or infected files</li>
              <li>Conducting unauthorized security testing, including simulated phishing without proper authorization</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">D. Illegal Activities</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Sending email that violates local, state, federal, or international laws</li>
              <li>Money laundering, pyramid schemes, or other financial crimes</li>
              <li>Drug trafficking, weapons sales, or other illegal goods/services</li>
              <li>Child exploitation, human trafficking, or abuse of minors</li>
              <li>Copyright infringement or intellectual property violations</li>
              <li>Harassment, stalking, threats, or defamation</li>
              <li>Extortion or blackmail</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">E. Violating Anti-Spam Laws</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Non-compliance with CAN-SPAM Act (US)</li>
              <li>Non-compliance with GDPR and similar international privacy regulations</li>
              <li>Non-compliance with Canada&apos;s Anti-Spam Law (CASL)</li>
              <li>Non-compliance with other country-specific email regulations</li>
              <li>Failure to include opt-out mechanisms where required</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">F. Abuse of Infrabox Service</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Advertising Infrabox itself through unsolicited email campaigns</li>
              <li>Using Infrabox infrastructure for sending on behalf of unauthorized third parties</li>
              <li>Intentionally damaging Infrabox&apos;s reputation or network infrastructure</li>
              <li>Attempting to reverse-engineer, bypass, or circumvent Infrabox security systems</li>
              <li>Renting, reselling, or providing access to Infrabox mailboxes without authorization</li>
              <li>Using the service to test malware, spam techniques, or other harmful activities</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Authentication and Deliverability Requirements</h2>
            <p>
              All customers must comply with industry-standard email authentication practices:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>SPF (Sender Policy Framework):</strong> Properly configured to authenticate sending domains</li>
              <li><strong>DKIM (DomainKeys Identified Mail):</strong> All emails must be cryptographically signed</li>
              <li><strong>DMARC (Domain-based Message Authentication, Reporting &amp; Conformance):</strong> Policy enforcement recommended</li>
              <li><strong>List Hygiene:</strong> Regular removal of invalid, bounced, and unengaged addresses</li>
              <li><strong>Engagement Monitoring:</strong> Discontinue sending to addresses that show no engagement over a reasonable period</li>
              <li><strong>Preference Centers:</strong> Provide opt-out mechanisms in all marketing communications</li>
            </ul>
            <p>
              Failure to maintain these standards may result in account suspension or termination.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Legitimate Use Cases</h2>
            <p>
              Infrabox supports legitimate business email use, including:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Opted-in sales and business development campaigns</li>
              <li>Legitimate B2B marketing and lead generation</li>
              <li>Transactional email (receipts, confirmations, notifications)</li>
              <li>Customer relationship management and outreach</li>
              <li>Legitimate business communications with consent</li>
            </ul>
            <p>
              All uses must comply with CAN-SPAM, GDPR, CASL, and other applicable regulations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Regional Availability of Google Workspace Mailboxes</h2>
            <p>
              Google Workspace mailboxes provisioned through Infrabox are made available pursuant to regional
              distribution arrangements applicable to Google Workspace in India, and are accordingly contemplated
              for use by customers whose principal place of business is situated within the Republic of India.
              Customers located outside India are respectfully encouraged to consider Infrabox&apos;s Microsoft 365
              or Azure-backed mailbox alternatives.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Compliance and Monitoring</h2>
            <p>
              Infrabox monitors for policy violations through:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Automated abuse detection systems</li>
              <li>Complaint feedback from recipients and inbox providers</li>
              <li>Blacklist monitoring (SURBL, Spamhaus, etc.)</li>
              <li>Bounce rate and engagement analysis</li>
              <li>Reports from third parties including law enforcement</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Enforcement and Consequences</h2>
            <p>
              Violations of this Policy may result in:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>First Offense:</strong> Warning and mandatory corrective action plan</li>
              <li><strong>Repeated Violations:</strong> Temporary account suspension</li>
              <li><strong>Severe Violations:</strong> Immediate account termination without refund</li>
              <li><strong>Legal Action:</strong> For illegal activities, Infrabox may report to law enforcement and pursue civil or criminal claims</li>
              <li><strong>Law Enforcement Cooperation:</strong> Infrabox cooperates fully with law enforcement investigations</li>
            </ul>
            <p>
              Severe violations (phishing, malware, illegal activity) may result in immediate termination without notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Reporting Abuse</h2>
            <p>
              Infrabox takes abuse seriously. To report violations of this Policy:
            </p>
            <p>
              <strong>Email:</strong> abuse@infrabox.software
            </p>
            <p>
              <strong>Include:</strong> Account information, specific examples, dates, and evidence of violation.
            </p>
            <p>
              All reports are investigated promptly and confidentially.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact and Questions</h2>
            <p>
              For questions about this Policy, contact:
            </p>
            <p>
              <strong>Infrabox Compliance Team</strong><br />
              Email: support@infrabox.software<br />
              Website: infrabox.software
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Policy Updates</h2>
            <p>
              Infrabox reserves the right to update this Policy at any time. Continued use of Infrabox services
              constitutes acceptance of any updates.
            </p>
          </section>

          <section className="mb-8">
            <p>
              <strong>By using Infrabox, you acknowledge that you have read, understood, and agree to comply with this Acceptable Use Policy.</strong>
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
