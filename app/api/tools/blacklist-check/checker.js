const dns = require('dns');
const { promisify } = require('util');
const { getAllBlacklists, RESPONSE_CODES } = require('./config');

const resolveTxt = promisify(dns.resolveTxt);

// DNSBLs answer in 127.255.255.0/24 to signal "I refused this query" — public/cloud
// resolver blocked, over quota, zone retired. It is NOT a listing. Anything in that
// range means the result is unknown and must be surfaced as an error.
function isRefusalResponse(address) {
    return typeof address === 'string' && address.startsWith('127.255.255.');
}

// A DNS-protocol query (c-ares) against the blacklist zone. dns.lookup() must NOT be
// used here: it is getaddrinfo(), which answers from the OS resolver/hosts file rather
// than querying the DNSBL zone, and cannot be cancelled. Each call gets its own Resolver
// so the timeout can actually abort the in-flight query instead of leaking it.
function resolve4WithTimeout(query, timeoutMs) {
    return new Promise((resolve, reject) => {
        const resolver = new dns.Resolver({ timeout: timeoutMs, tries: 1 });
        const timer = setTimeout(() => {
            resolver.cancel();
            reject(new Error('DNS lookup timeout'));
        }, timeoutMs);

        resolver.resolve4(query, (error, addresses) => {
            clearTimeout(timer);
            if (error) reject(error);
            else resolve(addresses);
        });
    });
}

class BlacklistChecker {
    constructor(options = {}) {
        this.timeout = options.timeout || 3000;
        this.retries = options.retries || 2;
        this.concurrency = options.concurrency || 20;
        // Below this fraction of blacklists answering, a score would be meaningless.
        this.minCoverage = options.minCoverage || 0.5;
        this.blacklists = getAllBlacklists();
    }

    /**
     * Check a single IP against a single blacklist
     */
    async checkSingleBlacklist(ip, blacklist) {
        try {
            // Validate IP format
            if (!this.isValidIP(ip)) {
                throw new Error(`Invalid IP address: ${ip}`);
            }

            // Reverse IP for DNS query
            const reversedIP = this.reverseIP(ip);
            const query = `${reversedIP}.${blacklist.domain}`;

            // Perform DNS A record lookup
            const result = await this.performLookup(query);

            if (result) {
                // Get TXT record for additional details
                const txtRecord = await this.getTxtRecord(query);
                const reason = this.interpretResponse(blacklist.domain, result, txtRecord);

                return {
                    listed: true,
                    blacklist: blacklist.name,
                    domain: blacklist.domain,
                    response: result,
                    reason,
                    weight: blacklist.weight,
                    priority: blacklist.priority,
                    checkedAt: new Date().toISOString()
                };
            } else {
                return {
                    listed: false,
                    blacklist: blacklist.name,
                    domain: blacklist.domain,
                    weight: blacklist.weight,
                    priority: blacklist.priority,
                    checkedAt: new Date().toISOString()
                };
            }
        } catch (error) {
            console.warn(`Error checking ${ip} against ${blacklist.name}:`, error.message);
            return {
                listed: false,
                blacklist: blacklist.name,
                domain: blacklist.domain,
                weight: blacklist.weight,
                priority: blacklist.priority,
                error: error.message,
                checkedAt: new Date().toISOString()
            };
        }
    }

    /**
     * Check IP against multiple blacklists with concurrency control
     */
    async checkIP(ip, options = {}) {
        const startTime = Date.now();

        try {
            // Select blacklists based on options
            let selectedBlacklists = this.selectBlacklists(options);

            console.log(`Checking ${ip} against ${selectedBlacklists.length} blacklists`);

            // Split into batches for controlled concurrency
            const batches = this.createBatches(selectedBlacklists, this.concurrency);
            const allResults = [];

            for (const batch of batches) {
                const batchPromises = batch.map(blacklist =>
                    this.checkSingleBlacklist(ip, blacklist)
                );

                const batchResults = await Promise.allSettled(batchPromises);

                // Process settled promises
                const processedResults = batchResults.map((result, index) => {
                    if (result.status === 'fulfilled') {
                        return result.value;
                    } else {
                        console.error(`Batch error for ${batch[index].name}:`, result.reason);
                        return {
                            listed: false,
                            blacklist: batch[index].name,
                            domain: batch[index].domain,
                            error: result.reason.message,
                            checkedAt: new Date().toISOString()
                        };
                    }
                });

                allResults.push(...processedResults);
            }

            const summary = this.generateSummary(ip, allResults, startTime);

            console.log(`Completed check for ${ip}: ${summary.listedCount}/${summary.totalChecked} blacklists`);

            return summary;

        } catch (error) {
            console.error(`Failed to check IP ${ip}:`, error);
            throw error;
        }
    }

