export const article = {
  slug: "email-data-privacy-checklist",
  title: "Email Data Privacy Checklist: A Practical Step-by-Step Guide",
  metaDescription:
    "A practical data privacy checklist for email: lawful basis, data sourcing, suppression lists, retention, DSARs, processor agreements, and documentation.",
  headline: "The Email Data Privacy Checklist",
  publishedAt: "2026-06-18",
  updatedAt: "2026-06-18",
  author: "Mohit Mimani",
  category: "Guides",
  readingTime: "11 min read",
  tags: ["data privacy", "GDPR", "email", "checklist"],
  excerpt:
    "A working checklist for handling prospect data responsibly in cold outreach: lawful basis, where data comes from, suppression, retention limits, handling data subject requests, and documenting it all.",
  type: "how-to",
  sections: [
    {
      heading: "Who this checklist is for",
      content:
        "If you run cold outreach, you are processing other people's personal data, often before they have ever heard of you. That puts data privacy at the center of your program, not at the edges. This checklist turns the abstract privacy obligations into concrete steps you can work through and tick off.\n\nIt is written mainly with GDPR and UK GDPR in mind, because they set the highest practical bar, but the habits here also help you stay clean under CAN-SPAM in the US and CASL in Canada. Where a step is region-specific, the text says so.\n\nWork through it in order. Each section ends with a clear action. By the end you should have a defensible position and, just as important, the documentation that proves it. This guide is educational and **not legal advice**; for a program of any scale, confirm the details with a qualified privacy professional.",
    },
    {
      heading: "Step 1: Establish a lawful basis before you send",
      content:
        "Under GDPR you need a lawful basis to process personal data, and you need it before the first email, not after. For cold B2B outreach the two relevant bases are **consent** and **legitimate interests**.\n\nConsent is a high bar: freely given, specific, informed, and unambiguous. A purchased list does not meet it, and neither does an assumption that someone is fine being contacted because they published a work email. Legitimate interests can sometimes support B2B prospecting, but only if you have run and recorded a **legitimate interests assessment (LIA)**, a three-part test that identifies your purpose, shows the processing is necessary for it, and balances your interest against the recipient's rights and reasonable expectations.\n\nThe three parts are worth spelling out, because doing them properly is what makes the basis defensible:\n\n| LIA part | The question it answers |\n|---|---|\n| Purpose test | Is there a genuine business interest in this outreach? |\n| Necessity test | Is emailing this person actually needed to pursue it, or is there a less intrusive way? |\n| Balancing test | Do your interests override the recipient's rights and reasonable expectations? |\n\nIf the balance tips against you, or the contact is an individual rather than a business role (a personal Gmail address rather than a named company role, for instance), you likely cannot rely on legitimate interests and should not send. Targeting a relevant decision-maker at a company about a product genuinely useful to their role sits at the stronger end. Blasting a scraped list of personal addresses sits at the weaker end and usually fails the balancing test outright.\n\n**Action:** For each segment of your list, write down which lawful basis you rely on. If it is legitimate interests, complete an LIA and store it. The [GDPR official text](https://eur-lex.europa.eu/eli/reg/2016/679/oj) and the [ICO direct marketing guidance](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/) are the reference points.",
    },
    {
      heading: "Step 2: Know and record where your data came from",
      content:
        "Data sourcing is where many programs quietly break the rules. If you cannot say where an email address came from, you cannot defend your right to use it.\n\nThere is a meaningful difference between data you collected yourself from a public professional source and a list you bought from a broker. Bought lists are high risk because you usually cannot show a lawful basis, you cannot verify how the data was gathered, and you inherit any problems with how it was collected. If the broker scraped addresses in breach of a platform's terms or a recipient's rights, that problem becomes yours the moment you send.\n\nA simple way to rank your sources by risk:\n\n| Source | Risk level | Why |\n|---|---|---|\n| Self-collected from a public professional profile | Lower | You know the origin and can document it |\n| Enrichment vendor with a clear data provenance statement | Medium | Defensible if the vendor documents how it sources data |\n| Bought list from an anonymous broker | High | No provenance, no verifiable basis, inherited problems |\n| Scraped without checking source terms | High | May breach the source's terms and the recipient's rights |\n\n**Action:** For every contact or source, record the origin, the date you obtained it, and the basis on which it was available. If a source cannot be documented, treat it as unusable. The [email domain setup checklist](/learn/email-domain-setup-checklist) covers the technical side of getting set up; this step is the data side.",
    },
    {
      heading: "Step 3: Build and maintain suppression lists",
      content:
        "A suppression list is the record of everyone you must not contact: people who opted out, objected, asked to be erased, or bounced repeatedly. It is both a legal requirement and a deliverability safeguard.\n\nThe failure mode is fragmentation. If someone opts out in one tool but the address still lives in another, you will re-contact them, which breaches CAN-SPAM's opt-out duty and GDPR's objection right at the same time. Your suppression list has to be central and checked before every send.\n\n**Action:** Maintain a single suppression list that every sending process checks before sending. Add opt-outs and objections automatically and immediately. If you send through Infrabox, the one-click unsubscribe requirements are supported through your sequencer, which keeps opt-outs flowing into suppression without manual steps. See [email footer compliance](/learn/email-footer-compliance) for the opt-out mechanism itself.",
    },
    {
      heading: "Step 4: Set retention limits and stick to them",
      content:
        "GDPR's storage limitation principle says you should not keep personal data longer than you need it for the purpose you collected it for. Holding stale prospect data indefinitely is a common and avoidable risk.\n\nDecide, per data category, how long you will keep a contact who never engages, and schedule deletion or anonymization when that period passes. Keep your suppression list longer, because you need it precisely to honor a past opt-out, but keep only the minimum needed to do that job (typically the email address and the fact of suppression).\n\n**Action:** Write a retention schedule that states, for each category, how long you hold it and what triggers deletion. Then actually run the deletions on schedule, because an unenforced policy offers no protection.",
    },
    {
      heading: "Step 5: Be ready for data subject requests",
      content:
        "GDPR gives individuals rights you must be able to honor, including access (a **DSAR**, or data subject access request), rectification, erasure, and the right to object to direct marketing. The right to object to direct marketing is effectively absolute: if someone objects, you must stop.\n\nThe practical risk is not the rights themselves but your readiness. When a request arrives, you need to find every place the person's data lives, act within the required timeframe (generally a month under GDPR), and record what you did.\n\n**Action:** Write a short procedure for handling each request type: who receives it, how you locate the data, the deadline, and how you log the outcome. Test it with a dry run so the first real DSAR is not the first time you try.\n\n| Right | What you must do | Typical GDPR timeframe |\n|---|---|---|\n| Access (DSAR) | Provide a copy of their data and details of processing | Within one month |\n| Rectification | Correct inaccurate data | Within one month |\n| Erasure | Delete the data where the right applies | Within one month |\n| Object to marketing | Stop processing for direct marketing | Without undue delay |",
    },
    {
      heading: "Step 6: Get processor agreements in place",
      content:
        "When you use a third party to handle personal data on your behalf, such as an email sending platform, a CRM, or an enrichment vendor, that party is usually a **processor** and you are the **controller**. GDPR requires a contract between you, commonly called a **data processing agreement (DPA)**, that sets out what the processor may do with the data.\n\nWithout a DPA, you are sharing personal data with a vendor on no documented terms, which is itself a compliance gap. The DPA should cover the scope and purpose of processing, security obligations, use of sub-processors, handling of data subject requests, and what happens to the data when the relationship ends.\n\n**Action:** List every vendor that touches your prospect data. For each, confirm a DPA is signed and on file. If a vendor will not provide one, treat that as a red flag.",
    },
    {
      heading: "Step 7: Apply data minimization and security from the start",
      content:
        "Two GDPR principles run underneath every other step: **data minimization** and **security**. Minimization says you should hold only the personal data you actually need for outreach. Security says whatever you hold must be protected against loss and unauthorized access.\n\nFor email, minimization is usually straightforward and often ignored. You need a name, a role, a company, and a work email to personalize a relevant message. You rarely need a personal phone number, a home address, or scraped social posts, and holding extra fields just because an enrichment vendor offered them increases your risk for no benefit. Every field you store is a field you may have to disclose in a DSAR, delete on request, and defend if a regulator asks why you have it.\n\nSecurity for a small outreach operation does not require an enterprise program, but it does require basics: access controls so only the people who need the list can reach it, sensible password and two-factor practices on the tools that hold it, and vendors who themselves take security seriously. A leaked prospect list is a personal data breach, and GDPR breach-notification duties can apply.\n\n**Action:** Trim your contact records to the fields you genuinely use. Review who has access to your prospect data and remove access nobody needs. Confirm the tools holding the data offer reasonable security controls and that you have turned them on.",
    },
    {
      heading: "Step 8: Document everything, then keep it current",
      content:
        "GDPR runs on **accountability**: you are expected not only to comply but to be able to demonstrate it. Documentation is what turns good practice into a defensible position when a regulator or a recipient asks.\n\nPull the outputs of the previous steps into one place so you can show your working. Then review it on a schedule, because lists, vendors, and rules all change.\n\n| Document | What it proves | Review cadence |\n|---|---|---|\n| Lawful basis record / LIA | You had a reason to process before sending | Per campaign or quarterly |\n| Data source log | You know where each contact came from | Ongoing |\n| Suppression list | You honor opt-outs and objections | Continuous |\n| Retention schedule | You do not keep data too long | Annually |\n| DSAR procedure and log | You can and do honor rights requests | After each request |\n| Signed DPAs | Vendors process on documented terms | On vendor change |\n\n**Action:** Create a single privacy folder containing these artifacts, assign an owner, and set review dates.\n\nA closing note that bears repeating: privacy discipline and deliverability reinforce each other. Wanted, well-sourced, promptly-suppressed contacts generate fewer complaints, which keeps you out of the spam folder. See [why emails go to spam](/learn/why-emails-go-to-spam) and the [GDPR and CAN-SPAM comparison](/learn/gdpr-vs-can-spam) for the surrounding context. And remember this checklist is general guidance and **not legal advice**; confirm specifics with a qualified professional before scaling.",
    },
  ],
  faqs: [
    {
      question: "Do I need consent to send email under GDPR?",
      answer:
        "Not necessarily consent specifically, but you do need a lawful basis before processing the data. For B2B cold outreach the options are consent or legitimate interests. Consent is a high bar that purchased lists rarely meet, while legitimate interests requires a documented balancing assessment. Either way, the basis must exist before you send, not after.",
    },
    {
      question: "Are purchased email lists a problem for privacy compliance?",
      answer:
        "They are high risk. With a bought list you usually cannot demonstrate a lawful basis, cannot verify how the data was collected, and inherit any problems with that collection. Best practice is to only use contacts whose source and basis you can document, and to treat undocumented sources as unusable.",
    },
    {
      question: "What is a DSAR and how fast must I respond?",
      answer:
        "A DSAR is a data subject access request, where an individual asks for a copy of their personal data and details of how you process it. Under GDPR you generally must respond within one month. The practical key is readiness: having a procedure to locate the data across all your systems and log what you did.",
    },
    {
      question: "Do I need a contract with my email sending platform?",
      answer:
        "Yes, where the platform processes personal data on your behalf it is a processor and GDPR requires a data processing agreement between you. The DPA should cover the purpose of processing, security, sub-processors, handling of data subject requests, and what happens to the data when the relationship ends.",
    },
    {
      question: "How long can I keep prospect data that never engages?",
      answer:
        "There is no fixed number in the law. GDPR's storage limitation principle says you should keep personal data only as long as you need it for the purpose you collected it for, so you set a retention period per category and delete or anonymize when it passes. A contact who never opens or replies across a full outreach cycle is a common candidate for deletion. Your suppression list is the exception: keep it longer, but trim it to the minimum needed to honor a past opt-out, typically just the address and the fact of suppression.",
    },
  ],
  sources: [
    {
      title: "GDPR official text (EUR-Lex)",
      url: "https://eur-lex.europa.eu/eli/reg/2016/679/oj",
      date: "2025",
    },
    {
      title: "ICO guidance on direct marketing and electronic communications",
      url: "https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/",
      date: "2025",
    },
    {
      title: "FTC CAN-SPAM Act Compliance Guide for Business",
      url: "https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business",
      date: "2025",
    },
    {
      title: "ICO Guide to the General Data Protection Regulation (UK GDPR)",
      url: "https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/",
      date: "2025",
    },
  ],
  relatedSlugs: [
    "email-compliance-gdpr-can-spam",
    "gdpr-vs-can-spam",
    "email-footer-compliance",
    "email-domain-setup-checklist",
  ],
};
