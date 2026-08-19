// Headless verification of the Infrabox pricing engine.
// Pricing model: a flat per-mailbox rate chosen by volume band. No base fee,
// no included-slot allowance. 1-29 = $3.90, 30-99 = $3.25, 100-199 = $2.99,
// 200+ routes to custom volume pricing.
const assert = require('assert');
const { calculate, sizeProvider, bandFor } = require('./engine.js');
const pricing = require('./pricing.config.json');

const EPS = 1e-9;
let pass = 0, fail = 0;
const failures = [];

function group(name, fn) {
  try {
    fn();
    pass++;
    console.log('PASS  ' + name);
  } catch (e) {
    fail++;
    failures.push(name + ' :: ' + e.message);
    console.log('FAIL  ' + name + '  ->  ' + e.message);
  }
}

function near(a, b, msg) {
  assert.ok(Math.abs(a - b) < EPS, (msg || '') + ' expected ' + b + ' got ' + a);
}

// small deterministic PRNG so failures are reproducible
let _seed = 1234567;
function rnd() {
  _seed = (_seed * 1103515245 + 12345) & 0x7fffffff;
  return _seed / 0x7fffffff;
}
function ri(min, max) { return Math.floor(min + rnd() * (max - min + 1)); }
function pick(arr) { return arr[ri(0, arr.length - 1)]; }

// The rate a mailbox count should be charged at, read straight from config.
function rateFor(cycle, n) {
  const bands = pricing.mailboxBands[cycle];
  for (const b of bands) if (n <= b.upTo) return b.rate;
  return bands[bands.length - 1].rate;
}

// Drive an exact mailbox count: 1 mailbox per domain, 1 email/day each.
function atMailboxes(n, cycle, extra) {
  return calculate(Object.assign({
    dailyTarget: n,
    mix: { google: 100, microsoft: 0, azure: 0 },
    cycle: cycle,
    tld: '.com',
    overrides: { google: { block: 1, epd: 1 } }
  }, extra || {}), pricing);
}

// ---------- CONFIRMED RATE TABLE ----------
group('CONFIRMED: monthly bands are 1-29 $3.90, 30-99 $3.25, 100-199 $2.99', () => {
  const cases = [
    [1, 3.90], [15, 3.90], [29, 3.90],
    [30, 3.25], [50, 3.25], [99, 3.25],
    [100, 2.99], [150, 2.99], [199, 2.99]
  ];
  cases.forEach(([n, rate]) => {
    const r = atMailboxes(n, 'monthly');
    assert.strictEqual(r.nStandard, n, 'n=' + n + ' nStandard');
    near(r.mailboxRate, rate, 'n=' + n + ' rate');
    near(r.mailboxCost, n * rate, 'n=' + n + ' mailboxCost');
    near(r.effMonthly, n * rate, 'n=' + n + ' effMonthly (no addons)');
  });
});

// ---------- BAND EDGES ----------
group('BAND EDGES: the rate steps exactly at 30 and 100', () => {
  near(atMailboxes(29, 'monthly').mailboxRate, 3.90, 'n=29');
  near(atMailboxes(30, 'monthly').mailboxRate, 3.25, 'n=30');
  near(atMailboxes(99, 'monthly').mailboxRate, 3.25, 'n=99');
  near(atMailboxes(100, 'monthly').mailboxRate, 2.99, 'n=100');

  // Band metadata reported for the UI
  const b = atMailboxes(50, 'monthly').band;
  assert.strictEqual(b.from, 30, 'band from');
  assert.strictEqual(b.upTo, 99, 'band upTo');
  near(b.rate, 3.25, 'band rate');

  const b0 = atMailboxes(5, 'monthly').band;
  assert.strictEqual(b0.from, 1, 'first band from');
  assert.strictEqual(b0.upTo, 29, 'first band upTo');
});

