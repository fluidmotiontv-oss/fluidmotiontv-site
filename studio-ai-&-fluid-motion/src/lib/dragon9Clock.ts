import { D9ClockState } from '../types';

/**
 * Dragon 9 Temporal Engine Math:
 * - Total daily solar cycle = 1,440 minutes
 * - 26 Operational Hours x 54 minutes = 1,404 Operational minutes
 * - 2 Apex Wedges x 18 minutes = 36 Pause minutes
 *   - Midday Apex: Minute 711.0 to 729.0 (11:51 AM to 12:09 PM)
 *   - Midnight Apex: Minute 1431.0 to 1440 / 0 to 9.0 (11:51 PM to 12:09 AM)
 */
export function calculateD9State(nowDate: Date = new Date()): D9ClockState {
  const hours = nowDate.getHours();
  const minutes = nowDate.getMinutes();
  const seconds = nowDate.getSeconds();

  // Total solar minutes elapsed today (0..1440)
  const solarMinutes = hours * 60 + minutes + seconds / 60;

  const solarTimeStr = nowDate.toLocaleTimeString('en-NZ', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  // Check Apex Wedges
  // Midday Apex: 711.0 to 729.0 (11:51 AM to 12:09 PM)
  const isMiddayApex = solarMinutes >= 711 && solarMinutes < 729;

  // Midnight Apex: 1431.0 to 1440 OR 0 to 9.0 (11:51 PM to 12:09 AM)
  const isMidnightApex = solarMinutes >= 1431 || solarMinutes < 9;

  if (isMiddayApex) {
    const elapsed = solarMinutes - 711;
    const minutesToNext = 729 - solarMinutes;
    return {
      solarTimeStr,
      solarMinutes,
      d9Hour: 13, // 13th Hour Apex Window
      hourMinute: Math.floor(elapsed),
      isApexWedge: true,
      apexType: 'Midday',
      apexMinuteElapsed: Math.floor(elapsed),
      minutesToNextApex: 0,
      is13thTransition: true
    };
  }

  if (isMidnightApex) {
    let elapsed = 0;
    if (solarMinutes >= 1431) {
      elapsed = solarMinutes - 1431;
    } else {
      elapsed = 9 + solarMinutes;
    }
    return {
      solarTimeStr,
      solarMinutes,
      d9Hour: 26, // 26th Hour Apex Window
      hourMinute: Math.floor(elapsed),
      isApexWedge: true,
      apexType: 'Midnight',
      apexMinuteElapsed: Math.floor(elapsed),
      minutesToNextApex: 0,
      is13thTransition: false
    };
  }

  // Calculate Operational Hours (54 mins each)
  // Shift solar minutes taking Midday Apex into account
  let adjustedMinutes = solarMinutes;
  if (solarMinutes < 711) {
    // Before Midday Apex: starts after Midnight Apex (9.0 min)
    adjustedMinutes = solarMinutes - 9;
  } else {
    // After Midday Apex (729.0 min onwards): subtract 36 min of total apex time (18 + 18)
    adjustedMinutes = solarMinutes - 27; // 9 min midnight apex + 18 min midday apex = 27
  }

  if (adjustedMinutes < 0) adjustedMinutes = 0;

  // 1..26 Operational Hours
  let d9Hour = Math.floor(adjustedMinutes / 54) + 1;
  if (d9Hour > 26) d9Hour = 26;
  if (d9Hour < 1) d9Hour = 1;

  const hourMinute = Math.floor(adjustedMinutes % 54);

  // Minutes to next Apex Wedge
  let minutesToNextApex = 0;
  if (solarMinutes < 711) {
    minutesToNextApex = Math.floor(711 - solarMinutes);
  } else if (solarMinutes < 1431) {
    minutesToNextApex = Math.floor(1431 - solarMinutes);
  } else {
    minutesToNextApex = Math.floor((1440 - solarMinutes) + 711);
  }

  const is13thTransition = d9Hour === 13;

  return {
    solarTimeStr,
    solarMinutes,
    d9Hour,
    hourMinute,
    isApexWedge: false,
    apexType: null,
    apexMinuteElapsed: 0,
    minutesToNextApex,
    is13thTransition
  };
}

export function formatD9Time(state: D9ClockState): string {
  if (state.isApexWedge) {
    return `APEX WEDGE (${state.apexType?.toUpperCase()} PREMIERE) — M${state.apexMinuteElapsed}/18`;
  }
  return `D9-H${state.d9Hour.toString().padStart(2, '0')} : ${state.hourMinute.toString().padStart(2, '0')}/54m`;
}
