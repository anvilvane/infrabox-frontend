// Comprehensive blacklist database with tier classification and rate limits
const BLACKLIST_CONFIG = {
    // Tier 1: Major providers - most reliable and widely used
    tier1: [
        {
            name: 'Spamhaus ZEN',
            domain: 'zen.spamhaus.org',
            type: 'ip',
            description: 'Combined Spamhaus lists (SBL + XBL + CSS + PBL)',
            commercial: true,
            rateLimit: { queries: 300000, period: 'day' },
            priority: 1,
            weight: 0.9
        },
        {
            name: 'SpamCop',
            domain: 'bl.spamcop.net',
            type: 'ip',
            description: 'Community-driven spam reports',
            commercial: false,
            rateLimit: { queries: 1000, period: 'day' },
            priority: 2,
            weight: 0.8
        },
        {
            name: 'Barracuda Central',
            domain: 'b.barracudacentral.org',
            type: 'ip',
            description: 'Barracuda reputation database',
            commercial: false,
            rateLimit: { queries: 10000, period: 'day' },
            priority: 3,
            weight: 0.8
        },
        {
            name: 'CBL',
            domain: 'cbl.abuseat.org',
            type: 'ip',
            description: 'Composite Blocking List',
            commercial: false,
            rateLimit: { queries: 50000, period: 'day' },
            priority: 4,
            weight: 0.7
        },
        {
            name: 'Spamhaus SBL',
            domain: 'sbl.spamhaus.org',
            type: 'ip',
            description: 'Spamhaus Block List',
            commercial: true,
            rateLimit: { queries: 300000, period: 'day' },
            priority: 5,
            weight: 0.9
        },
        {
            name: 'SURBL Multi',
            domain: 'multi.surbl.org',
            type: 'domain',
            description: 'URI reputation database',
            commercial: false,
            rateLimit: { queries: 20000, period: 'day' },
            priority: 6,
            weight: 0.7
        }
    ],

    // Tier 2: Specialized and regional lists
    tier2: [
        {
            name: 'SORBS DNSBL',
            domain: 'dnsbl.sorbs.net',
            type: 'ip',
            description: 'Spam and Open Relay Blocking System',
            commercial: false,
            rateLimit: { queries: 5000, period: 'day' },
            priority: 10,
            weight: 0.6
        },
        {
            name: 'UCEPROTECT Level 1',
            domain: 'dnsbl-1.uceprotect.net',
            type: 'ip',
            description: 'Direct spam sources',
            commercial: false,
            rateLimit: { queries: 2000, period: 'day' },
            priority: 11,
            weight: 0.5
        },
        {
            name: 'PSBL',
            domain: 'psbl.surriel.com',
            type: 'ip',
            description: 'Passive Spam Block List',
            commercial: false,
            rateLimit: { queries: 10000, period: 'day' },
            priority: 12,
            weight: 0.6
        },
        {
            name: 'DroneBL',
            domain: 'dnsbl.dronebl.org',
            type: 'ip',
            description: 'Compromised machines and drones',
            commercial: false,
            rateLimit: { queries: 5000, period: 'day' },
            priority: 13,
            weight: 0.6
        },
        {
            name: 'SpamRATS Spam',
            domain: 'spam.spamrats.com',
            type: 'ip',
            description: 'General spam sources',
            commercial: false,
            rateLimit: { queries: 10000, period: 'day' },
            priority: 14,
            weight: 0.5
        },
        {
            name: 'SpamRATS Dynamic',
            domain: 'dyna.spamrats.com',
            type: 'ip',
            description: 'Dynamic IP addresses',
            commercial: false,
            rateLimit: { queries: 10000, period: 'day' },
            priority: 15,
            weight: 0.4
        },
        {
            name: 'Mailspike',
            domain: 'bl.mailspike.net',
            type: 'ip',
            description: 'Reputation-based scoring',
            commercial: false,
            rateLimit: { queries: 5000, period: 'day' },
            priority: 16,
            weight: 0.5
        }
    ],

    // Tier 3: Additional and niche providers + Enhanced coverage
    tier3: [
        {
            name: 'Abuse.ch Spam',
            domain: 'spam.abuse.ch',
            type: 'ip',
            description: 'Spam-related threats',
            commercial: false,
            rateLimit: { queries: 1000, period: 'day' },
            priority: 20,
            weight: 0.4
        },
        {
            name: 'Blocklist.de',
            domain: 'bl.blocklist.de',
            type: 'ip',
            description: 'German blocklist service',
            commercial: false,
            rateLimit: { queries: 2000, period: 'day' },
            priority: 21,
            weight: 0.3
        },
        {
            name: 'EFnet RBL',
            domain: 'rbl.efnetrbl.org',
            type: 'ip',
            description: 'EFnet relay blocklist',
            commercial: false,
            rateLimit: { queries: 1000, period: 'day' },
            priority: 22,
            weight: 0.3
        },
        {
            name: 'Five-Ten SG',
            domain: 'blackholes.five-ten-sg.com',
            type: 'ip',
            description: 'Five-Ten Singapore blackholes',
            commercial: false,
            rateLimit: { queries: 1000, period: 'day' },
            priority: 23,
            weight: 0.3
        },
        {
            name: 'InterServer RBL',
            domain: 'rbl.interserver.net',
            type: 'ip',
            description: 'InterServer reputation list',
            commercial: false,
            rateLimit: { queries: 1000, period: 'day' },
            priority: 24,
            weight: 0.3
        },

        // Additional blacklists from competitive analysis
        {
            name: 'APEWS-L2',
            domain: 'query.bondedsender.org',
            type: 'ip',
            description: 'Asia Pacific Email and Web Security',
            commercial: false,
            rateLimit: { queries: 1000, period: 'day' },
            priority: 25,
            weight: 0.6
        },
        {
            name: 'AZORult Tracker',
            domain: 'azorult-tracker.net',
            type: 'ip',
            description: 'AZORult malware tracking',
            commercial: false,
            rateLimit: { queries: 500, period: 'day' },
            priority: 26,
            weight: 0.7
        },
        {
            name: 'AntiSpam by CleanTalk',
            domain: 'cleantalk.org',
            type: 'ip',
            description: 'CleanTalk spam prevention service',
            commercial: false,
            rateLimit: { queries: 1000, period: 'day' },
            priority: 27,
            weight: 0.6
        },
        {
            name: 'Backscatterer',
            domain: 'ips.backscatterer.org',
            type: 'ip',
            description: 'Backscatter spam sources',
            commercial: false,
            rateLimit: { queries: 1000, period: 'day' },
            priority: 28,
            weight: 0.6
        },
        {
            name: 'Botvrij',
            domain: 'bl.botvrij.eu',
            type: 'ip',
            description: 'Botnet tracking and prevention',
            commercial: false,
            rateLimit: { queries: 1000, period: 'day' },
            priority: 29,
            weight: 0.7
        },
        {
            name: 'GreenSnow Blocklist',
            domain: 'bl.greensnow.co',
            type: 'ip',
            description: 'Suspicious activity and harassment tracking',
            commercial: false,
            rateLimit: { queries: 1000, period: 'day' },
            priority: 30,
            weight: 0.6
        },
        {
            name: 'Feodo Tracker',
            domain: 'feodotracker.abuse.ch',
            type: 'ip',
            description: 'Feodo malware command & control tracking',
            commercial: false,
            rateLimit: { queries: 1000, period: 'day' },
            priority: 31,
            weight: 0.8
        },
        {
            name: 'IPSpamList',
            domain: 'bl.ipspamlist.com',
            type: 'ip',
            description: 'IP address spam tracking service',
            commercial: false,
            rateLimit: { queries: 500, period: 'day' },
            priority: 32,
            weight: 0.5
        },
        {
            name: 'Talos IP Blacklist',
            domain: 'talosintel.com',
            type: 'ip',
            description: 'Cisco Talos threat intelligence',
            commercial: false,
            rateLimit: { queries: 1000, period: 'day' },
            priority: 33,
            weight: 0.8
        },
        {
            name: 'SSL Blacklist',
            domain: 'sslbl.abuse.ch',
            type: 'ip',
            description: 'SSL certificate abuse tracking',
            commercial: false,
            rateLimit: { queries: 1000, period: 'day' },
            priority: 34,
            weight: 0.7
        },

        // Domain-specific blacklists
        {
            name: 'OpenPhish',
            domain: 'openphish.com',
            type: 'domain',
            description: 'Phishing domain detection and tracking',
            commercial: false,
            rateLimit: { queries: 1000, period: 'day' },
            priority: 35,
            weight: 0.8
        },
        {
            name: 'PhishTank',
            domain: 'data.phishtank.com',
            type: 'domain',
            description: 'Community-driven phishing verification',
            commercial: false,
            rateLimit: { queries: 1000, period: 'day' },
            priority: 36,
            weight: 0.8
        },
        {
            name: 'URLhaus',
            domain: 'urlhaus.abuse.ch',
            type: 'domain',
            description: 'Malware URL sharing and tracking',
            commercial: false,
            rateLimit: { queries: 1000, period: 'day' },
            priority: 37,
            weight: 0.9
        },

        // Additional major blacklists for enhanced coverage
        {
            name: 'UCEPROTECT Level 2',
            domain: 'dnsbl-2.uceprotect.net',
            type: 'ip',
            description: 'Networks hosting spammers',
            commercial: false,
            rateLimit: { queries: 1000, period: 'day' },
            priority: 38,
            weight: 0.4
        },
        {
            name: 'UCEPROTECT Level 3',
            domain: 'dnsbl-3.uceprotect.net',
            type: 'ip',
            description: 'Countries with poor anti-spam policies',
            commercial: false,
            rateLimit: { queries: 1000, period: 'day' },
            priority: 39,
            weight: 0.3
        },
        {
            name: 'Lashback UBL',
            domain: 'ubl.lashback.com',
            type: 'ip',
            description: 'Unsubscribe blacklist for opt-out abusers',
            commercial: false,
            rateLimit: { queries: 5000, period: 'day' },
            priority: 40,
            weight: 0.7
        },
        {
            name: 'Invaluement ivmSIP',
            domain: 'ivmsip.dnsbl.invaluement.com',
            type: 'ip',
            description: 'Invaluement SIP blacklist for VoIP abuse',
            commercial: true,
            rateLimit: { queries: 10000, period: 'day' },
            priority: 41,
            weight: 0.6
        },
        {
            name: 'Tornevall DNSBL',
            domain: 'dnsbl.tornevall.org',
            type: 'ip',
            description: 'European-focused anti-spam list',
            commercial: false,
            rateLimit: { queries: 1000, period: 'day' },
            priority: 42,
            weight: 0.5
        },
        {
            name: 'MIPSpace',
            domain: 'lookup.dnsbl.sorbs.net',
            type: 'ip',
            description: 'Regional Asian IP reputation service',
            commercial: false,
            rateLimit: { queries: 2000, period: 'day' },
            priority: 43,
            weight: 0.5
        },

        // Additional major blacklists found in 2024-2025 research
        {
            name: 'Spam Eating Monkey',
            domain: 'bl.spameatingmonkey.net',
            type: 'ip',
            description: 'Aggressive anti-spam blacklist',
            commercial: false,
            rateLimit: { queries: 1000, period: 'day' },
            priority: 44,
            weight: 0.6
        },
        {
            name: 'NoPtr SpamRATS',
            domain: 'noptr.spamrats.com',
            type: 'ip',
            description: 'IPs without reverse DNS records',
            commercial: false,
            rateLimit: { queries: 10000, period: 'day' },
            priority: 45,
            weight: 0.4
        },
        {
            name: 'Sender Score Reputation',
            domain: 'bl.score.senderscore.com',
            type: 'ip',
            description: 'Commercial IP reputation service (formerly Validity)',
            commercial: true,
            rateLimit: { queries: 5000, period: 'day' },
            priority: 46,
            weight: 0.7
        },
        {
            name: 'Bonded Sender Accredited',
            domain: 'sa-accredit.habeas.com',
            type: 'ip',
            description: 'Accredited sender verification service',
            commercial: true,
            rateLimit: { queries: 2000, period: 'day' },
            priority: 47,
            weight: 0.8
        },

        // Verified active DNSBL blacklists from dnsbl.info (36 working sources)
        {
            name: 'S5h Blacklist',
            domain: 'all.s5h.net',
            type: 'ip',
            description: 'Security research blacklist',
            commercial: false,
            rateLimit: { queries: 1000, period: 'day' },
            priority: 48,
            weight: 0.6
        },
        {
            name: '0spam RBL',
            domain: 'bl.0spam.org',
            type: 'ip',
            description: 'Zero tolerance spam blacklist',
            commercial: false,
            rateLimit: { queries: 5000, period: 'day' },
            priority: 49,
            weight: 0.7
        },
        {
            name: 'Woody Blacklist',
            domain: 'blacklist.woody.ch',
            type: 'ip',
            description: 'Swiss spam and threat tracking',
            commercial: false,
            rateLimit: { queries: 1000, period: 'day' },
            priority: 50,
            weight: 0.5
        },
        {
            name: 'Cymru Bogons',
            domain: 'bogons.cymru.com',
            type: 'ip',
            description: 'Unallocated IP address tracking',
            commercial: false,
            rateLimit: { queries: 10000, period: 'day' },
            priority: 51,
            weight: 0.4
        },
        {
            name: 'Abuse.ch Combined',
            domain: 'combined.abuse.ch',
            type: 'ip',
            description: 'Combined malware and botnet tracking',
            commercial: false,
            rateLimit: { queries: 5000, period: 'day' },
            priority: 52,
            weight: 0.8
        },
        {
            name: 'WPBL Database',
            domain: 'db.wpbl.info',
            type: 'ip',
            description: 'Weighted private blacklist',
            commercial: false,
            rateLimit: { queries: 2000, period: 'day' },
            priority: 53,
            weight: 0.6
        },
        {
            name: 'Abuse.ch Drone',
            domain: 'drone.abuse.ch',
            type: 'ip',
            description: 'Drone botnet tracking',
            commercial: false,
            rateLimit: { queries: 5000, period: 'day' },
            priority: 54,
            weight: 0.8
        },
        {
            name: 'AUPADS DUINV',
            domain: 'duinv.aupads.org',
            type: 'ip',
            description: 'Dialup and dynamic IP tracking',
            commercial: false,
            rateLimit: { queries: 2000, period: 'day' },
            priority: 55,
            weight: 0.4
        },
        {
            name: 'Korea Services',
            domain: 'korea.services.net',
            type: 'ip',
            description: 'Korean spam and threat tracking',
            commercial: false,
            rateLimit: { queries: 1000, period: 'day' },
            priority: 56,
            weight: 0.5
        },
        {
            name: 'AUPADS ORVEDB',
            domain: 'orvedb.aupads.org',
            type: 'ip',
            description: 'Open relay verification database',
            commercial: false,
            rateLimit: { queries: 2000, period: 'day' },
            priority: 57,
            weight: 0.5
        },
        {
            name: 'GWEEP Proxy',
            domain: 'proxy.bl.gweep.ca',
            type: 'ip',
            description: 'Open proxy detection service',
            commercial: false,
            rateLimit: { queries: 1000, period: 'day' },
            priority: 58,
            weight: 0.6
        },
        {
            name: '0spam RBL Secondary',
            domain: 'rbl.0spam.org',
            type: 'ip',
            description: 'Zero tolerance spam secondary list',
            commercial: false,
            rateLimit: { queries: 5000, period: 'day' },
            priority: 59,
            weight: 0.6
        },
        {
            name: 'GWEEP Relays',
            domain: 'relays.bl.gweep.ca',
            type: 'ip',
            description: 'Open relay blocking service',
            commercial: false,
            rateLimit: { queries: 1000, period: 'day' },
            priority: 60,
            weight: 0.6
        },
        {
            name: 'Nether Relays',
            domain: 'relays.nether.net',
            type: 'ip',
            description: 'Netherlands relay detection',
            commercial: false,
            rateLimit: { queries: 1000, period: 'day' },
            priority: 61,
            weight: 0.5
        },
        {
            name: 'TTK Hungary',
            domain: 'singular.ttk.pte.hu',
            type: 'ip',
            description: 'Hungarian threat tracking',
            commercial: false,
            rateLimit: { queries: 1000, period: 'day' },
            priority: 62,
            weight: 0.4
        },
        {
            name: 'Abuse.ch Spam',
            domain: 'spam.abuse.ch',
            type: 'ip',
            description: 'Dedicated spam tracking by Abuse.ch',
            commercial: false,
            rateLimit: { queries: 5000, period: 'day' },
            priority: 63,
            weight: 0.8
        },
        {
            name: 'AnonMails DNSBL',
            domain: 'spam.dnsbl.anonmails.de',
            type: 'ip',
            description: 'German anonymous mail spam tracking',
            commercial: false,
            rateLimit: { queries: 1000, period: 'day' },
            priority: 64,
            weight: 0.6
        },
        {
            name: 'Digibase Spambot',
            domain: 'spambot.bls.digibase.ca',
            type: 'ip',
            description: 'Canadian spambot detection',
            commercial: false,
            rateLimit: { queries: 1000, period: 'day' },
            priority: 65,
            weight: 0.7
        },
        {
            name: 'IMP SpamRBL',
            domain: 'spamrbl.imp.ch',
            type: 'ip',
            description: 'Swiss spam reputation blacklist',
            commercial: false,
            rateLimit: { queries: 1000, period: 'day' },
            priority: 66,
            weight: 0.6
        },
        {
            name: 'Fabel Denmark',
            domain: 'spamsources.fabel.dk',
            type: 'ip',
            description: 'Danish spam source tracking',
            commercial: false,
            rateLimit: { queries: 1000, period: 'day' },
            priority: 67,
            weight: 0.5
        },
        {
            name: 'Lashback UBL Active',
            domain: 'ubl.lashback.com',
            type: 'ip',
            description: 'Active unsubscribe blacklist',
            commercial: false,
            rateLimit: { queries: 5000, period: 'day' },
            priority: 68,
            weight: 0.7
        },
        {
            name: 'UnsubScore UBL',
            domain: 'ubl.unsubscore.com',
            type: 'ip',
            description: 'Unsubscribe scoring blacklist',
            commercial: false,
            rateLimit: { queries: 2000, period: 'day' },
            priority: 69,
            weight: 0.6
        },
        {
            name: 'Japan Virus RBL',
            domain: 'virus.rbl.jp',
            type: 'ip',
            description: 'Japanese virus and malware tracking',
            commercial: false,
            rateLimit: { queries: 1000, period: 'day' },
            priority: 70,
            weight: 0.7
        },
        {
            name: 'IMP WormRBL',
            domain: 'wormrbl.imp.ch',
            type: 'ip',
            description: 'Swiss worm and malware blacklist',
            commercial: false,
            rateLimit: { queries: 1000, period: 'day' },
            priority: 71,
            weight: 0.7
        },
        {
            name: 'Mailspike Z-List',
            domain: 'z.mailspike.net',
            type: 'ip',
            description: 'Mailspike reputation Z-list',
            commercial: false,
            rateLimit: { queries: 5000, period: 'day' },
            priority: 72,
            weight: 0.6
        }
    ]
};

