import loginPage from '../../../Login.page';
import {selectDateRangeOnNewDatePicker} from '../../../helper-functions';
import TimePlanningWorkingHoursPage from '../TimePlanningWorkingHours.page';
import pluginPage from '../../../Plugin.page';


// thisMonday should be monday of the current week
const formatDate = (date: Date): string => {
  const day = date.getDate();
  const month = date.getMonth() + 1; // 0-indexed
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

// Utility to get Monday of a week given a base date
const getMonday = (baseDate: Date): Date => {
  const dayOfWeek = baseDate.getDay(); // 0 (Sun) to 6 (Sat)
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(baseDate);
  monday.setDate(baseDate.getDate() + diffToMonday);
  return monday;
};

const getSunday = (monday: Date): Date => {
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return sunday;
};

// Utility to generate a full week from a given Monday
const getWeekDates = (monday: Date): string[] => {
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    dates.push(formatDate(date));
  }
  return dates;
};

// Get reference point (today)

const today = new Date();

// Last week
const lastWeekBase = new Date(today);
lastWeekBase.setDate(today.getDate() - 7);
const lastWeekMonday = getMonday(lastWeekBase);
const lastWeekSunday = getSunday(lastWeekMonday);
const lastWeekDates = getWeekDates(lastWeekMonday);

// This week
const thisWeekMonday = getMonday(today);
const thisWeekSunday = getSunday(thisWeekMonday);
const thisWeekDates = getWeekDates(thisWeekMonday);

// Next week
const nextWeekBase = new Date(today);
nextWeekBase.setDate(today.getDate() + 7);
const nextWeekMonday = getMonday(nextWeekBase);
const nextWeekSunday = getSunday(nextWeekMonday);
const nextWeekDates = getWeekDates(nextWeekMonday);

// 2 weeks in the future
const futureWeekBase = new Date(today);
futureWeekBase.setDate(today.getDate() + 14);
const futureWeekMonday = getMonday(futureWeekBase);
const futureWeekSunday = getSunday(futureWeekMonday);
const futureWeekDates = getWeekDates(futureWeekMonday);

const filters = [
  {
    dateRange: {
      yearFrom: lastWeekMonday.getFullYear(),
      monthFrom: lastWeekMonday.getMonth() + 1, // getMonth() returns 0-indexed month
      dayFrom: lastWeekMonday.getDate(),
      yearTo: lastWeekSunday.getFullYear(),
      monthTo: lastWeekSunday.getMonth() + 1,
      dayTo: lastWeekSunday.getDate(),
    },
  },
];

const filtersNextWeek = [
  {
    dateRange: {
      yearFrom: nextWeekMonday.getFullYear(),
      monthFrom: nextWeekMonday.getMonth() + 1,
      dayFrom: nextWeekMonday.getDate(),
      yearTo: nextWeekSunday.getFullYear(),
      monthTo: nextWeekSunday.getMonth() + 1,
      dayTo: nextWeekSunday.getDate(),
    },
  },
];

const filtersFutureWeek = [
  {
    dateRange: {
      yearFrom: futureWeekMonday.getFullYear(),
      monthFrom: futureWeekMonday.getMonth() + 1,
      dayFrom: futureWeekMonday.getDate(),
      yearTo: futureWeekSunday.getFullYear(),
      monthTo: futureWeekSunday.getMonth() + 1,
      dayTo: futureWeekSunday.getDate(),
    },
  },
];

const planHours = [
  { date: lastWeekDates[0], hours: 8, sumFlex: 89.45, nettoHours: 0, flex: -8, humanFlex: '89:27'},
  { date: lastWeekDates[1], hours: 8, sumFlex: 81.45, nettoHours: 0, flex: -8, humanFlex: '81:27'},
  { date: lastWeekDates[2], hours: 8, sumFlex: 73.45, nettoHours: 0, flex: -8, humanFlex: '73:27'},
  { date: lastWeekDates[3], hours: 8, sumFlex: 65.45, nettoHours: 0, flex: -8, humanFlex: '65:27'},
  { date: lastWeekDates[4], hours: 8, sumFlex: 57.45, nettoHours: 0, flex: -8, humanFlex: '57:27'},
  { date: lastWeekDates[5], hours: 8, sumFlex: 49.45, nettoHours: 0, flex: -8, humanFlex: '49:27'},
  { date: lastWeekDates[6], hours: 8, sumFlex: 41.45, nettoHours: 0, flex: -8, humanFlex: '41:27'},
];