    /**
     * Check domain against both domain-specific and IP blacklists (by resolving domain to IPs)
     */
    async checkDomain(domain, options = {}) {
        try {
            const startTime = Date.now();

            // Step 1: Check domain-specific blacklists
            const domainBlacklists = this.blacklists.filter(bl => bl.type === 'domain');
            console.log(`Checking domain ${domain} against ${domainBlacklists.length} domain blacklists`);

            const domainResults = await Promise.allSettled(
                domainBlacklists.map(blacklist => this.checkSingleDomainBlacklist(domain, blacklist))
            );

            const processedDomainResults = domainResults.map((result, index) => {
                if (result.status === 'fulfilled') {
                    return result.value;
                } else {
                    return {
                        listed: false,
                        blacklist: domainBlacklists[index].name,
                        domain: domainBlacklists[index].domain,
                        weight: domainBlacklists[index].weight,
                        error: result.reason.message,
                        checkedAt: new Date().toISOString()
                    };
                }
            });

            // Step 2: Resolve domain to IPs and check against IP blacklists
            let ipResults = [];
            try {
                const dnsPromises = require('dns').promises;
                const addresses = await dnsPromises.resolve4(domain);

                if (addresses && addresses.length > 0) {
                    const primaryIP = addresses[0]; // Use the first resolved IP
                    console.log(`Domain ${domain} resolved to IP ${primaryIP}, checking IP blacklists`);

                    const ipBlacklists = this.blacklists.filter(bl => bl.type === 'ip');
                    const ipCheckResults = await Promise.allSettled(
                        ipBlacklists.map(blacklist => this.checkSingleBlacklist(primaryIP, blacklist))
                    );

                    ipResults = ipCheckResults.map((result, index) => {
                        if (result.status === 'fulfilled') {
                            return {
                                ...result.value,
                                blacklist: `${result.value.blacklist} (via IP ${primaryIP})`
                            };
                        } else {
                            return {
                                listed: false,
                                blacklist: `${ipBlacklists[index].name} (via IP ${primaryIP})`,
                                domain: ipBlacklists[index].domain,
                                weight: ipBlacklists[index].weight,
                                priority: ipBlacklists[index].priority,
                                error: result.reason.message,
                                checkedAt: new Date().toISOString()
                            };
                        }
                    });
                }
            } catch (dnsError) {
                console.warn(`Failed to resolve domain ${domain} to IP:`, dnsError.message);
                // Continue with domain-only results
            }

            // Combine results from both domain and IP checks
            const allResults = [...processedDomainResults, ...ipResults];

            return this.generateSummary(domain, allResults, startTime);

        } catch (error) {
            console.error(`Failed to check domain ${domain}:`, error);
            throw error;
        }
    }

    /**
     * Check domain against a single domain blacklist
     */
    async checkSingleDomainBlacklist(domain, blacklist) {
        try {
            const query = `${domain}.${blacklist.domain}`;

            const result = await this.performLookup(query);

            if (result) {
                const txtRecord = await this.getTxtRecord(query);
                const reason = this.interpretResponse(blacklist.domain, result, txtRecord);

                return {
                    listed: true,
                    blacklist: blacklist.name,
                    domain: blacklist.domain,
                    response: result,
                    reason,
                    weight: blacklist.weight,
                    checkedAt: new Date().toISOString()
                };
            } else {
                return {
                    listed: false,
                    blacklist: blacklist.name,
                    domain: blacklist.domain,
                    weight: blacklist.weight,
                    checkedAt: new Date().toISOString()
                };
            }
        } catch (error) {
            throw new Error(`Error checking domain ${domain} against ${blacklist.name}: ${error.message}`);
        }
    }

