import { getSEOTags } from "@/libs/seo";
import config from "@/config";

export const metadata = getSEOTags({
    title: "Free Email Blacklist Checker",
    description: "Check if your domain or IP is listed on major email blacklists (DNSBL). Improve your email deliverability by identifying and removing blacklist issues.",
    keywords: "blacklist checker, email blacklist check, dnsbl check, spamhaus check, sorbs check, email deliverability tool, ip blacklist check, domain blacklist check",
    canonicalUrlRelative: "/resources/tools/blacklist-checker",
});

export default function Layout({ children }) {
    return children;
}
