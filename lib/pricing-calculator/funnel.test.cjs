// Headless verification of the Infrabox reverse funnel.
// Funnel feeds calculate() in engine.js, so the round-trip invariant matters
// most: the dailyTarget it produces must provision enough capacity to send the
// emails the funnel says are required.
const assert = require('assert');
const { reverseFunnel } = require('./funnel.js');
const { calculate } = require('./engine.js');
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

const cfg = pricing.funnel;

// ---- worked example (exact) ----
group('worked example: 20 meetings/mo with default rates', function () {
  const f = reverseFunnel({
    meetings: 20,
    meetingRate: cfg.meetingRate,           // 0.30
    positiveReplyRate: cfg.positiveReplyRate, // 0.015
    sendingDays: cfg.sendingDaysPerMonth      // 22
  });
  assert.ok(f.valid, 'should be valid');
  // 20 / 0.30 = 66.666...
  near(f.positiveRepliesNeeded, 20 / 0.30, 'positive replies needed');
  // 66.666.. / 0.015 = 4444.444..
  near(f.emailsPerMonth, (20 / 0.30) / 0.015, 'emails per month');
  // 4444.444.. / 22 = 202.0202..
  near(f.dailyTarget, ((20 / 0.30) / 0.015) / 22, 'daily target');
});

// ---- zero / negative guards ----
group('invalid when any input is non-positive', function () {
  const cases = [
    { meetings: 0, meetingRate: 0.3, positiveReplyRate: 0.015, sendingDays: 22 },
    { meetings: 20, meetingRate: 0, positiveReplyRate: 0.015, sendingDays: 22 },
    { meetings: 20, meetingRate: 0.3, positiveReplyRate: 0, sendingDays: 22 },
    { meetings: 20, meetingRate: 0.3, positiveReplyRate: 0.015, sendingDays: 0 },
    { meetings: -5, meetingRate: 0.3, positiveReplyRate: 0.015, sendingDays: 22 }
  ];
  cases.forEach(function (c, i) {
    const f = reverseFunnel(c);
    assert.strictEqual(f.valid, false, 'case ' + i + ' should be invalid');
    assert.strictEqual(f.dailyTarget, 0, 'case ' + i + ' dailyTarget 0');
  });
  // missing object fields entirely
  const empty = reverseFunnel({});
  assert.strictEqual(empty.valid, false, 'empty input invalid');
});

// ---- monotonicity: more meetings => higher dailyTarget ----
group('dailyTarget strictly increases with meetings', function () {
  let prev = -1;
  for (let m = 1; m <= 200; m += 7) {
    const f = reverseFunnel({
      meetings: m,
      meetingRate: cfg.meetingRate,
      positiveReplyRate: cfg.positiveReplyRate,
      sendingDays: cfg.sendingDaysPerMonth
    });
    assert.ok(f.dailyTarget > prev, 'expected increase at meetings=' + m);
    prev = f.dailyTarget;
  }
});

// ---- monotonicity: lower conversion rates => more sending required ----
group('lower positiveReplyRate => higher dailyTarget', function () {
  const hi = reverseFunnel({ meetings: 20, meetingRate: 0.3, positiveReplyRate: 0.03, sendingDays: 22 });
  const lo = reverseFunnel({ meetings: 20, meetingRate: 0.3, positiveReplyRate: 0.01, sendingDays: 22 });
  assert.ok(lo.dailyTarget > hi.dailyTarget, 'harder funnel needs more sends');
});

// ---- round-trip: funnel dailyTarget, fed forward, provisions enough capacity ----
group('round-trip: provisioned capacity >= emails the funnel requires', function () {
  const mixes = [
    { google: 100, microsoft: 0, azure: 0 },
    { google: 70, microsoft: 30, azure: 0 },
    { google: 34, microsoft: 33, azure: 33 }
  ];
  for (let m = 5; m <= 120; m += 5) {
    const f = reverseFunnel({
      meetings: m,
      meetingRate: cfg.meetingRate,
      positiveReplyRate: cfg.positiveReplyRate,
      sendingDays: cfg.sendingDaysPerMonth
    });
    mixes.forEach(function (mix) {
      const r = calculate({ dailyTarget: f.dailyTarget, mix: mix, plan: 'auto', cycle: 'monthly' }, pricing);
      assert.ok(r.valid, 'forward result valid for meetings=' + m);
      // total provisioned daily capacity must cover the required daily sends
      let cap = 0;
      ['google', 'microsoft', 'azure'].forEach(function (k) {
        cap += r.providers[k].capacity || 0;
      });
      assert.ok(
        cap + EPS >= f.dailyTarget,
        'capacity ' + cap + ' must cover dailyTarget ' + f.dailyTarget + ' (meetings=' + m + ')'
      );
    });
  }
});

console.log('\n' + pass + ' passed, ' + fail + ' failed');
if (fail > 0) {
  console.log('\nFailures:\n' + failures.map(function (s) { return '  - ' + s; }).join('\n'));
  process.exit(1);
}