    /**
     * Perform DNS lookup with timeout and retries
     */
    async performLookup(query) {
        let lastError;

        for (let attempt = 1; attempt <= this.retries; attempt++) {
            try {
                const addresses = await resolve4WithTimeout(query, this.timeout);
                const address = Array.isArray(addresses) ? addresses[0] : addresses;

                if (isRefusalResponse(address)) {
                    // Retrying a refusal just burns time — the answer will not change.
                    const refused = new Error(`Blacklist refused the query (responded ${address})`);
                    refused.refused = true;
                    throw refused;
                }

                return address || null;
            } catch (error) {
                if (error.code === 'ENOTFOUND' || error.code === 'ENODATA') {
                    // NXDOMAIN / no answer is how a DNSBL says "not listed"
                    return null;
                }

                if (error.refused) throw error;

                lastError = error;

                if (attempt < this.retries) {
                    await this.sleep(1000 * attempt); // Exponential backoff
                }
            }
        }

        throw lastError;
    }

    /**
     * Get TXT record for additional blacklist information
     */
    async getTxtRecord(query) {
        try {
            const txtRecords = await resolveTxt(query);
            return txtRecords.flat().join(' ');
        } catch (error) {
            // TXT records are optional
            return null;
        }
    }

    /**
     * Interpret blacklist response codes
     */
    interpretResponse(blacklistDomain, response, txtRecord) {
        // Check for known response codes
        if (RESPONSE_CODES[blacklistDomain] && RESPONSE_CODES[blacklistDomain][response]) {
            return RESPONSE_CODES[blacklistDomain][response];
        }

        // Use TXT record if available
        if (txtRecord) {
            return txtRecord;
        }

        // Generic response
        return `Listed with response: ${response}`;
    }

    /**
     * Select blacklists based on options
     */
    selectBlacklists(options) {
        let selected = [...this.blacklists];

        if (options.freeOnly) {
            selected = selected.filter(bl => !bl.commercial);
        }

        if (options.tierLimit) {
            // This would require tier information in the blacklist config
            // For now, use priority as a proxy
            selected = selected.filter(bl => bl.priority <= (options.tierLimit * 10));
        }

        if (options.maxPriority) {
            selected = selected.filter(bl => bl.priority <= options.maxPriority);
        }

        if (options.type) {
            selected = selected.filter(bl => bl.type === options.type);
        }

        return selected.sort((a, b) => a.priority - b.priority);
    }

    /**
     * Create batches for concurrency control
     */
    createBatches(array, batchSize) {
        const batches = [];
        for (let i = 0; i < array.length; i += batchSize) {
            batches.push(array.slice(i, i + batchSize));
        }
        return batches;
    }

    /**
     * Generate summary of blacklist check results
     */
    generateSummary(target, results, startTime) {
        const listedResults = results.filter(r => r.listed);
        const errorResults = results.filter(r => r.error);
        // Only blacklists that actually answered can inform the score. Scoring over the
        // full set would treat a failed lookup as a clean result.
        const answeredResults = results.filter(r => !r.error);

        const totalWeight = answeredResults.reduce((sum, r) => sum + (r.weight || 0), 0);
        const listedWeight = listedResults.reduce((sum, r) => sum + (r.weight || 0), 0);
        const reputationScore = totalWeight > 0
            ? Math.max(0, 100 - (listedWeight / totalWeight * 100))
            : 0;

        const coverage = results.length > 0 ? answeredResults.length / results.length : 0;
        const reliable = answeredResults.length > 0 && coverage >= this.minCoverage;

        const summary = {
            target,
            listedCount: listedResults.length,
            totalChecked: answeredResults.length,
            errorCount: errorResults.length,
            coverage: Math.round(coverage * 100),
            processingTimeMs: Date.now() - startTime,
            checkedAt: new Date().toISOString(),
            results: results.sort((a, b) => (b.priority || 999) - (a.priority || 999)),
            blacklisted: listedResults,
            errors: errorResults
        };

        if (!reliable) {
            // Too few blacklists answered to say anything. Say that, rather than
            // reporting a clean bill of health nothing was actually checked for.
            return {
                ...summary,
                error: true,
                reputationScore: null,
                isClean: null,
                message: `Only ${answeredResults.length} of ${results.length} blacklists responded. `
                    + 'Not enough coverage to report a reputation score, please try again shortly.'
            };
        }

        return {
            ...summary,
            reputationScore: Math.round(reputationScore),
            isClean: listedResults.length === 0
        };
    }

    /**
     * Utility functions
     */
    reverseIP(ip) {
        return ip.split('.').reverse().join('.');
    }

    isValidIP(ip) {
        const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        return ipRegex.test(ip);
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = BlacklistChecker;