// ---------- NO BASE FEE ----------
group('NO BASE FEE: cost is exactly mailboxes x rate, never a base plus overage', () => {
  for (const cycle of ['monthly', 'quarterly', 'annual']) {
    for (let n = 1; n <= 199; n++) {
      const r = atMailboxes(n, cycle);
      near(r.mailboxCost, n * rateFor(cycle, n), cycle + ' n=' + n + ' mailboxCost');
    }
  }
  // A 40-mailbox setup is 40 x $3.25, not $99 + 10 x $3.25.
  near(atMailboxes(40, 'monthly').effMonthly, 130, '40 mailboxes monthly');
  // A 10-mailbox setup is 10 x $3.90, not a $39 plan fee that happens to match.
  near(atMailboxes(10, 'monthly').effMonthly, 39, '10 mailboxes monthly');
});

// ---------- CUSTOM PRICING ----------
group('CUSTOM PRICING: flagged at 200+ mailboxes or 10+ Azure tenants', () => {
  assert.strictEqual(atMailboxes(199, 'monthly').customPricing, false, '199 not custom');
  assert.strictEqual(atMailboxes(200, 'monthly').customPricing, true, '200 is custom');
  assert.strictEqual(atMailboxes(500, 'monthly').customPricing, true, '500 is custom');

  // Azure tenants trip the same flag independently of mailbox count.
  const az = calculate({
    dailyTarget: 10 * pricing.providers.azure.block * pricing.providers.azure.epd,
    mix: { google: 0, microsoft: 0, azure: 100 },
    cycle: 'monthly',
    tld: '.com'
  }, pricing);
  assert.ok(az.providers.azure.tenants >= pricing.customAzureTenantsFrom, 'azure tenants');
  assert.strictEqual(az.customPricing, true, 'azure-only custom pricing');
  near(az.mailboxCost, 0, 'azure-only has no mailbox cost');
});

// ---------- CYCLES ----------
group('CYCLES: rates come from the cycle table, never discounted twice', () => {
  for (let i = 0; i < 40; i++) {
    const n = ri(1, 199);
    const m = atMailboxes(n, 'monthly');
    const q = atMailboxes(n, 'quarterly');
    const a = atMailboxes(n, 'annual');

    near(m.effMonthly, m.recurringFull, 'n=' + n + ' monthly effMonthly');
    near(q.effMonthly, q.recurringFull, 'n=' + n + ' quarterly effMonthly');
    near(a.effMonthly, a.recurringFull, 'n=' + n + ' annual effMonthly');

    assert.ok(q.effMonthly <= m.effMonthly + EPS, 'n=' + n + ' quarterly <= monthly');
    assert.ok(a.effMonthly <= q.effMonthly + EPS, 'n=' + n + ' annual <= quarterly');

    near(m.cycleSavingsAmount, 0, 'n=' + n + ' monthly is its own baseline');
    near(a.cycleSavingsAmount, a.monthlyListRecurring - a.recurringFull, 'n=' + n + ' annual saving');

    // Sizing never depends on the billing cycle.
    assert.strictEqual(m.totalMailboxes, a.totalMailboxes, 'n=' + n + ' mailboxes');
    assert.strictEqual(m.totalDomains, a.totalDomains, 'n=' + n + ' domains');
    near(m.domainsAnnual, a.domainsAnnual, 'n=' + n + ' domainsAnnual');
  }
});

// ---------- WORKED EXAMPLE ----------
group('WORKED EXAMPLE (dailyTarget 1700, 70/30/0, monthly, .com)', () => {
  const r = calculate({
    dailyTarget: 1700,
    mix: { google: 70, microsoft: 30, azure: 0 },
    cycle: 'monthly',
    warmup: false,
    infraGuard: false,
    tld: '.com'
  }, pricing);

  assert.strictEqual(r.providers.google.sends, 1190, 'google sends');
  assert.strictEqual(r.providers.google.units, 27, 'google units');
  assert.strictEqual(r.providers.google.mailboxes, 81, 'google mailboxes');
  assert.strictEqual(r.providers.microsoft.units, 34, 'microsoft units');
  assert.strictEqual(r.providers.microsoft.mailboxes, 102, 'microsoft mailboxes');

  assert.strictEqual(r.totalMailboxes, 183, 'totalMailboxes');
  assert.strictEqual(r.totalDomains, 61, 'totalDomains');

  // 183 mailboxes -> 100-199 band -> $2.99 each
  near(r.mailboxRate, 2.99, 'rate');
  near(r.mailboxCost, 183 * 2.99, 'mailboxCost');
  near(r.effMonthly, 183 * 2.99, 'effMonthly');
  near(r.domainsAnnual, 732, 'domainsAnnual');
  near(r.firstYear, 183 * 2.99 * 12 + 732, 'firstYear');
  assert.strictEqual(r.customPricing, false, '183 is still list pricing');
});

