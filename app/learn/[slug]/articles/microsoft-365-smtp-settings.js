export const article = {
  slug: "microsoft-365-smtp-settings",
  title: "Microsoft 365 / Office 365 SMTP Settings: The Complete Configuration Guide",
  metaDescription:
    "Microsoft 365 SMTP settings explained: smtp.office365.com on port 587 with STARTTLS, enabling SMTP AUTH, app passwords with MFA, High Volume Email and relay connector options, and sending limits.",
  headline: "Microsoft 365 SMTP Settings and How to Configure Them",
  publishedAt: "2026-06-18",
  updatedAt: "2026-06-18",
  author: "Mohit Mimani",
  category: "Technical",
  readingTime: "11 min read",
  tags: ["microsoft 365", "office 365 smtp", "smtp auth", "email configuration"],
  excerpt:
    'The settings for sending through Microsoft 365: smtp.office365.com on port 587 with STARTTLS, how to enable SMTP AUTH, when to use app passwords, the High Volume Email and relay connector alternatives, and the sending limits you need to respect.',
  type: "guide",
  sections: [
    {
      heading: "The settings you came for",
      content:
        'If you just need the values to paste into an app, here they are for client SMTP submission through Microsoft 365.\n\n| Setting | Value |\n|---|---|\n| SMTP server | `smtp.office365.com` |\n| Port | `587` |\n| Encryption | STARTTLS |\n| Authentication | Required (SMTP AUTH) |\n| Username | Full mailbox address (UPN) |\n| Password | Mailbox password, or an app password if MFA is enabled |\n\nThis is the **SMTP AUTH client submission** method, the right choice when a single application sends as one specific mailbox. Microsoft documents these values in its [SMTP AUTH client submission reference](https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/how-to-set-up-a-multifunction-device-or-application-to-send-email-using-microsoft-365-or-office-365). The rest of this guide explains the prerequisites, the alternatives for higher volume, and the limits, because the values above will silently fail if SMTP AUTH is disabled on the tenant.',
    },
    {
      heading: "Why your settings might be rejected",
      content:
        'Microsoft turned off SMTP AUTH by default for new tenants and as part of its [security defaults](https://learn.microsoft.com/en-us/entra/fundamentals/security-defaults) initiative. So even with perfect settings, you may hit an authentication error like `550 5.7.1` or a smtp client authentication disabled message. If that happens, the protocol is switched off, not your credentials.\n\nThere are two layers that can block you:\n\n1. **Tenant-level.** Security defaults or an organization-wide policy disables SMTP AUTH for everyone.\n2. **Mailbox-level.** SMTP AUTH is enabled tenant-wide but switched off for the specific mailbox you are using.\n\nBoth must allow SMTP AUTH for client submission to work. The next section covers enabling it. If you see a `550 5.7.1` bounce, our [SMTP 550 5.7.1 error fix](/learn/smtp-550-5-7-1-error-fix) walkthrough helps you read the exact variant.',
    },
    {
      heading: "Enabling SMTP AUTH",
      content:
        'You enable SMTP AUTH per mailbox (and confirm it is not blocked tenant-wide). An administrator does this; a regular user cannot.\n\n**Per mailbox, via the admin center:**\n\n1. Sign in to the Microsoft 365 admin center.\n2. Go to **Users > Active users** and select the mailbox.\n3. Open the **Mail** tab, then **Manage email apps**.\n4. Check **Authenticated SMTP** and save.\n\n**Per mailbox, via PowerShell** (Exchange Online):\n\n```\nSet-CASMailbox -Identity user@yourdomain.com -SmtpClientAuthenticationDisabled $false\n```\n\n**Tenant-wide check** (only re-enable broadly if your security posture allows it):\n\n```\nGet-TransportConfig | Format-List SmtpClientAuthenticationDisabled\nSet-TransportConfig -SmtpClientAuthenticationDisabled $false\n```\n\nLeaving SMTP AUTH off tenant-wide and enabling it only on the specific sending mailboxes is the safer pattern. Changes can take up to an hour to apply.',
    },
    {
      heading: "App passwords and MFA",
      content:
        'SMTP AUTH client submission uses basic credentials, but Microsoft 365 mailboxes increasingly require multi-factor authentication. Basic auth and MFA do not mix directly, so you need an **app password**: a generated credential that lets a single app authenticate without completing the MFA prompt. An app password is a long random string tied to one mailbox; if it leaks you revoke just that string rather than changing the account password, which is why it is treated as a per-application secret.\n\n**To use an app password:**\n\n1. The mailbox must have MFA enabled and app passwords allowed by tenant policy. Some tenants disable app passwords entirely under modern authentication policies.\n2. The user generates an app password from their **My Account > Security info** page.\n3. Use the full mailbox address as the username and the app password (not the regular password) in your SMTP client.\n\nTwo practical traps catch people here. First, app passwords are displayed in spaced groups for readability, and pasting those spaces into the password field causes a `535` authentication failure; strip them. Second, an app password only works if SMTP AUTH is also enabled for that mailbox, so a valid app password against a mailbox with Authenticated SMTP switched off still fails. Both conditions must be true at once.\n\nIf your tenant has fully moved to modern authentication and blocks app passwords, SMTP AUTH client submission may not be available at all, and you should use OAuth-based sending (XOAUTH2) or one of the relay options below. OAuth avoids storing a long-lived password by exchanging a token that can be scoped and revoked, but it requires the sending application to support the flow. This is a common friction point, and it is one reason teams running email at scale often choose mailbox infrastructure where authentication is handled for them.',
    },
    {
      heading: "Higher-volume alternatives: High Volume Email and relay connectors",
      content:
        'SMTP AUTH client submission is meant for low-volume, single-mailbox sending. For more, Microsoft offers two other paths.\n\n**High Volume Email (HVE)** is Microsoft\'s service for internal bulk mail (line-of-business apps sending to recipients in the same organization), with higher throughput than standard client submission. It is aimed at internal communications, not external cold outreach.\n\n**SMTP relay via a connector** lets devices and apps send through your tenant using a connector that authenticates by source IP or certificate rather than per-mailbox credentials. This suits printers, scanners, and internal apps that cannot hold mailbox passwords. The connector points at a different endpoint (your tenant\'s MX-style host rather than `smtp.office365.com`) and trusts the source instead of a login, which is why it is the standard answer for a copier that needs to email scans but has no mailbox of its own. The trade-off is that a connector authenticated by IP is only as safe as the network it trusts, so it is scoped tightly to known addresses.\n\n| Method | Auth model | Best for | External sending |\n|---|---|---|---|\n| SMTP AUTH client submission | Mailbox credentials / app password | One app sending as one mailbox | Yes |\n| High Volume Email (HVE) | Dedicated HVE accounts | Bulk internal mail | Limited |\n| SMTP relay connector | Source IP or certificate | Devices and LOB apps | Yes, within limits |\n\nFor a fuller treatment of relay versus direct sending, see [SMTP relay vs SMTP server](/learn/smtp-relay-vs-smtp-server). None of these change the fact that external mail must pass authentication, covered next.',
    },
    {
      heading: "Authentication: SPF, DKIM, DMARC for Microsoft 365",
      content:
        'Whatever sending method you pick, external recipients (Gmail, Yahoo, other Microsoft tenants) check that your mail is authenticated. Since the [Google and Yahoo sender requirements](/learn/google-yahoo-sender-requirements-2026) took effect, this is mandatory.\n\n- **SPF.** Add Microsoft\'s include to your domain\'s SPF record so its servers are authorized. See [SPF record setup for email](/learn/spf-record-setup-email).\n- **DKIM.** Enable DKIM signing for your custom domain in the Microsoft Defender portal, then publish the two CNAME records Microsoft gives you. See [DKIM setup for email](/learn/dkim-setup-email).\n- **DMARC.** Publish a DMARC record so receivers know how to handle failures. See [DMARC setup for email](/learn/dmarc-setup-email).\n\nMicrosoft applies SPF automatically for mail sent through the service, but DKIM for a custom domain must be turned on manually, and many bounce problems trace back to DKIM never being enabled. The full picture is in [SPF, DKIM, and DMARC explained](/learn/email-authentication-spf-dkim-dmarc-explained).',
    },
    {
      heading: "Sending limits you must respect",
      content:
        'Microsoft 365 enforces caps to protect the platform. Exceeding them causes throttling and then rejection, no matter how clean your configuration is.\n\n| Limit type | Typical Microsoft 365 cap |\n|---|---|\n| Recipient rate limit | 10,000 recipients per day per mailbox |\n| Message rate limit | 30 messages per minute |\n| Recipients per single message | 500 |\n\nThese are platform protections; the practical email ceiling is much lower because reputation, not the hard cap, governs how many messages actually reach the inbox. Pushing toward the hard limit on a fresh mailbox triggers throttling and spam filtering long before you hit the number. A brand-new mailbox sending fifty cold messages on day one will see deferrals and spam placement that a warmed mailbox sending the same volume would not, because the receiver has no history to trust yet.\n\nA worked illustration: suppose you want to reach 1,000 prospects a day. Doing that from a single Microsoft 365 mailbox sits far under the 10,000 recipient cap on paper, yet in practice it scorches the mailbox, because no warmed email mailbox should send anywhere near that volume. Spreading the same 1,000 across, say, twenty or more warmed mailboxes keeps each one at a modest, believable daily figure and protects the reputation of every domain involved. The hard cap is a ceiling you should never approach, not a target. Compare the providers in [email sending limits for Google and Microsoft](/learn/email-sending-limits-google-microsoft) and plan realistic per-mailbox volume in our [sending volume limits guide](/learn/email-sending-volume-limits-guide).\n\nThe durable approach for email is many mailboxes each sending modest, warmed volume, rather than one mailbox pushed to its cap.',
    },
    {
      heading: "Putting it together for email",
      content:
        'A working Microsoft 365 email setup needs all of these aligned:\n\n1. **Correct SMTP settings**: `smtp.office365.com`, port 587, STARTTLS.\n2. **SMTP AUTH enabled** on the sending mailbox (or a relay connector configured).\n3. **App password** generated if MFA is on, or OAuth where required.\n4. **SPF, DKIM, and DMARC** published and passing.\n5. **Warmup** run on each mailbox before real sending, per the [email warmup guide](/learn/email-warmup-guide).\n6. **Volume kept well under** the platform caps, spread across mailboxes.\n\nThat is a lot of moving parts, and Microsoft\'s shift away from basic auth makes the authentication piece harder every year. Infrabox provisions real Microsoft 365 (and Google Workspace and Azure) mailboxes on US IPs with SPF, DKIM, DMARC, and MX configured automatically through Cloudflare in under sixty seconds, plus isolated warmup, so the checklist above is handled rather than assembled by hand. If you configure it yourself, this list is still the order to work through. Microsoft-specific spam problems are covered separately in our [Microsoft 365 email spam fix](/learn/microsoft-365-email-spam-fix).',
    },
  ],
  faqs: [
    {
      question: "What are the Microsoft 365 SMTP server settings?",
      answer:
        "Use smtp.office365.com on port 587 with STARTTLS encryption, with SMTP AUTH required. The username is the full mailbox address and the password is either the mailbox password or an app password if MFA is enabled. This is the SMTP AUTH client submission method for sending as a single mailbox.",
    },
    {
      question: "Why does Microsoft 365 SMTP authentication keep failing?",
      answer:
        "The most common cause is that SMTP AUTH is disabled, either tenant-wide via security defaults or on the specific mailbox. An administrator must enable Authenticated SMTP for the mailbox. If MFA is on, you also need an app password rather than the regular password, and some tenants block app passwords entirely under modern authentication.",
    },
    {
      question: "Can I send email through Microsoft 365 SMTP?",
      answer:
        "Yes, but you must enable SMTP AUTH, configure SPF, DKIM, and DMARC, warm each mailbox, and keep volume well under the platform caps. Reputation, not the hard sending limit, governs how much actually reaches the inbox, so spreading volume across multiple warmed mailboxes is the durable approach.",
    },
    {
      question: "What is the Microsoft 365 daily sending limit?",
      answer:
        "A Microsoft 365 mailbox is typically capped at 10,000 recipients per day, 30 messages per minute, and 500 recipients per message. These are platform protections. The practical email ceiling is far lower because filters throttle fresh or low-reputation senders long before the hard cap is reached.",
    },
    {
      question: "Should I use an app password or OAuth for Microsoft 365 SMTP?",
      answer:
        "Use OAuth (XOAUTH2) where your sending application supports it, because it exchanges a scoped, revocable token instead of storing a long-lived password. Use an app password when the app only supports basic credentials and the tenant still allows app passwords with MFA. If the tenant has fully moved to modern authentication and blocks app passwords, OAuth or a relay connector is the only path.",
    },
  ],
  sources: [
    {
      title: "Microsoft - Set up SMTP AUTH client submission",
      url: "https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/how-to-set-up-a-multifunction-device-or-application-to-send-email-using-microsoft-365-or-office-365",
      date: "2025",
    },
    {
      title: "Microsoft - Security defaults in Microsoft Entra",
      url: "https://learn.microsoft.com/en-us/entra/fundamentals/security-defaults",
      date: "2025",
    },
    {
      title: "Microsoft - Exchange Online limits",
      url: "https://learn.microsoft.com/en-us/office365/servicedescriptions/exchange-online-service-description/exchange-online-limits",
      date: "2025",
    },
    {
      title: "Microsoft - Enable or disable authenticated client SMTP submission (SMTP AUTH)",
      url: "https://learn.microsoft.com/en-us/exchange/clients-and-mobile-in-exchange-online/authenticated-client-smtp-submission",
      date: "2025",
    },
  ],
  relatedSlugs: [
    "smtp-relay-vs-smtp-server",
    "microsoft-365-email-spam-fix",
    "email-sending-limits-google-microsoft",
    "smtp-550-5-7-1-error-fix",
  ],
};