// Response code meanings for different blacklists
const RESPONSE_CODES = {
    'zen.spamhaus.org': {
        '127.0.0.2': 'SBL - Spamhaus Block List',
        '127.0.0.3': 'SBL - Spamhaus Block List',
        '127.0.0.4': 'XBL - Exploits Block List',
        '127.0.0.5': 'XBL - Exploits Block List',
        '127.0.0.6': 'XBL - Exploits Block List',
        '127.0.0.7': 'XBL - Exploits Block List',
        '127.0.0.9': 'SBL - Spamhaus Block List',
        '127.0.0.10': 'PBL - Policy Block List',
        '127.0.0.11': 'CSS - Composite Snowshoe'
    },
    'bl.spamcop.net': {
        '127.0.0.2': 'Listed in SpamCop'
    },
    'b.barracudacentral.org': {
        '127.0.0.2': 'Listed in Barracuda'
    }
};

module.exports = {
    BLACKLIST_CONFIG,
    RESPONSE_CODES,

    // Helper functions
    getAllBlacklists: () => [
        ...BLACKLIST_CONFIG.tier1,
        ...BLACKLIST_CONFIG.tier2,
        ...BLACKLIST_CONFIG.tier3
    ],

    getByType: (type) => [
        ...BLACKLIST_CONFIG.tier1.filter(bl => bl.type === type),
        ...BLACKLIST_CONFIG.tier2.filter(bl => bl.type === type),
        ...BLACKLIST_CONFIG.tier3.filter(bl => bl.type === type)
    ],

    getFreeBlacklists: () => [
        ...BLACKLIST_CONFIG.tier1.filter(bl => !bl.commercial),
        ...BLACKLIST_CONFIG.tier2.filter(bl => !bl.commercial),
        ...BLACKLIST_CONFIG.tier3.filter(bl => !bl.commercial)
    ],

    getPriorityBlacklists: (maxPriority = 10) => [
        ...BLACKLIST_CONFIG.tier1.filter(bl => bl.priority <= maxPriority),
        ...BLACKLIST_CONFIG.tier2.filter(bl => bl.priority <= maxPriority),
        ...BLACKLIST_CONFIG.tier3.filter(bl => bl.priority <= maxPriority)
    ]
};