// ---------- INV1: capacity >= sends for every provider with volume ----------
group('INV1: capacity >= sends for all providers with fraction>0 (350 configs)', () => {
  for (let i = 0; i < 350; i++) {
    const mix = { google: ri(0, 100), microsoft: ri(0, 100), azure: ri(0, 100) };
    if (rnd() < 0.3) mix.google = 0;
    if (rnd() < 0.3) mix.microsoft = 0;
    if (rnd() < 0.3) mix.azure = 0;
    if (mix.google + mix.microsoft + mix.azure === 0) mix.google = 1;

    const overrides = {};
    if (rnd() < 0.3) overrides.google = { block: ri(1, 5), epd: ri(1, 30) };
    if (rnd() < 0.3) overrides.microsoft = { block: ri(1, 5), epd: ri(1, 30) };
    if (rnd() < 0.3) overrides.azure = { block: ri(10, 60), epd: ri(1, 10) };

    const input = {
      dailyTarget: ri(1, 50000),
      mix: mix,
      cycle: pick(['monthly', 'quarterly', 'annual']),
      warmup: rnd() < 0.5,
      infraGuard: rnd() < 0.5,
      tld: pick(['.com', '.co', '.info']),
      overrides: overrides
    };
    const r = calculate(input, pricing);
    const sum = mix.google + mix.microsoft + mix.azure;
    ['google', 'microsoft', 'azure'].forEach(p => {
      const frac = mix[p] / sum;
      if (frac > 0) {
        const pr = r.providers[p];
        assert.ok(pr.capacity >= pr.sends - EPS,
          'config#' + i + ' ' + p + ' capacity ' + pr.capacity + ' < sends ' + pr.sends);
      }
    });
  }
});

// ---------- INV2: Azure-only ----------
group('INV2: Azure-only sizing and cost', () => {
  for (let i = 0; i < 60; i++) {
    const dt = ri(1, 40000);
    const r = calculate({
      dailyTarget: dt,
      mix: { google: 0, microsoft: 0, azure: 100 },
      cycle: 'monthly',
      tld: '.com'
    }, pricing);
    const epd = pricing.providers.azure.epd;
    const block = pricing.providers.azure.block;
    const expMailboxes = Math.ceil(dt / epd);
    const expTenants = Math.ceil(expMailboxes / block);
    assert.strictEqual(r.providers.azure.mailboxes, expMailboxes, 'dt=' + dt + ' azure mailboxes');
    assert.strictEqual(r.providers.azure.tenants, expTenants, 'dt=' + dt + ' azure tenants');
    near(r.azureCost, expTenants * pricing.azureTenant, 'dt=' + dt + ' azureCost');
    near(r.mailboxCost, 0, 'dt=' + dt + ' mailboxCost 0');
  }
});

// ---------- INV3: add-on costs ----------
group('INV3: warmupCost & infraGuardCost wiring', () => {
  for (let i = 0; i < 60; i++) {
    const base = {
      dailyTarget: ri(50, 20000),
      mix: { google: ri(0, 100), microsoft: ri(0, 100), azure: ri(0, 100) },
      cycle: 'monthly',
      tld: '.com'
    };
    if (base.mix.google + base.mix.microsoft + base.mix.azure === 0) base.mix.google = 1;

    const off = calculate(Object.assign({}, base, { warmup: false, infraGuard: false }), pricing);
    assert.strictEqual(off.warmupCost, 0, 'warmup off cost 0');
    assert.strictEqual(off.infraGuardCost, 0, 'infraGuard off cost 0');

    const on = calculate(Object.assign({}, base, { warmup: true, infraGuard: true }), pricing);
    near(on.warmupCost, on.totalMailboxes * pricing.warmupPerMailbox, 'warmupCost');
    near(on.infraGuardCost, on.totalDomains * pricing.infraGuardPerDomain, 'infraGuardCost');
    near(on.recurringFull, on.mailboxCost + on.azureCost + on.warmupCost + on.infraGuardCost, 'recurringFull');
  }
});

