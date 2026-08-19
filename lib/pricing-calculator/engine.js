// Infrabox pricing engine. Pure: no DOM, no hardcoded prices, no rounding.
// calculate(input, pricing) and helpers sizeProvider(...) / bandFor(...).

function sizeProvider(provider, sends, providerCfg, override) {
  // provider: 'google' | 'microsoft' | 'azure'
  // sends: dailyTarget * fraction (full precision)
  // providerCfg: pricing.providers[provider] -> { billing, block, epd }
  // override: optional { block, epd }
  var block = (override && override.block != null) ? override.block : providerCfg.block;
  var epd = (override && override.epd != null) ? override.epd : providerCfg.epd;

  if (!(sends > 0)) {
    if (providerCfg.billing === 'tenant') {
      return { sends: 0, mailboxes: 0, tenants: 0, units: 0, capacity: 0 };
    }
    return { sends: 0, units: 0, mailboxes: 0, capacity: 0 };
  }

  if (providerCfg.billing === 'tenant') {
    // tenant billing (Azure): mailboxes exact, do NOT inflate to a full block.
    var mailboxes = Math.ceil(sends / epd);
    var tenants = Math.ceil(mailboxes / block);
    var capacity = mailboxes * epd;
    return {
      sends: sends,
      mailboxes: mailboxes,
      tenants: tenants,
      units: tenants, // tenants count as domains
      capacity: capacity
    };
  }

  // mailbox billing (Google, Microsoft)
  var units = Math.ceil(sends / (block * epd)); // domains
  var mb = units * block;
  var cap = mb * epd;
  return {
    sends: sends,
    units: units,
    mailboxes: mb,
    capacity: cap
  };
}

// The volume band a mailbox count falls into. Bands are a flat per-mailbox
// rate — every mailbox is charged at the band rate, with no base fee and no
// included-slot allowance. Counts past the last band stay on its rate; the
// caller is expected to route those to custom pricing instead of quoting.
function bandFor(nMailboxes, bands) {
  for (var i = 0; i < bands.length; i++) {
    if (nMailboxes <= bands[i].upTo) {
      return {
        index: i,
        from: i === 0 ? 1 : bands[i - 1].upTo + 1,
        upTo: bands[i].upTo,
        rate: bands[i].rate
      };
    }
  }
  var last = bands.length - 1;
  return {
    index: last,
    from: last === 0 ? 1 : bands[last - 1].upTo + 1,
    upTo: bands[last].upTo,
    rate: bands[last].rate
  };
}

function calculate(input, pricing) {
  var dailyTarget = input.dailyTarget || 0;
  var mix = input.mix || { google: 0, microsoft: 0, azure: 0 };
  var overrides = input.overrides || {};

  var gW = mix.google || 0;
  var mW = mix.microsoft || 0;
  var aW = mix.azure || 0;
  var sum = gW + mW + aW;

  var valid = sum > 0 && dailyTarget > 0;
  var mixOk = sum === 100;

  var fractions = {
    google: sum > 0 ? gW / sum : 0,
    microsoft: sum > 0 ? mW / sum : 0,
    azure: sum > 0 ? aW / sum : 0
  };

  var gSends = valid ? dailyTarget * fractions.google : 0;
  var mSends = valid ? dailyTarget * fractions.microsoft : 0;
  var aSends = valid ? dailyTarget * fractions.azure : 0;

  var google = sizeProvider('google', gSends, pricing.providers.google, overrides.google);
  var microsoft = sizeProvider('microsoft', mSends, pricing.providers.microsoft, overrides.microsoft);
  var azure = sizeProvider('azure', aSends, pricing.providers.azure, overrides.azure);

  // Google + Microsoft are the mailbox-billed providers; Azure is per tenant.
  var nStandard = google.mailboxes + microsoft.mailboxes;

  var cycle = input.cycle || 'monthly';
  var bands = pricing.mailboxBands[cycle] || pricing.mailboxBands.monthly;

  var band = nStandard > 0 ? bandFor(nStandard, bands) : null;
  var mailboxRate = band ? band.rate : 0;
  var mailboxCost = nStandard * mailboxRate;

  var azureCost = azure.tenants * pricing.azureTenant;

  var totalMailboxes = google.mailboxes + microsoft.mailboxes + azure.mailboxes;
  var totalDomains = google.units + microsoft.units + azure.units;

  var warmup = !!input.warmup;
  var infraGuard = !!input.infraGuard;
  var warmupCost = warmup ? totalMailboxes * pricing.warmupPerMailbox : 0;
  var infraGuardCost = infraGuard ? totalDomains * pricing.infraGuardPerDomain : 0;

  var recurringFull = mailboxCost + azureCost + warmupCost + infraGuardCost;

  // Cycle savings live in the band rates themselves, so nothing is discounted
  // again here. What buyers want to see is this same setup against monthly.
  var effMonthly = recurringFull;

  var monthlyRate = nStandard > 0
    ? bandFor(nStandard, pricing.mailboxBands.monthly).rate
    : 0;
  var monthlyListRecurring =
    nStandard * monthlyRate + azureCost + warmupCost + infraGuardCost;
  var cycleSavingsAmount = Math.max(0, monthlyListRecurring - recurringFull);
  var cycleSavings =
    monthlyListRecurring > 0 ? cycleSavingsAmount / monthlyListRecurring : 0;

  // Past these thresholds we quote a volume deal instead of list pricing.
  var customPricing =
    valid &&
    (nStandard >= pricing.customPricingFrom ||
      azure.tenants >= pricing.customAzureTenantsFrom);

  var tldKey = input.tld || '.com';
  var domainsAnnual = totalDomains * pricing.tld[tldKey];

  var firstYear = effMonthly * 12 + domainsAnnual;
  var perMailbox = totalMailboxes > 0 ? effMonthly / totalMailboxes : 0;

  return {
    valid: valid,
    mixOk: mixOk,
    fractions: fractions,
    providers: {
      google: google,
      microsoft: microsoft,
      azure: azure
    },
    nStandard: nStandard,
    cycle: cycle,
    band: band,
    mailboxRate: mailboxRate,
    mailboxCost: mailboxCost,
    azureCost: azureCost,
    totalMailboxes: totalMailboxes,
    totalDomains: totalDomains,
    warmupCost: warmupCost,
    infraGuardCost: infraGuardCost,
    recurringFull: recurringFull,
    monthlyListRecurring: monthlyListRecurring,
    cycleSavings: cycleSavings,
    cycleSavingsAmount: cycleSavingsAmount,
    customPricing: customPricing,
    effMonthly: effMonthly,
    domainsAnnual: domainsAnnual,
    firstYear: firstYear,
    perMailbox: perMailbox
  };
}

if (typeof module !== 'undefined' && module.exports) { module.exports = { calculate, sizeProvider, bandFor }; }