const planTexts = [
  { date: lastWeekDates[0], text: '07:30-15:30', plannedHours: '8:00', flexBalanceToDate: 'swap_vert89:27', calculatedHours: '8', plannedStartOfShift1: '07:30', plannedEndOfShift1: '15:30', plannedBreakOfShift1: '00:00', plannedStartOfShift2: '00:00', plannedEndOfShift2: '00:00', plannedBreakOfShift2: '00:00' },
  { date: lastWeekDates[1], text: '7:45-16:00/1', plannedHours: '8:00', flexBalanceToDate: 'swap_vert81:27', calculatedHours: '8', plannedStartOfShift1: '07:45', plannedEndOfShift1: '16:00', plannedBreakOfShift1: '01:00', plannedStartOfShift2: '00:00', plannedEndOfShift2: '00:00', plannedBreakOfShift2: '00:00' },
  { date: lastWeekDates[2], text: '7:15-16:00/1;17-20/0,5', plannedHours: '8:00', flexBalanceToDate: 'swap_vert73:27', calculatedHours: '8', plannedStartOfShift1: '07:15', plannedEndOfShift1: '16:00', plannedBreakOfShift1: '01:00', plannedStartOfShift2: '17:00', plannedEndOfShift2: '20:00', plannedBreakOfShift2: '00:30' },
  { date: lastWeekDates[3], text: '6-12/½;18:00-20:00/0.5', plannedHours: '8:00', flexBalanceToDate: 'swap_vert65:27', calculatedHours: '8', plannedStartOfShift1: '06:00', plannedEndOfShift1: '12:00', plannedBreakOfShift1: '00:30', plannedStartOfShift2: '18:00', plannedEndOfShift2: '20:00', plannedBreakOfShift2: '00:30' },
  { date: lastWeekDates[4], text: '06:00-12:00/¾;18:00-20:00/0.5', plannedHours: '8:00', flexBalanceToDate: 'swap_vert57:27', calculatedHours: '8', plannedStartOfShift1: '06:00', plannedEndOfShift1: '12:00', plannedBreakOfShift1: '00:45', plannedStartOfShift2: '18:00', plannedEndOfShift2: '20:00', plannedBreakOfShift2: '00:30' },
  { date: lastWeekDates[5], text: '6-12/¾;18-20/¾', plannedHours: '8:00', flexBalanceToDate: 'swap_vert49:27', calculatedHours: '8', plannedStartOfShift1: '06:00', plannedEndOfShift1: '12:00', plannedBreakOfShift1: '00:45', plannedStartOfShift2: '18:00', plannedEndOfShift2: '20:00', plannedBreakOfShift2: '00:45' },
  { date: lastWeekDates[6], text: '6-14/½', plannedHours: '8:00', flexBalanceToDate: 'swap_vert41:27', calculatedHours: '8', plannedStartOfShift1: '06:00', plannedEndOfShift1: '14:00', plannedBreakOfShift1: '00:30', plannedStartOfShift2: '00:00', plannedEndOfShift2: '00:00', plannedBreakOfShift2: '00:00' },
];

const updatePlanTexts = [
  { date: lastWeekDates[0], text: '07:30-15:30', plannedHours: '1:00', flexBalanceToDate: 'swap_vert89.45', flexToDate: '97.45', flexIncludingToday: '89.45', nettoHours: '0.00', todaysFlex: '-8.00', paidOutFlex: 0, calculatedHours: '8', plannedStartOfShift1: '07:30', plannedEndOfShift1: '15:30', plannedBreakOfShift1: '', plannedStartOfShift2: '', plannedEndOfShift2: '', plannedBreakOfShift2: '' },
  { date: lastWeekDates[1], text: '7:45-16:00/1', plannedHours: '2:00', flexBalanceToDate: 'swap_vert82.20', flexToDate: '89.45', flexIncludingToday: '82.20', nettoHours: '0.00', todaysFlex: '-7.25', paidOutFlex: 0, calculatedHours: '7.25', plannedStartOfShift1: '07:45', plannedEndOfShift1: '16:00', plannedBreakOfShift1: '01:00', plannedStartOfShift2: '', plannedEndOfShift2: '', plannedBreakOfShift2: '' },
  { date: lastWeekDates[2], text: '7:15-16:00/1;17-20/0,5', plannedHours: '3:00', flexBalanceToDate: 'swap_vert71.95', flexToDate: '82.20', flexIncludingToday: '71.95', nettoHours: '0.00', todaysFlex: '-10.25', paidOutFlex: 0, calculatedHours: '10.25', plannedStartOfShift1: '07:15', plannedEndOfShift1: '16:00', plannedBreakOfShift1: '01:00', plannedStartOfShift2: '17:00', plannedEndOfShift2: '20:00', plannedBreakOfShift2: '00:30' },
  { date: lastWeekDates[3], text: '6-12/½;18:00-20:00/0.5', plannedHours: '', flexBalanceToDate: 'swap_vert64.95', flexToDate: '71.95', flexIncludingToday: '64.95', nettoHours: '0.00', todaysFlex: '-7.00', paidOutFlex: 0, calculatedHours: '7', plannedStartOfShift1: '06:00', plannedEndOfShift1: '12:00', plannedBreakOfShift1: '00:30', plannedStartOfShift2: '18:00', plannedEndOfShift2: '20:00', plannedBreakOfShift2: '00:30' },
  { date: lastWeekDates[4], text: '06:00-12:00/¾;18:00-20:00/0.5', plannedHours: '4:00', flexBalanceToDate: 'swap_vert58.20', flexToDate: '64.95', flexIncludingToday: '58.20', nettoHours: '0.00', todaysFlex: '-6.75', paidOutFlex: 0, calculatedHours: '6.75', plannedStartOfShift1: '06:00', plannedEndOfShift1: '12:00', plannedBreakOfShift1: '00:45', plannedStartOfShift2: '18:00', plannedEndOfShift2: '20:00', plannedBreakOfShift2: '00:30' },
  { date: lastWeekDates[5], text: '6-12/¾;18-20/¾', plannedHours: '5:00', flexBalanceToDate: 'swap_vert51.70', flexToDate: '58.20', flexIncludingToday: '51.70', nettoHours: '0.00', todaysFlex: '-6.50', paidOutFlex: 0, calculatedHours: '6.5', plannedStartOfShift1: '06:00', plannedEndOfShift1: '12:00', plannedBreakOfShift1: '00:45', plannedStartOfShift2: '18:00', plannedEndOfShift2: '20:00', plannedBreakOfShift2: '00:45' },
  { date: lastWeekDates[6], text: '6-14/½', plannedHours: '6:00', flexBalanceToDate: 'swap_vert44.20', flexToDate: '51.70', flexIncludingToday: '44.20', nettoHours: '0.00', todaysFlex: '-7.50', paidOutFlex: 0, calculatedHours: '7.5', plannedStartOfShift1: '06:00', plannedEndOfShift1: '14:00', plannedBreakOfShift1: '00:30', plannedStartOfShift2: '', plannedEndOfShift2: '', plannedBreakOfShift2: '' },
];

