export const authors = {
  "rahul-lakhaney": {
    slug: "rahul-lakhaney",
    name: "Rahul Lakhaney",
    role: "CEO",
    bio: "Rahul is the CEO of Infrabox. He built Infrabox to give sales teams and agencies access to reliable email infrastructure without the complexity. Based in Dubai, UAE.",
    avatar: "/images/authors/rahul.jpeg",
    linkedin: "https://www.linkedin.com/in/lakhaney/",
  },
  "mohit-mimani": {
    slug: "mohit-mimani",
    name: "Mohit Mimani",
    role: "CTO",
    bio: "Mohit is the CTO of Infrabox. He leads the engineering team building the infrastructure that powers 10,000+ email accounts with 95% inbox delivery rates.",
    avatar: "/images/authors/mohit.png",
    linkedin: "https://www.linkedin.com/in/mohit-mimani/",
  },
  "saksham-jain": {
    slug: "saksham-jain",
    name: "Saksham Jain",
    role: "COO",
    bio: "Saksham leads Revenue Operations at Infrabox, helping sales teams and agencies optimize their email infrastructure for maximum deliverability and ROI.",
    avatar: "/images/authors/saksham.png",
  },
};

export function getAuthor(slug) {
  return authors[slug];
}

export function getAuthorByName(name) {
  return Object.values(authors).find((a) => a.name === name);
}

export function getAllAuthorSlugs() {
  return Object.keys(authors);
}

export function getAllAuthors() {
  return Object.values(authors);
}
