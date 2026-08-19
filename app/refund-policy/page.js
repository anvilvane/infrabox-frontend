'use client'
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function RefundPolicy() {
  return (
    <>
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8  py-24">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Refund Policy</h1>

          <p className="text-gray-600 mb-8">
            <strong>Last Updated:</strong> March 24, 2026
          </p>

          <p className="mb-8">
            This Refund Policy outlines the terms governing refunds, cancellations, and billing disputes for
            all Infrabox services. This policy should be read in conjunction
            with our <a href="/terms-of-service" className="text-[#1240cc] underline">Terms of Service</a>.
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Subscription Fees</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">1.1 General Policy</h3>
            <p>
              All subscription fees (monthly, quarterly, and yearly plans) are billed in advance and are
              generally non-refundable. This applies to all billing cycles and plan tiers, including
              Professional, Agency, and Enterprise plans.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">1.2 Cancellation</h3>
            <p>
              You may cancel your subscription at any time through your account dashboard. Cancellation takes
              effect at the end of your current billing period. You will retain access to paid features until
              the billing period expires. No pro-rata refunds are issued for unused time within a billing cycle.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">1.3 Quarterly and Yearly Plans</h3>
            <p>
              Quarterly and yearly subscriptions are billed upfront for the full cycle. Early cancellation will
              not result in a refund for the remaining months. Please consider starting with a monthly plan if
              you are evaluating the service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Wallet Credits and Per-Mailbox Billing</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">2.1 Wallet Top-Ups</h3>
            <p>
              Wallet credit top-ups are non-refundable once added to your account. Credits are consumed as
              mailbox renewals and other services are processed.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">2.2 Unused Wallet Balance</h3>
            <p>
              If you close your account, any remaining wallet balance is forfeited and will not be refunded.
              We recommend using your available credits before cancelling your account.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">2.3 Per-Mailbox Renewals</h3>
            <p>
              Per-mailbox charges (Google Workspace, Microsoft Outlook 365, SMTP) are billed at renewal and
              are non-refundable once the renewal is processed. You may cancel individual mailboxes before
              the renewal date to avoid future charges.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Domain Purchases</h2>
            <p>
              Domain registrations are non-refundable once the domain has been provisioned and registered.
              This is due to the nature of domain registration with upstream registrars, which is irreversible.
              Domain renewal charges are similarly non-refundable once processed.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Exceptions Where Refunds May Be Granted</h2>
            <p>
              While our general policy is non-refundable, Infrabox may issue a full or partial refund at its
              sole discretion in the following circumstances:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                <strong>Duplicate billing:</strong> If you were charged more than once for the same service
                due to a billing system error.
              </li>
              <li>
                <strong>Service not delivered:</strong> If Infrabox fails to provision the mailboxes or
                services you paid for and is unable to resolve the issue within a reasonable timeframe.
              </li>
              <li>
                <strong>Extended service outage:</strong> If a platform-wide outage lasting more than 72
                continuous hours prevents you from using paid services, a pro-rata credit or refund may
                be issued for the affected period.
              </li>
              <li>
                <strong>Termination by Infrabox without cause:</strong> If Infrabox terminates your account
                without cause (i.e., not due to a Terms of Service or Acceptable Use Policy violation), a
                pro-rata refund of prepaid fees for the remaining billing period will be issued.
              </li>
            </ul>
            <p>
              These exceptions do not apply if the issue was caused by your actions, third-party services
              outside Infrabox&apos;s control, or violations of our Terms of Service or Acceptable Use Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Chargebacks and Payment Disputes</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">5.1 Contact Us First</h3>
            <p>
              If you believe a charge is incorrect, please contact our billing team at{' '}
              <a href="mailto:finance@infrabox.software" className="text-[#1240cc] underline">finance@infrabox.software</a>{' '}
              before filing a dispute with your bank or payment provider. We are committed to resolving
              billing issues promptly and fairly.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">5.2 Unauthorized Chargebacks</h3>
            <p>
              Filing a chargeback or payment dispute without first attempting to resolve the issue with
              Infrabox may result in:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Immediate suspension of your account and all associated services</li>
              <li>Revocation of access to mailboxes, domains, and platform features</li>
              <li>Forfeiture of any remaining wallet credits</li>
              <li>Collection efforts for any outstanding balances</li>
            </ul>
            <p>
              Infrabox reserves the right to dispute any chargeback that it considers to be illegitimate.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. How to Request a Refund</h2>
            <p>
              To request a refund under the exceptions listed in Section 4, please email{' '}
              <a href="mailto:finance@infrabox.software" className="text-[#1240cc] underline">finance@infrabox.software</a>{' '}
              with the following information:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Your registered email address and account/team name</li>
              <li>The transaction or invoice in question</li>
              <li>A brief description of the issue</li>
            </ul>
            <p>
              Our billing team will review your request and respond within 5 business days. Approved refunds
              will be processed to the original payment method within 7&ndash;10 business days.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Governing Law</h2>
            <p>
              {/* TODO: set the governing law once the operating entity is confirmed. */}
              This Refund Policy is governed by the law of the jurisdiction in which Infrabox is
              registered. Contact us at the address below if you need this confirmed.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Contact Information</h2>
            <p>
              For all billing and refund inquiries:
            </p>
            <p>
              <strong>Email:</strong>{' '}
              <a href="mailto:finance@infrabox.software" className="text-[#1240cc] underline">finance@infrabox.software</a>
            </p>
            <p className="mt-2">
              <strong>Infrabox</strong><br />
              {/* TODO: replace with the registered operating entity and its
                  address before relying on these terms commercially. */}
              Registered entity details to be confirmed
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to This Policy</h2>
            <p>
              Infrabox reserves the right to update this Refund Policy at any time. Material changes will be
              communicated via email or through prominent notice on our platform. Continued use of the
              services after changes constitutes acceptance of the updated policy.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