// ---------- INV4: validity / mixOk ----------
group('INV4: validity flags and mixOk normalization', () => {
  const z = calculate({ dailyTarget: 0, mix: { google: 70, microsoft: 30, azure: 0 }, cycle: 'monthly', tld: '.com' }, pricing);
  assert.strictEqual(z.valid, false, 'dailyTarget 0 valid false');
  near(z.effMonthly, 0, 'dailyTarget 0 effMonthly 0');
  assert.strictEqual(z.band, null, 'dailyTarget 0 has no band');
  assert.strictEqual(z.customPricing, false, 'invalid is not custom pricing');

  const zm = calculate({ dailyTarget: 1000, mix: { google: 0, microsoft: 0, azure: 0 }, cycle: 'monthly', tld: '.com' }, pricing);
  assert.strictEqual(zm.valid, false, 'all-zero mix valid false');
  assert.strictEqual(zm.totalMailboxes, 0, 'all-zero mix totalMailboxes 0');

  const nm = calculate({ dailyTarget: 1700, mix: { google: 50, microsoft: 30, azure: 0 }, cycle: 'monthly', tld: '.com' }, pricing);
  assert.strictEqual(nm.mixOk, false, '50/30/0 mixOk false');
  assert.strictEqual(nm.valid, true, '50/30/0 valid true');
  assert.ok(nm.totalMailboxes > 0, '50/30/0 computes mailboxes');

  const ok = calculate({ dailyTarget: 1700, mix: { google: 70, microsoft: 30, azure: 0 }, cycle: 'monthly', tld: '.com' }, pricing);
  assert.strictEqual(ok.mixOk, true, '70/30/0 mixOk true');
});

// ---------- INV5: cost rises with volume ----------
group('INV5: recurringFull non-decreasing as dailyTarget rises', () => {
  // Within a single band the rate is constant, and band rates fall as volume
  // rises, so check the total never goes down step to step.
  [
    { mix: { google: 60, microsoft: 30, azure: 10 }, cycle: 'monthly', warmup: true, infraGuard: true, tld: '.com' },
    { mix: { google: 100, microsoft: 0, azure: 0 }, cycle: 'annual', warmup: false, infraGuard: true, tld: '.info' }
  ].forEach((fixed, idx) => {
    let prev = -Infinity;
    for (let dt = 1; dt <= 60000; dt += 173) {
      const r = calculate(Object.assign({ dailyTarget: dt }, fixed), pricing);
      assert.ok(r.recurringFull >= prev - EPS,
        'set#' + idx + ' dt=' + dt + ' recurringFull ' + r.recurringFull + ' < prev ' + prev);
      prev = r.recurringFull;
    }
  });
});

// ---------- INV6: bandFor is total ----------
group('INV6: bandFor returns a band for any positive count', () => {
  const bands = pricing.mailboxBands.monthly;
  for (let n = 1; n <= 1000; n++) {
    const b = bandFor(n, bands);
    assert.ok(b && b.rate > 0, 'n=' + n + ' has a rate');
    assert.ok(b.from <= n || n > bands[bands.length - 1].upTo, 'n=' + n + ' band from');
  }
  // Past the last band the last rate is retained (UI routes these to a call).
  near(bandFor(5000, bands).rate, bands[bands.length - 1].rate, 'past last band');
});

// ---------- summary ----------
console.log('');
console.log((pass) + '/' + (pass + fail) + ' passed');
if (fail > 0) {
  console.log('');
  console.log('FAILING ASSERTIONS:');
  failures.forEach(f => console.log('  - ' + f));
  process.exit(1);
}