const secondUpdatePlanTexts = [
  { date: nextWeekDates[0], text: '07:30-15:30', firstShift: 'calendar_month 07:30 - 15:30 / 00:00', plannedHours: '8:00', flexBalanceToDate: 'swap_vert89.45', flexToDate: '97.45', flexIncludingToday: '89.45', nettoHours: '0.00', todaysFlex: '-8.00', paidOutFlex: 0, calculatedHours: '8', plannedStartOfShift1: '07:30', plannedEndOfShift1: '15:30', plannedBreakOfShift1: '00:00', plannedStartOfShift2: '', plannedEndOfShift2: '', plannedBreakOfShift2: '' },
  { date: nextWeekDates[1], text: '7:45-16:00/1', firstShift: 'calendar_month 07:50 - 16:00 / 01:00', plannedHours: '8:00', flexBalanceToDate: 'swap_vert82.28', flexToDate: '89.45', flexIncludingToday: '82.28', nettoHours: '0.00', todaysFlex: '-7.17', paidOutFlex: 0, calculatedHours: '7.166666666666667', plannedStartOfShift1: '07:50', plannedEndOfShift1: '16:00', plannedBreakOfShift1: '01:00', plannedStartOfShift2: '', plannedEndOfShift2: '', plannedBreakOfShift2: '' },
  { date: nextWeekDates[2], text: '7:15-16:00/1;17-20/0,5', firstShift: 'calendar_month 07:15 - 16:00 / 01:00', secondShift: 'calendar_month 17:00 - 20:00 / 00:30', plannedHours: '8:00', flexBalanceToDate: 'swap_vert72.03', flexToDate: '82.28', flexIncludingToday: '72.03', nettoHours: '0.00', todaysFlex: '-10.25', paidOutFlex: 0, calculatedHours: '10.25', plannedStartOfShift1: '07:15', plannedEndOfShift1: '16:00', plannedBreakOfShift1: '01:00', plannedStartOfShift2: '17:00', plannedEndOfShift2: '20:00', plannedBreakOfShift2: '00:30' },
  { date: nextWeekDates[3], text: '6-12/½;18:00-20:00/0.5', firstShift: 'calendar_month 06:00 - 12:00 / 00:30', secondShift: 'calendar_month 18:00 - 20:00 / 00:30', plannedHours: '8:00', flexBalanceToDate: 'swap_vert65.03', flexToDate: '72.03', flexIncludingToday: '65.03', nettoHours: '0.00', todaysFlex: '-7.00', paidOutFlex: 0, calculatedHours: '7', plannedStartOfShift1: '06:00', plannedEndOfShift1: '12:00', plannedBreakOfShift1: '00:30', plannedStartOfShift2: '18:00', plannedEndOfShift2: '20:00', plannedBreakOfShift2: '00:30' },
  { date: nextWeekDates[4], text: '06:00-12:00/¾;18:00-20:00/0.5', firstShift: 'calendar_month 06:00 - 12:00 / 00:50', secondShift: 'calendar_month 18:00 - 20:00 / 00:30', plannedHours: '8:00', flexBalanceToDate: 'swap_vert58.36', flexToDate: '65.03', flexIncludingToday: '58.36', nettoHours: '0.00', todaysFlex: '-6.67', paidOutFlex: 0, calculatedHours: '6.666666666666667', plannedStartOfShift1: '06:00', plannedEndOfShift1: '12:00', plannedBreakOfShift1: '00:50', plannedStartOfShift2: '18:00', plannedEndOfShift2: '20:00', plannedBreakOfShift2: '00:30' },
  { date: nextWeekDates[5], text: '6-12/¾;18-20/¾', firstShift: 'calendar_month 06:00 - 12:00 / 00:50', secondShift: 'calendar_month 18:00 - 20:00 / 00:50', plannedHours: '8:00', flexBalanceToDate: 'swap_vert52.03', flexToDate: '58.36', flexIncludingToday: '52.03', nettoHours: '0.00', todaysFlex: '-6.33', paidOutFlex: 0, calculatedHours: '6.333333333333333', plannedStartOfShift1: '06:00', plannedEndOfShift1: '12:00', plannedBreakOfShift1: '00:50', plannedStartOfShift2: '18:00', plannedEndOfShift2: '20:00', plannedBreakOfShift2: '00:50' },
  { date: lastWeekDates[6], text: '6-14/½', firstShift: 'calendar_month 06:00 - 14:00 / 00:30', plannedHours: '8:00', flexBalanceToDate: 'swap_vert44.53', flexToDate: '52.03', flexIncludingToday: '44.53', nettoHours: '0.00', todaysFlex: '-7.50', paidOutFlex: 0, calculatedHours: '7.5', plannedStartOfShift1: '06:00', plannedEndOfShift1: '14:00', plannedBreakOfShift1: '00:30', plannedStartOfShift2: '', plannedEndOfShift2: '', plannedBreakOfShift2: '' },
];

