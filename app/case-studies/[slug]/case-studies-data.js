import { article as anevo_marketing_scaled_infrastructure_infrabox } from './articles/anevo-marketing-scaled-infrastructure-infrabox.js';
import { article as leadhaste_millions_emails_automated_dns_infrabox } from './articles/leadhaste-millions-emails-automated-dns-infrabox.js';
import { article as tgp_one_click_mailbox_automation_infrabox } from './articles/tgp-one-click-mailbox-automation-infrabox.js';
import { article as outreachbloom_crackdown_switch_infrabox } from './articles/outreachbloom-crackdown-switch-infrabox.js';
import { article as playbook_white_label_downsell_model_infrabox } from './articles/playbook-white-label-downsell-model-infrabox.js';
import { article as cymate_recovered_client_pipeline_infrabox } from './articles/cymate-recovered-client-pipeline-infrabox.js';

const caseStudies = {
  "playbook-white-label-downsell-model-infrabox": playbook_white_label_downsell_model_infrabox,
  "cymate-recovered-client-pipeline-infrabox": cymate_recovered_client_pipeline_infrabox,
  "tgp-one-click-mailbox-automation-infrabox": tgp_one_click_mailbox_automation_infrabox,
  "outreachbloom-crackdown-switch-infrabox": outreachbloom_crackdown_switch_infrabox,
  "anevo-marketing-scaled-infrastructure-infrabox": anevo_marketing_scaled_infrastructure_infrabox,
  "leadhaste-millions-emails-automated-dns-infrabox": leadhaste_millions_emails_automated_dns_infrabox,
};

export function getCaseStudy(slug) {
  return caseStudies[slug] || null;
}

export function getAllCaseStudySlugs() {
  return Object.keys(caseStudies);
}

export function getAllCaseStudies() {
  return Object.values(caseStudies);
}

export function getRelatedCaseStudies(slug) {
  const study = caseStudies[slug];
  if (!study || !study.relatedSlugs) return [];
  return study.relatedSlugs
    .map((s) => caseStudies[s])
    .filter(Boolean)
    .map((a) => ({
      slug: a.slug,
      title: a.headline,
      category: a.category,
      author: a.author,
      readingTime: a.readingTime,
      excerpt: a.excerpt,
    }));
}
