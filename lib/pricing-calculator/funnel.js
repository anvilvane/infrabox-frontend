// Infrabox reverse-funnel math. Pure: no DOM, no rounding (round at the display
// boundary, like engine.js). Turns a meetings-booked goal into a daily send
// target, which then feeds calculate() in engine.js unchanged.
//
// Funnel (each rate is a fraction in (0, 1], days is a positive integer):
//   positiveRepliesNeeded = meetings / meetingRate
//   emailsPerMonth        = positiveRepliesNeeded / positiveReplyRate
//   dailyTarget           = emailsPerMonth / sendingDays

function reverseFunnel(input) {
  var meetings = input.meetings || 0;
  var meetingRate = input.meetingRate || 0;
  var positiveReplyRate = input.positiveReplyRate || 0;
  var sendingDays = input.sendingDays || 0;

  var valid =
    meetings > 0 &&
    meetingRate > 0 &&
    positiveReplyRate > 0 &&
    sendingDays > 0;

  if (!valid) {
    return {
      valid: false,
      positiveRepliesNeeded: 0,
      emailsPerMonth: 0,
      dailyTarget: 0
    };
  }

  var positiveRepliesNeeded = meetings / meetingRate;
  var emailsPerMonth = positiveRepliesNeeded / positiveReplyRate;
  var dailyTarget = emailsPerMonth / sendingDays;

  return {
    valid: true,
    positiveRepliesNeeded: positiveRepliesNeeded,
    emailsPerMonth: emailsPerMonth,
    dailyTarget: dailyTarget
  };
}

if (typeof module !== 'undefined' && module.exports) { module.exports = { reverseFunnel }; }