const planTextsNextWeek = [
  { date: nextWeekDates[0], text: '07:30-15:30', firstShift: '07:30 - 15:30 / 00:00', plannedHours: '8:00', flexBalanceToDate: 'swap_vert33:27', calculatedHours: '8', plannedStartOfShift1: '07:30', plannedEndOfShift1: '15:30', plannedBreakOfShift1: '00:00', plannedStartOfShift2: '00:00', plannedEndOfShift2: '00:00', plannedBreakOfShift2: '00:00' },
  { date: nextWeekDates[1], text: '7:45-16:00/1', firstShift: '07:45 - 16:00 / 01:00', plannedHours: '8:00', flexBalanceToDate: 'swap_vert25:27', calculatedHours: '7.25', plannedStartOfShift1: '07:45', plannedEndOfShift1: '16:00', plannedBreakOfShift1: '01:00', plannedStartOfShift2: '00:00', plannedEndOfShift2: '00:00', plannedBreakOfShift2: '00:00' },
  { date: nextWeekDates[2], text: '7:15-16:00/1;17-20/0,5', firstShift: '07:15 - 16:00 / 01:00', secondShift: '17:00 - 20:00 / 00:30', plannedHours: '8:00', flexBalanceToDate: 'swap_vert17:27', calculatedHours: '10.25', plannedStartOfShift1: '07:15', plannedEndOfShift1: '16:00', plannedBreakOfShift1: '01:00', plannedStartOfShift2: '17:00', plannedEndOfShift2: '20:00', plannedBreakOfShift2: '00:30' },
  { date: nextWeekDates[3], text: '6-12/½;18:00-20:00/0.5', firstShift: '06:00 - 12:00 / 00:30', secondShift: '18:00 - 20:00 / 00:30', plannedHours: '8:00', flexBalanceToDate: 'swap_vert9:27', calculatedHours: '7', plannedStartOfShift1: '06:00', plannedEndOfShift1: '12:00', plannedBreakOfShift1: '00:30', plannedStartOfShift2: '18:00', plannedEndOfShift2: '20:00', plannedBreakOfShift2: '00:30' },
  { date: nextWeekDates[4], text: '06:00-12:00/¾;18:00-20:00/0.5', firstShift: '06:00 - 12:00 / 00:45', secondShift: '18:00 - 20:00 / 00:30', plannedHours: '8:00', flexBalanceToDate: 'swap_vert1:27', calculatedHours: '7', plannedStartOfShift1: '06:00', plannedEndOfShift1: '12:00', plannedBreakOfShift1: '00:45', plannedStartOfShift2: '18:00', plannedEndOfShift2: '20:00', plannedBreakOfShift2: '00:30' },
  { date: nextWeekDates[5], text: '6-12/¾;18-20/¾', firstShift: '06:00 - 12:00 / 00:45', secondShift: '18:00 - 20:00 / 00:45', plannedHours: '8:00', flexBalanceToDate: 'swap_vert-6:33', calculatedHours: '6.5', plannedStartOfShift1: '06:00', plannedEndOfShift1: '12:00', plannedBreakOfShift1: '00:45', plannedStartOfShift2: '18:00', plannedEndOfShift2: '20:00', plannedBreakOfShift2: '00:45' },
  { date: lastWeekDates[6], text: '6-14/½', firstShift: '06:00 - 14:00 / 00:30', plannedHours: '8:00', flexBalanceToDate: 'swap_vert-14:33', calculatedHours: '7.5', plannedStartOfShift1: '06:00', plannedEndOfShift1: '14:00', plannedBreakOfShift1: '00:30', plannedStartOfShift2: '00:00', plannedEndOfShift2: '00:00', plannedBreakOfShift2: '00:00' },
];

const updatePlanTextsNextWeek = [
  { date: nextWeekDates[0], text: '07:30-15:30', firstShift: '07:30 - 15:30 / 00:00', plannedHours: '8:00', flexBalanceToDate: 'swap_vert33:27', calculatedHours: '8', plannedStartOfShift1: '07:30', plannedEndOfShift1: '15:30', plannedBreakOfShift1: '00:00', plannedStartOfShift2: '00:00', plannedEndOfShift2: '00:00', plannedBreakOfShift2: '00:00' },
  { date: nextWeekDates[1], text: '7:45-16:00/1', firstShift: '07:45 - 16:00 / 01:00', plannedHours: '8:00', flexBalanceToDate: 'swap_vert25:27', calculatedHours: '7.25', plannedStartOfShift1: '07:45', plannedEndOfShift1: '16:00', plannedBreakOfShift1: '01:00', plannedStartOfShift2: '00:00', plannedEndOfShift2: '00:00', plannedBreakOfShift2: '00:00' },
  { date: nextWeekDates[2], text: '7:15-16:00/1;17-20/0,5', firstShift: '07:15 - 16:00 / 01:00', secondShift: '17:00 - 20:00 / 00:30', plannedHours: '8:00', flexBalanceToDate: 'swap_vert17:27', calculatedHours: '10.25', plannedStartOfShift1: '07:15', plannedEndOfShift1: '16:00', plannedBreakOfShift1: '01:00', plannedStartOfShift2: '17:00', plannedEndOfShift2: '20:00', plannedBreakOfShift2: '00:30' },
  { date: nextWeekDates[3], text: '6-12/½;18:00-20:00/0.5', firstShift: '06:00 - 12:00 / 00:30', secondShift: '18:00 - 20:00 / 00:30', plannedHours: '8:00', flexBalanceToDate: 'swap_vert9:27', calculatedHours: '7', plannedStartOfShift1: '06:00', plannedEndOfShift1: '12:00', plannedBreakOfShift1: '00:30', plannedStartOfShift2: '18:00', plannedEndOfShift2: '20:00', plannedBreakOfShift2: '00:30' },
  { date: nextWeekDates[4], text: '06:00-12:00/¾;18:00-20:00/0.5', firstShift: '06:00 - 12:00 / 00:45', secondShift: '18:00 - 20:00 / 00:30', plannedHours: '8:00', flexBalanceToDate: 'swap_vert1:27', calculatedHours: '7', plannedStartOfShift1: '06:00', plannedEndOfShift1: '12:00', plannedBreakOfShift1: '00:45', plannedStartOfShift2: '18:00', plannedEndOfShift2: '20:00', plannedBreakOfShift2: '00:30' },
  { date: nextWeekDates[5], text: '6-12/¾;18-20/¾', firstShift: '06:00 - 12:00 / 00:45', secondShift: '18:00 - 20:00 / 00:45', plannedHours: '8:00', flexBalanceToDate: 'swap_vert-6:33', calculatedHours: '6.5', plannedStartOfShift1: '06:00', plannedEndOfShift1: '12:00', plannedBreakOfShift1: '00:45', plannedStartOfShift2: '18:00', plannedEndOfShift2: '20:00', plannedBreakOfShift2: '00:45' },
  { date: lastWeekDates[6], text: '6-14/½', firstShift: '06:00 - 14:00 / 00:30', plannedHours: '8:00', flexBalanceToDate: 'swap_vert-14:33', calculatedHours: '7.5', plannedStartOfShift1: '06:00', plannedEndOfShift1: '14:00', plannedBreakOfShift1: '00:30', plannedStartOfShift2: '00:00', plannedEndOfShift2: '00:00', plannedBreakOfShift2: '00:00' },
];

const planTextsFutureWeek = [
  { date: futureWeekDates[0], text: '07:30-15:30;foobar', firstShift: '07:30 - 15:30 / 00:00', plannedHours: '8:00', flexBalanceToDate: 'swap_vert-22:33', calculatedHours: '8', plannedStartOfShift1: '07:30', plannedEndOfShift1: '15:30', plannedBreakOfShift1: '00:00', plannedStartOfShift2: '00:00', plannedEndOfShift2: '00:00', plannedBreakOfShift2: '00:00' },
  { date: futureWeekDates[1], text: '7:45-16/0.75', firstShift: '07:45 - 16:00 / 00:45', plannedHours: '8:00', flexBalanceToDate: 'swap_vert-30:33', calculatedHours: '7.5', plannedStartOfShift1: '07:45', plannedEndOfShift1: '16:00', plannedBreakOfShift1: '00:45', plannedStartOfShift2: '00:00', plannedEndOfShift2: '00:00', plannedBreakOfShift2: '00:00' },
  { date: futureWeekDates[2], text: 'foo bar', plannedHours: '16:00', flexBalanceToDate: 'swap_vert-46:33', calculatedHours: '16', plannedStartOfShift1: '00:00', plannedEndOfShift1: '00:00', plannedBreakOfShift1: '00:00', plannedStartOfShift2: '00:00', plannedEndOfShift2: '00:00', plannedBreakOfShift2: '00:00' },
  { date: futureWeekDates[3], text: '6-12;18:00-20:00', firstShift: '06:00 - 12:00 / 00:00', secondShift: '18:00 - 20:00 / 00:00', plannedHours: '8:00', flexBalanceToDate: 'swap_vert-54:33', calculatedHours: '8', plannedStartOfShift1: '06:00', plannedEndOfShift1: '12:00', plannedBreakOfShift1: '00:00', plannedStartOfShift2: '18:00', plannedEndOfShift2: '20:00', plannedBreakOfShift2: '00:00' },
  { date: futureWeekDates[4], text: ' ', plannedHours: '8:00', flexBalanceToDate: 'swap_vert-62:33', calculatedHours: '8', plannedStartOfShift1: '00:00', plannedEndOfShift1: '00:00', plannedBreakOfShift1: '00:00', plannedStartOfShift2: '00:00', plannedEndOfShift2: '00:00', plannedBreakOfShift2: '00:00' },
  { date: futureWeekDates[5], text: '6-12/¾;18-20/¾', firstShift: '06:00 - 12:00 / 00:45', secondShift: '18:00 - 20:00 / 00:45', plannedHours: '8:00', flexBalanceToDate: 'swap_vert-70:33', calculatedHours: '6.5', plannedStartOfShift1: '06:00', plannedEndOfShift1: '12:00', plannedBreakOfShift1: '00:45', plannedStartOfShift2: '18:00', plannedEndOfShift2: '20:00', plannedBreakOfShift2: '00:45' },
  { date: futureWeekDates[6], text: '6-14/½', firstShift: '06:00 - 14:00 / 00:30', plannedHours: '8:00', flexBalanceToDate: 'swap_vert-78:33', calculatedHours: '7.5', plannedStartOfShift1: '06:00', plannedEndOfShift1: '14:00', plannedBreakOfShift1: '00:30', plannedStartOfShift2: '00:00', plannedEndOfShift2: '00:00', plannedBreakOfShift2: '00:00' },
];

const updatePlanTextsFutureWeek = [
  { date: futureWeekDates[0], text: '07:30-15:30;foobar', firstShift: '07:30 - 15:30 / 00:00', plannedHours: '8:00', flexBalanceToDate: 'swap_vert-22:33', calculatedHours: '8', plannedStartOfShift1: '07:30', plannedEndOfShift1: '15:30', plannedBreakOfShift1: '00:00', plannedStartOfShift2: '00:00', plannedEndOfShift2: '00:00', plannedBreakOfShift2: '00:00' },
  { date: futureWeekDates[1], text: '7:45-16/0.75', firstShift: '07:45 - 16:00 / 00:45', plannedHours: '8:00', flexBalanceToDate: 'swap_vert-30:33', calculatedHours: '7.5', plannedStartOfShift1: '07:45', plannedEndOfShift1: '16:00', plannedBreakOfShift1: '00:45', plannedStartOfShift2: '00:00', plannedEndOfShift2: '00:00', plannedBreakOfShift2: '00:00' },
  { date: futureWeekDates[2], text: 'foo bar', plannedHours: '', flexBalanceToDate: 'swap_vert-46:33', calculatedHours: '0', plannedStartOfShift1: '00:00', plannedEndOfShift1: '00:00', plannedBreakOfShift1: '00:00', plannedStartOfShift2: '00:00', plannedEndOfShift2: '00:00', plannedBreakOfShift2: '00:00' },
  { date: futureWeekDates[3], text: '6-12;18:00-20:00', firstShift: '06:00 - 12:00 / 00:00', secondShift: '18:00 - 20:00 / 00:00', plannedHours: '8:00', flexBalanceToDate: 'swap_vert-54:33', calculatedHours: '8', plannedStartOfShift1: '06:00', plannedEndOfShift1: '12:00', plannedBreakOfShift1: '00:00', plannedStartOfShift2: '18:00', plannedEndOfShift2: '20:00', plannedBreakOfShift2: '00:00' },
  { date: futureWeekDates[4], text: ' ', plannedHours: '12:00', flexBalanceToDate: 'swap_vert-62:33', calculatedHours: '12', plannedStartOfShift1: '00:00', plannedEndOfShift1: '00:00', plannedBreakOfShift1: '00:00', plannedStartOfShift2: '00:00', plannedEndOfShift2: '00:00', plannedBreakOfShift2: '00:00' },
  { date: futureWeekDates[5], text: '6-12/¾;18-20/¾', firstShift: '06:00 - 12:00 / 00:45', secondShift: '18:00 - 20:00 / 00:45', plannedHours: '8:00', flexBalanceToDate: 'swap_vert-70:33', calculatedHours: '6.5', plannedStartOfShift1: '06:00', plannedEndOfShift1: '12:00', plannedBreakOfShift1: '00:45', plannedStartOfShift2: '18:00', plannedEndOfShift2: '20:00', plannedBreakOfShift2: '00:45' },
  { date: futureWeekDates[6], text: '6-14/½', firstShift: '06:00 - 14:00 / 00:30', plannedHours: '8:00', flexBalanceToDate: 'swap_vert-78:33', calculatedHours: '7.5', plannedStartOfShift1: '06:00', plannedEndOfShift1: '14:00', plannedBreakOfShift1: '00:30', plannedStartOfShift2: '00:00', plannedEndOfShift2: '00:00', plannedBreakOfShift2: '00:00' },
];


describe('Dashboard edit values', () => {
  beforeEach(() => {
    cy.task('log', '[Folder b - Dashboard Edit A] ========== BeforeEach: Setting up test ==========');
    cy.task('log', '[Folder b - Dashboard Edit A] Visiting homepage and logging in');
    cy.visit('http://localhost:4200');
    loginPage.login();
    cy.task('log', '[Folder b - Dashboard Edit A] Login completed');
  });

  it('should edit time registration in last week', () => {
    cy.task('log', '[Folder b - Dashboard Edit A] ========== Test: Edit time registration in last week ==========');
    cy.task('log', '[Folder b - Dashboard Edit A] Clicking Timeregistrering menu');
    cy.get('mat-nested-tree-node').contains('Timeregistrering').click();
    cy.task('log', '[Folder b - Dashboard Edit A] Setting up intercept for index-update');
    cy.intercept('POST', '**/api/time-planning-pn/plannings/index').as('index-update');
    cy.task('log', '[Folder b - Dashboard Edit A] Clicking Dashboard menu');
    cy.get('mat-tree-node').contains('Dashboard').click();
    cy.task('log', '[Folder b - Dashboard Edit A] Clicking backwards button');
    cy.get('#backwards').click();
    cy.task('log', '[Folder b - Dashboard Edit A] Waiting for index-update API call (160s timeout)');
    cy.wait('@index-update', { timeout: 160000 });
    // Wait for spinner after index update
    cy.get('body').then(($body) => {
      if ($body.find('.overlay-spinner').length > 0) {
        cy.task('log', '[Folder b - Dashboard Edit A] Spinner detected after index-update, waiting...');
        cy.get('.overlay-spinner', {timeout: 30000}).should('not.be.visible');
      }
    });
    cy.task('log', '[Folder b - Dashboard Edit A] Index updated, verifying plannedHours3 is 53:15');
    cy.get('#plannedHours3').should('include.text', '53:15');
    cy.task('log', '[Folder b - Dashboard Edit A] Starting loop to verify plan texts (7 days)');
    for (let i = 0; i < updatePlanTexts.length; i++) {
      cy.task('log', `[Folder b - Dashboard Edit A] Verifying day ${i}: date=${updatePlanTexts[i].date}`);
      // let plannedHoursId = `#plannedHours3_${i}`;
      // if (updatePlanTexts[i].plannedHours !== '') {
      //   cy.get(plannedHoursId).should('include.text', updatePlanTexts[i].plannedHours);
      // }
      let flexBalanceToDateId = `#flexBalanceToDate3_${i}`;
      if (updatePlanTexts[i].flexBalanceToDate !== '') {
        cy.task('log', `[Folder b - Dashboard Edit A] Verifying flexBalanceToDate: ${updatePlanTexts[i].flexBalanceToDate}`);
        cy.get(flexBalanceToDateId).should('include.text', updatePlanTexts[i].flexBalanceToDate);
      }

      let cellId = `#cell3_${i}`;
      cy.task('log', `[Folder b - Dashboard Edit A] Clicking cell3_${i}`);
      cy.get(cellId).scrollIntoView();
      cy.get(cellId).click();
      cy.get('#planHours').scrollIntoView().should('be.visible');
      cy.task('log', `[Folder b - Dashboard Edit A] Verifying plan values: planHours=${updatePlanTexts[i].calculatedHours}, flex=${updatePlanTexts[i].flexToDate}`);
      cy.get('#planHours').should('have.value', updatePlanTexts[i].calculatedHours);
      cy.get('[data-testid="plannedStartOfShift1"]').should('have.value', updatePlanTexts[i].plannedStartOfShift1);
      cy.get('[data-testid="plannedBreakOfShift1"]').should('have.value', updatePlanTexts[i].plannedBreakOfShift1);
      cy.get('[data-testid="plannedEndOfShift1"]').should('have.value', updatePlanTexts[i].plannedEndOfShift1);
      cy.get('[data-testid="plannedStartOfShift2"]').should('have.value', updatePlanTexts[i].plannedStartOfShift2);
      cy.get('[data-testid="plannedBreakOfShift2"]').should('have.value', updatePlanTexts[i].plannedBreakOfShift2);
      cy.get('[data-testid="plannedEndOfShift2"]').should('have.value', updatePlanTexts[i].plannedEndOfShift2);
      cy.get('#flexToDate').should('have.value', updatePlanTexts[i].flexToDate);
      cy.get('#flexIncludingToday').should('have.value', updatePlanTexts[i].flexIncludingToday);
      cy.get('#nettoHours').should('have.value', updatePlanTexts[i].nettoHours);
      cy.get('#todaysFlex').should('have.value', updatePlanTexts[i].todaysFlex);
      cy.get('#paidOutFlex').should('have.value', updatePlanTexts[i].paidOutFlex);
      cy.task('log', '[Folder b - Dashboard Edit A] Clicking cancel button');
      cy.get('#cancelButton').click();
    }

    cy.task('log', '[Folder b - Dashboard Edit A] Starting loop to update planned shifts (7 days)');
    for (let i = 0; i < secondUpdatePlanTexts.length; i++) {
      cy.task('log', `[Folder b - Dashboard Edit A] Processing day ${i}: date=${secondUpdatePlanTexts[i].date}`);

      let cellId = `#cell3_${i}`;
      cy.task('log', `[Folder b - Dashboard Edit A] Clicking cell3_${i} to open dialog`);
      cy.get(cellId).scrollIntoView();
      cy.get(cellId).click();
      cy.get('#planHours').scrollIntoView().should('be.visible');
      cy.task('log', `[Folder b - Dashboard Edit A] Setting shift times: start1=${secondUpdatePlanTexts[i].plannedStartOfShift1}, end1=${secondUpdatePlanTexts[i].plannedEndOfShift1}`);
      cy.get('[data-testid="plannedStartOfShift1"]').click();
      // eslint-disable-next-line max-len
      let degrees0 = 360 / 12 * parseInt(secondUpdatePlanTexts[i].plannedStartOfShift1.split(':')[0]);
      let minuteDegrees0 = 360 / 60 * parseInt(secondUpdatePlanTexts[i].plannedStartOfShift1.split(':')[1]);
      cy.get('[style="transform: rotateZ(' + degrees0 + 'deg) translateX(-50%);"] > span').click();
      if (minuteDegrees0 > 0) {
        // cy.wait(1000);
        cy.get('[style="transform: rotateZ(' + minuteDegrees0 + 'deg) translateX(-50%);"] > span').click({force: true});
      }
      cy.get('.timepicker-button span').contains('Ok').click();
      cy.get('[data-testid="plannedStartOfShift1"]').should('have.value', secondUpdatePlanTexts[i].plannedStartOfShift1);


      cy.get('[data-testid="plannedEndOfShift1"]').click();
      // eslint-disable-next-line max-len
      let degrees1 = 360 / 12 * parseInt(secondUpdatePlanTexts[i].plannedEndOfShift1.split(':')[0]);
      let minuteDegrees1 = 360 / 60 * parseInt(secondUpdatePlanTexts[i].plannedEndOfShift1.split(':')[1]);
      if (degrees1 > 360) {
        cy.get('[style="height: 85px; transform: rotateZ(' + degrees1 + 'deg) translateX(-50%);"] > span').click();
      } else {
        cy.get('[style="transform: rotateZ(' + degrees1 + 'deg) translateX(-50%);"] > span').click();
      }
      if (minuteDegrees1 > 0) {
        // cy.wait(1000);
        cy.get('[style="transform: rotateZ(' + minuteDegrees1 + 'deg) translateX(-50%);"] > span').click({force: true});
      }
      cy.get('.timepicker-button span').contains('Ok').click();
      cy.get('[data-testid="plannedEndOfShift1"]').should('have.value', secondUpdatePlanTexts[i].plannedEndOfShift1);

      if (secondUpdatePlanTexts[i].plannedBreakOfShift1 !== '00:00' || secondUpdatePlanTexts[i].plannedBreakOfShift1 !== '') {
        cy.get('[data-testid="plannedBreakOfShift1"]').click();
        // eslint-disable-next-line max-len
        let degrees2 = 360 / 12 * parseInt(secondUpdatePlanTexts[i].plannedBreakOfShift1.split(':')[0]);
        let minuteDegrees2 = 360 / 60 * parseInt(secondUpdatePlanTexts[i].plannedBreakOfShift1.split(':')[1]);
        if (degrees2 > 360) {
          cy.get('[style="height: 85px; transform: rotateZ(' + degrees2 + 'deg) translateX(-50%);"] > span').click();
        } else {
          if (!degrees2 || isNaN(degrees2) || degrees2 === 0) {
            cy.get('[style="height: 85px; transform: rotateZ(720deg) translateX(-50%);"] > span').click();
          } else {
            cy.get('[style="transform: rotateZ(' + degrees2 + 'deg) translateX(-50%);"] > span').click();
          }
        }
        if (minuteDegrees2 > 0) {
          // cy.wait(1000);
          cy.get('[style="transform: rotateZ(' + minuteDegrees2 + 'deg) translateX(-50%);"] > span').click({force: true});
        }
        cy.get('.timepicker-button span').contains('Ok').click();
      }
      cy.get('[data-testid="plannedBreakOfShift1"]').should('have.value', secondUpdatePlanTexts[i].plannedBreakOfShift1);

      if (secondUpdatePlanTexts[i].plannedStartOfShift2 !== '') {
        cy.get('[data-testid="plannedStartOfShift2"]').click();
        // eslint-disable-next-line max-len
        let degrees3 = 360 / 12 * parseInt(secondUpdatePlanTexts[i].plannedStartOfShift2.split(':')[0]);
        let minuteDegrees3 = 360 / 60 * parseInt(secondUpdatePlanTexts[i].plannedStartOfShift2.split(':')[1]);
        if (degrees3 > 360) {
          cy.get('[style="height: 85px; transform: rotateZ(' + degrees3 + 'deg) translateX(-50%);"] > span').click();
        } else {
          cy.get('[style="transform: rotateZ(' + degrees3 + 'deg) translateX(-50%);"] > span').click();
        }
        if (minuteDegrees3 > 0) {
          // cy.wait(1000);
          cy.get('[style="transform: rotateZ(' + minuteDegrees3 + 'deg) translateX(-50%);"] > span').click({force: true});
        }
        cy.get('.timepicker-button span').contains('Ok').click();

        cy.get('[data-testid="plannedStartOfShift2"]').should('have.value', secondUpdatePlanTexts[i].plannedStartOfShift2);

        cy.get('[data-testid="plannedEndOfShift2"]').click();
        // eslint-disable-next-line max-len
        let degrees4 = 360 / 12 * parseInt(secondUpdatePlanTexts[i].plannedEndOfShift2.split(':')[0]);
        let minuteDegrees4 = 360 / 60 * parseInt(secondUpdatePlanTexts[i].plannedEndOfShift2.split(':')[1]);
        if (degrees4 > 360) {
          cy.get('[style="height: 85px; transform: rotateZ(' + degrees4 + 'deg) translateX(-50%);"] > span').click();
        } else {
          cy.get('[style="transform: rotateZ(' + degrees4 + 'deg) translateX(-50%);"] > span').click();
        }
        if (minuteDegrees4 > 0) {
          // cy.wait(1000);
          cy.get('[style="transform: rotateZ(' + minuteDegrees4 + 'deg) translateX(-50%);"] > span').click({force: true});
        }
        cy.get('.timepicker-button span').contains('Ok').click();

        cy.get('[data-testid="plannedEndOfShift2"]').should('have.value', secondUpdatePlanTexts[i].plannedEndOfShift2);

        cy.get('[data-testid="plannedBreakOfShift2"]').click();
        // eslint-disable-next-line max-len
        let degrees5 = 360 / 12 * parseInt(secondUpdatePlanTexts[i].plannedBreakOfShift2.split(':')[0]);
        let minuteDegrees5 = 360 / 60 * parseInt(secondUpdatePlanTexts[i].plannedBreakOfShift2.split(':')[1]);
        if (degrees5 > 360) {
          cy.get('[style="height: 85px; transform: rotateZ(' + degrees5 + 'deg) translateX(-50%);"] > span').click();
        } else {
          if (!degrees5 || isNaN(degrees5) || degrees5 === 0) {
            cy.get('[style="height: 85px; transform: rotateZ(720deg) translateX(-50%);"] > span').click();
          } else {
            cy.get('[style="transform: rotateZ(' + degrees5 + 'deg) translateX(-50%);"] > span').click();
          }
        }
        if (minuteDegrees5 > 0) {
          // cy.wait(1000);
          cy.get('[style="transform: rotateZ(' + minuteDegrees5 + 'deg) translateX(-50%);"] > span').click({force: true});
        }
        cy.get('.timepicker-button span').contains('Ok').click();

        cy.get('[data-testid="plannedBreakOfShift2"]').should('have.value', secondUpdatePlanTexts[i].plannedBreakOfShift2);
      }


      cy.task('log', `[Folder b - Dashboard Edit A] Verifying calculated values: flex=${secondUpdatePlanTexts[i].flexToDate}, hours=${secondUpdatePlanTexts[i].calculatedHours}`);
      cy.get('#flexToDate').should('have.value', secondUpdatePlanTexts[i].flexToDate);
      cy.get('#flexIncludingToday').should('have.value', secondUpdatePlanTexts[i].flexIncludingToday);
      cy.get('#nettoHours').should('have.value', secondUpdatePlanTexts[i].nettoHours);
      cy.get('#todaysFlex').should('have.value', secondUpdatePlanTexts[i].todaysFlex);
      cy.get('#paidOutFlex').should('have.value', secondUpdatePlanTexts[i].paidOutFlex);

      cy.get('#planHours').should('have.value', secondUpdatePlanTexts[i].calculatedHours);
      cy.task('log', '[Folder b - Dashboard Edit A] Setting up intercept for update-day');
      cy.intercept('PUT', '**/api/time-planning-pn/plannings/*').as('update-day');
      cy.task('log', '[Folder b - Dashboard Edit A] Clicking Save button');
      cy.get('#saveButton').click();
      cy.task('log', '[Folder b - Dashboard Edit A] Waiting for update-day API call (160s timeout)');
      cy.wait('@update-day', { timeout: 160000 });
      cy.task('log', '[Folder b - Dashboard Edit A] Waiting for index-update API call (160s timeout)');
      cy.wait('@index-update', { timeout: 160000 });
      // Wait for spinner after index update
      cy.get('body').then(($body) => {
        if ($body.find('.overlay-spinner').length > 0) {
          cy.task('log', '[Folder b - Dashboard Edit A] Spinner detected after index-update, waiting...');
          cy.get('.overlay-spinner', {timeout: 30000}).should('not.be.visible');
        }
      });
      cy.wait(1000);
      cy.task('log', `[Folder b - Dashboard Edit A] Verifying updated values displayed in dashboard`);
      let flexBalanceToDateId = `#flexBalanceToDate3_${i}`;
      if (secondUpdatePlanTexts[i].flexBalanceToDate !== '') {
        cy.get(flexBalanceToDateId).should('include.text', secondUpdatePlanTexts[i].flexBalanceToDate);
      }
      let firstShiftId = `#firstShift3_${i}`;
      cy.get(firstShiftId).should('include.text', secondUpdatePlanTexts[i].firstShift);
      if (secondUpdatePlanTexts[i].secondShift) {
        let secondShiftId = `#secondShift3_${i}`;
        cy.get(secondShiftId).should('include.text', secondUpdatePlanTexts[i].secondShift);
      }
    }

    cy.task('log', '[Folder b - Dashboard Edit A] Verifying final plannedHours3 is 52:55');
    cy.get('#plannedHours3').should('include.text', '52:55');
    cy.task('log', '[Folder b - Dashboard Edit A] Test completed successfully');
  });
});
