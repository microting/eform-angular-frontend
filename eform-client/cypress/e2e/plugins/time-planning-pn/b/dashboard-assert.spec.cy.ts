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

const updatePlanHours = [
  { date: lastWeekDates[0], hours: 1, sumFlex: 96.45, nettoHours: 0, flex: -1, humanFlex: '96:27'},
  { date: lastWeekDates[1], hours: 2, sumFlex: 94.45, nettoHours: 0, flex: -2, humanFlex: '94:27'},
  { date: lastWeekDates[2], hours: 3, sumFlex: 91.45, nettoHours: 0, flex: -3, humanFlex: '91:27'},
  { date: lastWeekDates[3], hours: 0, sumFlex: 91.45, nettoHours: 0, flex: 0, humanFlex: '91:27'},
  { date: lastWeekDates[4], hours: 4, sumFlex: 87.45, nettoHours: 0, flex: -4, humanFlex: '87:27'},
  { date: lastWeekDates[5], hours: 5, sumFlex: 82.45, nettoHours: 0, flex: -5, humanFlex: '82:27'},
  { date: lastWeekDates[6], hours: 6, sumFlex: 76.45, nettoHours: 0, flex: -6, humanFlex: '76:27'},
]

const planHoursNextWeek = [
  { date: nextWeekDates[0], hours: 8, sumFlex: 33.45, nettoHours: 0, flex: -8, humanFlex: '33:27'},
  { date: nextWeekDates[1], hours: 8, sumFlex: 25.45, nettoHours: 0, flex: -8, humanFlex: '25:27'},
  { date: nextWeekDates[2], hours: 8, sumFlex: 17.45, nettoHours: 0, flex: -8, humanFlex: '17:27'},
  { date: nextWeekDates[3], hours: 8, sumFlex: 9.45, nettoHours: 0, flex: -8, humanFlex: '9:27'},
  { date: nextWeekDates[4], hours: 8, sumFlex: 1.45, nettoHours: 0, flex: -8, humanFlex: '1:27'},
  { date: nextWeekDates[5], hours: 8, sumFlex: -6.55, nettoHours: 0, flex: -8, humanFlex: '-6:33'},
  { date: nextWeekDates[6], hours: 8, sumFlex: -14.55, nettoHours: 0, flex: -8, humanFlex: '-14:33'},
];

const updatePlanHoursNextWeek = [
  { date: nextWeekDates[0], hours: 8, sumFlex: 36.2, nettoHours: 0, flex: -8, humanFlex: '68:27'},
  { date: nextWeekDates[1], hours: 8, sumFlex: 28.2, nettoHours: 0, flex: -8, humanFlex: '60:27'},
  { date: nextWeekDates[2], hours: 0, sumFlex: 28.2, nettoHours: 0, flex: 0, humanFlex: '60:27'},
  { date: nextWeekDates[3], hours: 0, sumFlex: 28.2, nettoHours: 0, flex: 0, humanFlex: '60:27'},
  { date: nextWeekDates[4], hours: 0, sumFlex: 28.2, nettoHours: 0, flex: 0, humanFlex: '60:27'},
  { date: nextWeekDates[5], hours: 8, sumFlex: 20.2, nettoHours: 0, flex: -8, humanFlex: '52:27'},
  { date: nextWeekDates[6], hours: 8, sumFlex: 12.2, nettoHours: 0, flex: -8, humanFlex: '44:27'},
]

const planHoursFutureWeek = [
  { date: futureWeekDates[0], hours: 8, sumFlex: -22.55, nettoHours: 0, flex: -8, humanFlex: '-22:33'},
  { date: futureWeekDates[1], hours: 8, sumFlex: -30.55, nettoHours: 0, flex: -8, humanFlex: '-30:33'},
  { date: futureWeekDates[2], hours: 16, sumFlex: -46.55, nettoHours: 0, flex: -16, humanFlex: '-46:33'},
  { date: futureWeekDates[3], hours: 8, sumFlex: -54.55, nettoHours: 0, flex: -8, humanFlex: '-54:33'},
  { date: futureWeekDates[4], hours: 8, sumFlex: -62.55, nettoHours: 0, flex: -8, humanFlex: '-64:33'},
  { date: futureWeekDates[5], hours: 8, sumFlex: -70.55, nettoHours: 0, flex: -8, humanFlex: '-70:33'},
  { date: futureWeekDates[6], hours: 8, sumFlex: -78.55, nettoHours: 0, flex: -8, humanFlex:'-78.33'},
];

const updatePlanHoursFutureWeek = [
  { date: futureWeekDates[0], hours: 2, sumFlex: -11.05, nettoHours: 0, flex: -2, humanFlex: '42:27'},
  { date: futureWeekDates[1], hours: 4, sumFlex: -15.05, nettoHours: 0, flex: -4, humanFlex: '38:27'},
  { date: futureWeekDates[2], hours: 0, sumFlex: -15.05, nettoHours: 0, flex: 0, humanFlex: '38:27'},
  { date: futureWeekDates[3], hours: 10, sumFlex: -25.05, nettoHours: 0, flex: -10, humanFlex: '28:27'},
  { date: futureWeekDates[4], hours: 12, sumFlex: -37.05, nettoHours: 0, flex: -12, humanFlex: '16:27'},
  { date: futureWeekDates[5], hours: 3, sumFlex: -40.05, nettoHours: 0, flex: -3, humanFlex: '13:27'},
  { date: futureWeekDates[6], hours: 8, sumFlex: -48.05, nettoHours: 0, flex: -8, humanFlex:' 5:27'},
]

const planTexts = [
  { date: lastWeekDates[0], text: '07:30-15:30', plannedHours: '8:00', flexBalanceToDate: 'swap_vert89.45', calculatedHours: '8', plannedStartOfShift1: '07:30', plannedEndOfShift1: '15:30', plannedBreakOfShift1: '', plannedStartOfShift2: '', plannedEndOfShift2: '', plannedBreakOfShift2: '' },
  { date: lastWeekDates[1], text: '7:45-16:00/1', plannedHours: '8:00', flexBalanceToDate: 'swap_vert82.20', calculatedHours: '7.25', plannedStartOfShift1: '07:45', plannedEndOfShift1: '16:00', plannedBreakOfShift1: '01:00', plannedStartOfShift2: '', plannedEndOfShift2: '', plannedBreakOfShift2: '' },
  { date: lastWeekDates[2], text: '7:15-16:00/1;17-20/0,5', plannedHours: '8:00', flexBalanceToDate: 'swap_vert71.95', calculatedHours: '10.25', plannedStartOfShift1: '07:15', plannedEndOfShift1: '16:00', plannedBreakOfShift1: '01:00', plannedStartOfShift2: '17:00', plannedEndOfShift2: '20:00', plannedBreakOfShift2: '00:30' },
  { date: lastWeekDates[3], text: '6-12/½;18:00-20:00/0.5', plannedHours: '8:00', flexBalanceToDate: 'swap_vert64.95', calculatedHours: '7', plannedStartOfShift1: '06:00', plannedEndOfShift1: '12:00', plannedBreakOfShift1: '00:30', plannedStartOfShift2: '18:00', plannedEndOfShift2: '20:00', plannedBreakOfShift2: '00:30' },
  { date: lastWeekDates[4], text: '06:00-12:00/¾;18:00-20:00/0.5', plannedHours: '8:00', flexBalanceToDate: 'swap_vert58.20', calculatedHours: '6.75', plannedStartOfShift1: '06:00', plannedEndOfShift1: '12:00', plannedBreakOfShift1: '00:45', plannedStartOfShift2: '18:00', plannedEndOfShift2: '20:00', plannedBreakOfShift2: '00:30' },
  { date: lastWeekDates[5], text: '6-12/¾;18-20/¾', plannedHours: '8:00', flexBalanceToDate: 'swap_vert51.70', calculatedHours: '6.5', plannedStartOfShift1: '06:00', plannedEndOfShift1: '12:00', plannedBreakOfShift1: '00:45', plannedStartOfShift2: '18:00', plannedEndOfShift2: '20:00', plannedBreakOfShift2: '00:45' },
  { date: lastWeekDates[6], text: '6-14/½', plannedHours: '8:00', flexBalanceToDate: 'swap_vert44.20', calculatedHours: '7.5', plannedStartOfShift1: '06:00', plannedEndOfShift1: '14:00', plannedBreakOfShift1: '00:30', plannedStartOfShift2: '', plannedEndOfShift2: '', plannedBreakOfShift2: '' },
];

const updatePlanTexts = [
  { date: lastWeekDates[0], text: '07:30-15:30', plannedHours: '1', flexBalanceToDate: 'swap_vert89.45', calculatedHours: '8', plannedStartOfShift1: '07:30', plannedEndOfShift1: '15:30', plannedBreakOfShift1: '', plannedStartOfShift2: '', plannedEndOfShift2: '', plannedBreakOfShift2: '' },
  { date: lastWeekDates[1], text: '7:45-16:00/1', plannedHours: '2', flexBalanceToDate: 'swap_vert82.20', calculatedHours: '7.25', plannedStartOfShift1: '07:45', plannedEndOfShift1: '16:00', plannedBreakOfShift1: '01:00', plannedStartOfShift2: '', plannedEndOfShift2: '', plannedBreakOfShift2: '' },
  { date: lastWeekDates[2], text: '7:15-16:00/1;17-20/0,5', plannedHours: '3', flexBalanceToDate: 'swap_vert71.95', calculatedHours: '10.25', plannedStartOfShift1: '07:15', plannedEndOfShift1: '16:00', plannedBreakOfShift1: '01:00', plannedStartOfShift2: '17:00', plannedEndOfShift2: '20:00', plannedBreakOfShift2: '00:30' },
  { date: lastWeekDates[3], text: '6-12/½;18:00-20:00/0.5', plannedHours: '4', flexBalanceToDate: 'swap_vert64.95', calculatedHours: '7', plannedStartOfShift1: '06:00', plannedEndOfShift1: '12:00', plannedBreakOfShift1: '00:30', plannedStartOfShift2: '18:00', plannedEndOfShift2: '20:00', plannedBreakOfShift2: '00:30' },
  { date: lastWeekDates[4], text: '06:00-12:00/¾;18:00-20:00/0.5', plannedHours: '5', flexBalanceToDate: 'swap_vert58.20', calculatedHours: '6.75', plannedStartOfShift1: '06:00', plannedEndOfShift1: '12:00', plannedBreakOfShift1: '00:45', plannedStartOfShift2: '18:00', plannedEndOfShift2: '20:00', plannedBreakOfShift2: '00:30' },
  { date: lastWeekDates[5], text: '6-12/¾;18-20/¾', plannedHours: '6', flexBalanceToDate: 'swap_vert51.70', calculatedHours: '6.5', plannedStartOfShift1: '06:00', plannedEndOfShift1: '12:00', plannedBreakOfShift1: '00:45', plannedStartOfShift2: '18:00', plannedEndOfShift2: '20:00', plannedBreakOfShift2: '00:45' },
  { date: lastWeekDates[6], text: '6-14/½', plannedHours: '7', flexBalanceToDate: 'swap_vert44.20', calculatedHours: '7.5', plannedStartOfShift1: '06:00', plannedEndOfShift1: '14:00', plannedBreakOfShift1: '00:30', plannedStartOfShift2: '', plannedEndOfShift2: '', plannedBreakOfShift2: '' },
];

const planTextsNextWeek = [
  { date: nextWeekDates[0], text: '07:30-15:30', firstShift: '07:30 - 15:30 / 00:00', plannedHours: '8:00', flexBalanceToDate: 'swap_vert33:27', calculatedHours: '8', plannedStartOfShift1: '07:30', plannedEndOfShift1: '15:30', plannedBreakOfShift1: '', plannedStartOfShift2: '', plannedEndOfShift2: '', plannedBreakOfShift2: '' },
  { date: nextWeekDates[1], text: '7:45-16:00/1', firstShift: '07:45 - 16:00 / 01:00', plannedHours: '8:00', flexBalanceToDate: 'swap_vert25:27', calculatedHours: '7.25', plannedStartOfShift1: '07:45', plannedEndOfShift1: '16:00', plannedBreakOfShift1: '01:00', plannedStartOfShift2: '', plannedEndOfShift2: '', plannedBreakOfShift2: '' },
  { date: nextWeekDates[2], text: '7:15-16:00/1;17-20/0,5', firstShift: '07:15 - 16:00 / 01:00', secondShift: '17:00 - 20:00 / 00:30', plannedHours: '8:00', flexBalanceToDate: 'swap_vert17:27', calculatedHours: '10.25', plannedStartOfShift1: '07:15', plannedEndOfShift1: '16:00', plannedBreakOfShift1: '01:00', plannedStartOfShift2: '17:00', plannedEndOfShift2: '20:00', plannedBreakOfShift2: '00:30' },
  { date: nextWeekDates[3], text: '6-12/½;18:00-20:00/0.5', firstShift: '06:00 - 12:00 / 00:30', secondShift: '18:00 - 20:00 / 00:30', plannedHours: '8:00', flexBalanceToDate: 'swap_vert9:27', calculatedHours: '7', plannedStartOfShift1: '06:00', plannedEndOfShift1: '12:00', plannedBreakOfShift1: '00:30', plannedStartOfShift2: '18:00', plannedEndOfShift2: '20:00', plannedBreakOfShift2: '00:30' },
  { date: nextWeekDates[4], text: '06:00-12:00/¾;18:00-20:00/0.5', firstShift: '06:00 - 12:00 / 00:45', secondShift: '18:00 - 20:00 / 00:30', plannedHours: '8:00', flexBalanceToDate: 'swap_vert1:27', calculatedHours: '6.75', plannedStartOfShift1: '06:00', plannedEndOfShift1: '12:00', plannedBreakOfShift1: '00:45', plannedStartOfShift2: '18:00', plannedEndOfShift2: '20:00', plannedBreakOfShift2: '00:30' },
  { date: nextWeekDates[5], text: '6-12/¾;18-20/¾', firstShift: '06:00 - 12:00 / 00:45', secondShift: '18:00 - 20:00 / 00:45', plannedHours: '8:00', flexBalanceToDate: 'swap_vert-6:33', calculatedHours: '6.5', plannedStartOfShift1: '06:00', plannedEndOfShift1: '12:00', plannedBreakOfShift1: '00:45', plannedStartOfShift2: '18:00', plannedEndOfShift2: '20:00', plannedBreakOfShift2: '00:45' },
  { date: lastWeekDates[6], text: '6-14/½', firstShift: '06:00 - 14:00 / 00:30', plannedHours: '8:00', flexBalanceToDate: 'swap_vert-14:33', calculatedHours: '7.5', plannedStartOfShift1: '06:00', plannedEndOfShift1: '14:00', plannedBreakOfShift1: '00:30', plannedStartOfShift2: '', plannedEndOfShift2: '', plannedBreakOfShift2: '' },
];

const updatePlanTextsNextWeek = [
  { date: nextWeekDates[0], text: '07:30-15:30', firstShift: '07:30 - 15:30 / 00:00', plannedHours: '8:00', flexBalanceToDate: 'swap_vert33:27', calculatedHours: '8', plannedStartOfShift1: '07:30', plannedEndOfShift1: '15:30', plannedBreakOfShift1: '', plannedStartOfShift2: '', plannedEndOfShift2: '', plannedBreakOfShift2: '' },
  { date: nextWeekDates[1], text: '7:45-16:00/1', firstShift: '07:45 - 16:00 / 01:00', plannedHours: '8:00', flexBalanceToDate: 'swap_vert25:27', calculatedHours: '7.25', plannedStartOfShift1: '07:45', plannedEndOfShift1: '16:00', plannedBreakOfShift1: '01:00', plannedStartOfShift2: '', plannedEndOfShift2: '', plannedBreakOfShift2: '' },
  { date: nextWeekDates[2], text: '7:15-16:00/1;17-20/0,5', firstShift: '07:15 - 16:00 / 01:00', secondShift: '17:00 - 20:00 / 00:30', plannedHours: '8:00', flexBalanceToDate: 'swap_vert17:27', calculatedHours: '10.25', plannedStartOfShift1: '07:15', plannedEndOfShift1: '16:00', plannedBreakOfShift1: '01:00', plannedStartOfShift2: '17:00', plannedEndOfShift2: '20:00', plannedBreakOfShift2: '00:30' },
  { date: nextWeekDates[3], text: '6-12/½;18:00-20:00/0.5', firstShift: '06:00 - 12:00 / 00:30', secondShift: '18:00 - 20:00 / 00:30', plannedHours: '8:00', flexBalanceToDate: 'swap_vert9:27', calculatedHours: '7', plannedStartOfShift1: '06:00', plannedEndOfShift1: '12:00', plannedBreakOfShift1: '00:30', plannedStartOfShift2: '18:00', plannedEndOfShift2: '20:00', plannedBreakOfShift2: '00:30' },
  { date: nextWeekDates[4], text: '06:00-12:00/¾;18:00-20:00/0.5', firstShift: '06:00 - 12:00 / 00:45', secondShift: '18:00 - 20:00 / 00:30', plannedHours: '8:00', flexBalanceToDate: 'swap_vert1:27', calculatedHours: '7', plannedStartOfShift1: '06:00', plannedEndOfShift1: '12:00', plannedBreakOfShift1: '00:45', plannedStartOfShift2: '18:00', plannedEndOfShift2: '20:00', plannedBreakOfShift2: '00:30' },
  { date: nextWeekDates[5], text: '6-12/¾;18-20/¾', firstShift: '06:00 - 12:00 / 00:45', secondShift: '18:00 - 20:00 / 00:45', plannedHours: '8:00', flexBalanceToDate: 'swap_vert-6:33', calculatedHours: '6.5', plannedStartOfShift1: '06:00', plannedEndOfShift1: '12:00', plannedBreakOfShift1: '00:45', plannedStartOfShift2: '18:00', plannedEndOfShift2: '20:00', plannedBreakOfShift2: '00:45' },
  { date: lastWeekDates[6], text: '6-14/½', firstShift: '06:00 - 14:00 / 00:30', plannedHours: '8:00', flexBalanceToDate: 'swap_vert-14:33', calculatedHours: '7.5', plannedStartOfShift1: '06:00', plannedEndOfShift1: '14:00', plannedBreakOfShift1: '00:30', plannedStartOfShift2: '', plannedEndOfShift2: '', plannedBreakOfShift2: '' },
];

const planTextsFutureWeek = [
  { date: futureWeekDates[0], text: '07:30-15:30;foobar', firstShift: '07:30 - 15:30 / 00:00', plannedHours: '8:00', flexBalanceToDate: 'swap_vert-22:33', calculatedHours: '8', plannedStartOfShift1: '07:30', plannedEndOfShift1: '15:30', plannedBreakOfShift1: '', plannedStartOfShift2: '', plannedEndOfShift2: '', plannedBreakOfShift2: '' },
  { date: futureWeekDates[1], text: '7:45-16/0.75', firstShift: '07:45 - 16:00 / 00:45', plannedHours: '8:00', flexBalanceToDate: 'swap_vert-30:33', calculatedHours: '7.5', plannedStartOfShift1: '07:45', plannedEndOfShift1: '16:00', plannedBreakOfShift1: '00:45', plannedStartOfShift2: '', plannedEndOfShift2: '', plannedBreakOfShift2: '' },
  { date: futureWeekDates[2], text: 'foo bar', plannedHours: '16:00', flexBalanceToDate: 'swap_vert-46:33', calculatedHours: '16', plannedStartOfShift1: '', plannedEndOfShift1: '', plannedBreakOfShift1: '', plannedStartOfShift2: '', plannedEndOfShift2: '', plannedBreakOfShift2: '' },
  { date: futureWeekDates[3], text: '6-12;18:00-20:00', firstShift: '06:00 - 12:00 / 00:00', secondShift: '18:00 - 20:00 / 00:00', plannedHours: '8:00', flexBalanceToDate: 'swap_vert-54:33', calculatedHours: '8', plannedStartOfShift1: '06:00', plannedEndOfShift1: '12:00', plannedBreakOfShift1: '', plannedStartOfShift2: '18:00', plannedEndOfShift2: '20:00', plannedBreakOfShift2: '' },
  { date: futureWeekDates[4], text: ' ', plannedHours: '8:00', flexBalanceToDate: 'swap_vert-62:33', calculatedHours: '8', plannedStartOfShift1: '', plannedEndOfShift1: '', plannedBreakOfShift1: '', plannedStartOfShift2: '', plannedEndOfShift2: '', plannedBreakOfShift2: '' },
  { date: futureWeekDates[5], text: '6-12/¾;18-20/¾', firstShift: '06:00 - 12:00 / 00:45', secondShift: '18:00 - 20:00 / 00:45', plannedHours: '8:00', flexBalanceToDate: 'swap_vert-70:33', calculatedHours: '6.5', plannedStartOfShift1: '06:00', plannedEndOfShift1: '12:00', plannedBreakOfShift1: '00:45', plannedStartOfShift2: '18:00', plannedEndOfShift2: '20:00', plannedBreakOfShift2: '00:45' },
  { date: futureWeekDates[6], text: '6-14/½', firstShift: '06:00 - 14:00 / 00:30', plannedHours: '8:00', flexBalanceToDate: 'swap_vert-78:33', calculatedHours: '7.5', plannedStartOfShift1: '06:00', plannedEndOfShift1: '14:00', plannedBreakOfShift1: '00:30', plannedStartOfShift2: '', plannedEndOfShift2: '', plannedBreakOfShift2: '' },
];

const updatePlanTextsFutureWeek = [
  { date: futureWeekDates[0], text: '07:30-15:30;foobar', firstShift: '07:30 - 15:30 / 00:00', plannedHours: '8:00', flexBalanceToDate: 'swap_vert-22:33', calculatedHours: '8', plannedStartOfShift1: '07:30', plannedEndOfShift1: '15:30', plannedBreakOfShift1: '', plannedStartOfShift2: '', plannedEndOfShift2: '', plannedBreakOfShift2: '' },
  { date: futureWeekDates[1], text: '7:45-16/0.75', firstShift: '07:45 - 16:00 / 00:45', plannedHours: '8:00', flexBalanceToDate: 'swap_vert-30:33', calculatedHours: '7.5', plannedStartOfShift1: '07:45', plannedEndOfShift1: '16:00', plannedBreakOfShift1: '00:45', plannedStartOfShift2: '', plannedEndOfShift2: '', plannedBreakOfShift2: '' },
  { date: futureWeekDates[2], text: 'foo bar', plannedHours: '', flexBalanceToDate: 'swap_vert-46:33', calculatedHours: '0', plannedStartOfShift1: '', plannedEndOfShift1: '', plannedBreakOfShift1: '', plannedStartOfShift2: '', plannedEndOfShift2: '', plannedBreakOfShift2: '' },
  { date: futureWeekDates[3], text: '6-12;18:00-20:00', firstShift: '06:00 - 12:00 / 00:00', secondShift: '18:00 - 20:00 / 00:00', plannedHours: '8:00', flexBalanceToDate: 'swap_vert-54:33', calculatedHours: '8', plannedStartOfShift1: '06:00', plannedEndOfShift1: '12:00', plannedBreakOfShift1: '', plannedStartOfShift2: '18:00', plannedEndOfShift2: '20:00', plannedBreakOfShift2: '' },
  { date: futureWeekDates[4], text: ' ', plannedHours: '12:00', flexBalanceToDate: 'swap_vert-62:33', calculatedHours: '12', plannedStartOfShift1: '', plannedEndOfShift1: '', plannedBreakOfShift1: '', plannedStartOfShift2: '', plannedEndOfShift2: '', plannedBreakOfShift2: '' },
  { date: futureWeekDates[5], text: '6-12/¾;18-20/¾', firstShift: '06:00 - 12:00 / 00:45', secondShift: '18:00 - 20:00 / 00:45', plannedHours: '8:00', flexBalanceToDate: 'swap_vert-70:33', calculatedHours: '6.5', plannedStartOfShift1: '06:00', plannedEndOfShift1: '12:00', plannedBreakOfShift1: '00:45', plannedStartOfShift2: '18:00', plannedEndOfShift2: '20:00', plannedBreakOfShift2: '00:45' },
  { date: futureWeekDates[6], text: '6-14/½', firstShift: '06:00 - 14:00 / 00:30', plannedHours: '8:00', flexBalanceToDate: 'swap_vert-78:33', calculatedHours: '7.5', plannedStartOfShift1: '06:00', plannedEndOfShift1: '14:00', plannedBreakOfShift1: '00:30', plannedStartOfShift2: '', plannedEndOfShift2: '', plannedBreakOfShift2: '' },
];


describe('Dashboard assert', () => {
  beforeEach(() => {
    cy.task('log', '[Folder b - Dashboard Assert] ========== BeforeEach: Setting up test ==========');
    cy.task('log', '[Folder b - Dashboard Assert] Visiting homepage and logging in');
    cy.visit('http://localhost:4200');
    loginPage.login();
    cy.task('log', '[Folder b - Dashboard Assert] Login completed');
  });


  it('should go to dashboard and set to use google sheet as default and check if the settings are correct', () => {
    cy.task('log', '[Folder b - Dashboard Assert] ========== Test: Go to dashboard and set to use google sheet as default ==========');
    cy.task('log', '[Folder b - Dashboard Assert] Clicking Timeregistrering menu');
    cy.get('mat-nested-tree-node').contains('Timeregistrering').click();
    cy.intercept('POST', '**/api/time-planning-pn/plannings/index').as('index-update');
    cy.task('log', '[Folder b - Dashboard Assert] Clicking Dashboard menu');
    cy.get('mat-tree-node').contains('Dashboard').click();
    cy.task('log', '[Folder b - Dashboard Assert] Waiting for index-update API call');
    cy.wait('@index-update', { timeout: 60000 });
    // Wait for spinner after index update
    cy.get('body').then(($body) => {
      if ($body.find('.overlay-spinner').length > 0) {
        cy.task('log', '[Folder b - Dashboard Assert] Spinner detected after index-update, waiting...');
        cy.get('.overlay-spinner', {timeout: 30000}).should('not.be.visible');
      }
    });
    cy.task('log', '[Folder b - Dashboard Assert] Index updated successfully');
    // useGoogleSheetAsDefault is now enabled by default in seed (commit e86d3a1b)
    // so no need to open dialog and toggle it
    cy.task('log', '[Folder b - Dashboard Assert] Clicking Timeregistrering menu again');
    // Wait for spinner before clicking Timeregistrering menu
    cy.get('body').then(($body) => {
      if ($body.find('.overlay-spinner').length > 0) {
        cy.task('log', '[Folder b - Dashboard Assert] Spinner detected before Timeregistrering menu click, waiting...');
        cy.get('.overlay-spinner', {timeout: 30000}).should('not.be.visible');
        cy.task('log', '[Folder b - Dashboard Assert] Spinner gone, proceeding with Timeregistrering menu click');
      }
    });
    cy.get('mat-tree-node').contains('Timeregistrering').click();
    cy.task('log', '[Folder b - Dashboard Assert] Clicking toolbar button');
    // Wait for spinner before clicking toolbar button
    cy.get('body').then(($body) => {
      if ($body.find('.overlay-spinner').length > 0) {
        cy.task('log', '[Folder b - Dashboard Assert] Spinner detected before toolbar button click, waiting...');
        cy.get('.overlay-spinner', {timeout: 30000}).should('not.be.visible');
        cy.task('log', '[Folder b - Dashboard Assert] Spinner gone, proceeding with toolbar button click');
      }
    });
    cy.get('mat-toolbar > div > button .mat-mdc-button-persistent-ripple').first().parent().click();
    cy.task('log', '[Folder b - Dashboard Assert] Setting workingHoursSite to "c d"');
    cy.get('#workingHoursSite').clear().type('c d');
    cy.task('log', '[Folder b - Dashboard Assert] Selecting site option');
    cy.get('.ng-option.ng-option-marked').click();

    cy.task('log', '[Folder b - Dashboard Assert] Setting up intercept for working hours update');
    cy.intercept('POST', '**/api/time-planning-pn/working-hours/index').as('update');
    cy.task('log', '[Folder b - Dashboard Assert] Clicking date form input');
    TimePlanningWorkingHoursPage.dateFormInput().click();
    cy.task('log', `[Folder b - Dashboard Assert] Selecting date range: ${filters[0].dateRange.dayFrom}.${filters[0].dateRange.monthFrom}.${filters[0].dateRange.yearFrom} - ${filters[0].dateRange.dayTo}.${filters[0].dateRange.monthTo}.${filters[0].dateRange.yearTo}`);
    selectDateRangeOnNewDatePicker(
      filters[0].dateRange.yearFrom, filters[0].dateRange.monthFrom,  filters[0].dateRange.dayFrom,
      filters[0].dateRange.yearTo, filters[0].dateRange.monthTo, filters[0].dateRange.dayTo
    );
    cy.task('log', '[Folder b - Dashboard Assert] Waiting for update API call');
    cy.wait('@update');
    cy.get('.overlay-spinner', {timeout: 30000}).should('not.be.visible');
    cy.task('log', '[Folder b - Dashboard Assert] Update completed');
    cy.task('log', '[Folder b - Dashboard Assert] Verifying sumFlex0 is 97.45');
    cy.get('#sumFlex0 input').should('contain.value', '97.45');
    // cy.get('#nettoHours0 input').should('contain.value', '8.83');
    // cy.get('#flexHours0 input').should('contain.value', '8.83');
    cy.task('log', '[Folder b - Dashboard Assert] Starting loop to set plan hours for last week (7 days)');
    for (let i = 0; i < planHours.length; i++) {
      cy.task('log', `[Folder b - Dashboard Assert] Processing day ${i + 1}: date=${planHours[i].date}, hours=${planHours[i].hours}`);
      let id = `#planHours${i+1}`;
      cy.get(id).find('input').clear().type(planHours[i].hours.toString());
      cy.task('log', `[Folder b - Dashboard Assert] Verifying day ${i + 1} values: sumFlex=${planHours[i].sumFlex}, flex=${planHours[i].flex}`);
      let sumFlexId = `#sumFlex${i+1}`;
      cy.get(sumFlexId).find('input').should('contain.value', planHours[i].sumFlex.toString());
      let nettoHoursId = `#nettoHours${i+1}`;
      cy.get(nettoHoursId).find('input').should('contain.value', planHours[i].nettoHours.toString());
      let flexId = `#flexHours${i+1}`;
      cy.get(flexId).find('input').should('contain.value', planHours[i].flex.toString());
    }
    cy.task('log', '[Folder b - Dashboard Assert] Starting loop to set plan texts for last week');
    for (let i = 0; i < planTexts.length; i++) {
      cy.task('log', `[Folder b - Dashboard Assert] Setting planText ${i + 1}: ${planTexts[i].text}`);
      let id = `#planText${i+1}`;
      cy.get(id).find('input').clear().type(planTexts[i].text);
    }
    cy.task('log', '[Folder b - Dashboard Assert] Setting up intercept for save');
    cy.intercept('PUT', '**/api/time-planning-pn/working-hours').as('save');
    cy.task('log', '[Folder b - Dashboard Assert] Clicking workingHoursSave button');
    cy.get('#workingHoursSave').click();
    cy.task('log', '[Folder b - Dashboard Assert] Waiting for save API call');
    cy.wait('@save');
    cy.get('.overlay-spinner', {timeout: 30000}).should('not.be.visible');
    cy.task('log', '[Folder b - Dashboard Assert] Save completed, verifying sumFlex7 is 41.45');
    cy.get('#sumFlex7 input').should('contain.value', '41.45');

    // cy.intercept('POST', '**/api/time-planning-pn/working-hours/index').as('update');
    cy.task('log', '[Folder b - Dashboard Assert] Clicking date form input for next week');
    TimePlanningWorkingHoursPage.dateFormInput().click();
    cy.wait('@update');
    cy.get('.overlay-spinner', {timeout: 30000}).should('not.be.visible');
    cy.task('log', `[Folder b - Dashboard Assert] Selecting next week date range: ${filtersNextWeek[0].dateRange.dayFrom}.${filtersNextWeek[0].dateRange.monthFrom}.${filtersNextWeek[0].dateRange.yearFrom} - ${filtersNextWeek[0].dateRange.dayTo}.${filtersNextWeek[0].dateRange.monthTo}.${filtersNextWeek[0].dateRange.yearTo}`);
    selectDateRangeOnNewDatePicker(
      filtersNextWeek[0].dateRange.yearFrom, filtersNextWeek[0].dateRange.monthFrom,  filtersNextWeek[0].dateRange.dayFrom,
      filtersNextWeek[0].dateRange.yearTo, filtersNextWeek[0].dateRange.monthTo, filtersNextWeek[0].dateRange.dayTo
    );
    cy.task('log', '[Folder b - Dashboard Assert] Waiting for update API call');
    cy.wait('@update');
    cy.get('.overlay-spinner', {timeout: 30000}).should('not.be.visible');
    cy.task('log', '[Folder b - Dashboard Assert] Update completed');

    cy.task('log', '[Folder b - Dashboard Assert] Verifying sumFlex0 is 41.45 and nettoHours0 is 0');
    cy.get('#sumFlex0 input').should('contain.value', '41.45');
    cy.get('#nettoHours0 input').should('contain.value', '0');
    // cy.get('#flexHours0 input').should('contain.value', '-8');
    cy.task('log', '[Folder b - Dashboard Assert] Starting loop to set plan hours for next week');
    for (let i = 0; i < planHoursNextWeek.length; i++) {
      cy.task('log', `[Folder b - Dashboard Assert] Processing next week day ${i + 1}: date=${planHoursNextWeek[i].date}, hours=${planHoursNextWeek[i].hours}`);
      let id = `#planHours${i+1}`;
      cy.get(id).find('input').clear().type(planHoursNextWeek[i].hours.toString());
      cy.task('log', `[Folder b - Dashboard Assert] Verifying next week day ${i + 1} values: sumFlex=${planHoursNextWeek[i].sumFlex}`);
      let sumFlexId = `#sumFlex${i+1}`;
      cy.get(sumFlexId).find('input').should('contain.value', planHoursNextWeek[i].sumFlex.toString());
      let nettoHoursId = `#nettoHours${i+1}`;
      cy.get(nettoHoursId).find('input').should('contain.value', planHoursNextWeek[i].nettoHours.toString());
      let flexId = `#flexHours${i+1}`;
      cy.get(flexId).find('input').should('contain.value', planHoursNextWeek[i].flex.toString());
    }
    cy.task('log', '[Folder b - Dashboard Assert] Starting loop to set plan texts for next week');
    for (let i = 0; i < planTextsNextWeek.length; i++) {
      cy.task('log', `[Folder b - Dashboard Assert] Setting next week planText ${i + 1}: ${planTextsNextWeek[i].text}`);
      let id = `#planText${i+1}`;
      cy.get(id).find('input').clear().type(planTextsNextWeek[i].text);
    }
    // cy.intercept('PUT', '**/api/time-planning-pn/working-hours').as('save');
    cy.task('log', '[Folder b - Dashboard Assert] Clicking workingHoursSave button');
    cy.get('#workingHoursSave').click();
    cy.task('log', '[Folder b - Dashboard Assert] Waiting for save API call');
    cy.wait('@save');
    cy.get('.overlay-spinner', {timeout: 30000}).should('not.be.visible');
    cy.task('log', '[Folder b - Dashboard Assert] Save completed, verifying sumFlex7 is -14.55');
    cy.get('#sumFlex7 input').should('contain.value', '-14.55');

    cy.task('log', '[Folder b - Dashboard Assert] Setting up intercept for future week update');
    cy.intercept('POST', '**/api/time-planning-pn/working-hours/index').as('update');
    cy.task('log', '[Folder b - Dashboard Assert] Clicking date form input for future week');
    TimePlanningWorkingHoursPage.dateFormInput().click();
    cy.task('log', `[Folder b - Dashboard Assert] Selecting future week date range: ${filtersFutureWeek[0].dateRange.dayFrom}.${filtersFutureWeek[0].dateRange.monthFrom}.${filtersFutureWeek[0].dateRange.yearFrom} - ${filtersFutureWeek[0].dateRange.dayTo}.${filtersFutureWeek[0].dateRange.monthTo}.${filtersFutureWeek[0].dateRange.yearTo}`);
    selectDateRangeOnNewDatePicker(
      filtersFutureWeek[0].dateRange.yearFrom, filtersFutureWeek[0].dateRange.monthFrom,  filtersFutureWeek[0].dateRange.dayFrom,
      filtersFutureWeek[0].dateRange.yearTo, filtersFutureWeek[0].dateRange.monthTo, filtersFutureWeek[0].dateRange.dayTo
    );
    cy.task('log', '[Folder b - Dashboard Assert] Waiting for update API call');
    cy.wait('@update');
    cy.get('.overlay-spinner', {timeout: 30000}).should('not.be.visible');
    cy.task('log', '[Folder b - Dashboard Assert] Update completed');

    cy.task('log', '[Folder b - Dashboard Assert] Verifying nettoHours0 is 0');
    cy.get('#nettoHours0 input').should('contain.value', '0');
    cy.task('log', '[Folder b - Dashboard Assert] Starting loop to set plan hours for future week');
    for (let i = 0; i < planHoursFutureWeek.length; i++) {
      cy.wait(1000);
      cy.task('log', `[Folder b - Dashboard Assert] Processing future week day ${i + 1}: date=${planHoursFutureWeek[i].date}, hours=${planHoursFutureWeek[i].hours}`);
      let id = `#planHours${i+1}`;
      cy.get(id).find('input').clear().type(planHoursFutureWeek[i].hours.toString());
      cy.task('log', `[Folder b - Dashboard Assert] Verifying future week day ${i + 1} values: sumFlex=${planHoursFutureWeek[i].sumFlex}`);
      let sumFlexId = `#sumFlex${i+1}`;
      cy.get(sumFlexId).find('input').should('contain.value', planHoursFutureWeek[i].sumFlex.toString());
      let nettoHoursId = `#nettoHours${i+1}`;
      cy.get(nettoHoursId).find('input').should('contain.value', planHoursFutureWeek[i].nettoHours.toString());
      let flexId = `#flexHours${i+1}`;
      cy.get(flexId).find('input').should('contain.value', planHoursFutureWeek[i].flex.toString());
    }
    cy.task('log', '[Folder b - Dashboard Assert] Starting loop to set plan texts for future week');
    for (let i = 0; i < planTextsFutureWeek.length; i++) {
      cy.task('log', `[Folder b - Dashboard Assert] Setting future week planText ${i + 1}: ${planTextsFutureWeek[i].text}`);
      let id = `#planText${i+1}`;
      cy.get(id).find('input').clear().type(planTextsFutureWeek[i].text);
    }

    // cy.intercept('PUT', '**/api/time-planning-pn/working-hours').as('save');
    cy.task('log', '[Folder b - Dashboard Assert] Clicking workingHoursSave button');
    cy.get('#workingHoursSave').click();
    cy.task('log', '[Folder b - Dashboard Assert] Waiting for save API call');
    cy.wait('@save');
    cy.get('.overlay-spinner', {timeout: 30000}).should('not.be.visible');
    cy.task('log', '[Folder b - Dashboard Assert] Clicking toolbar button to close');
    cy.get('mat-toolbar > div > button .mat-mdc-button-persistent-ripple').first().parent().click();
    cy.task('log', '[Folder b - Dashboard Assert] Verifying sumFlex7 is -78.55');
    cy.get('#sumFlex7 input').should('contain.value', '-78.55');
    cy.task('log', '[Folder b - Dashboard Assert] Navigating to plugins page');
    pluginPage.Navbar.goToPluginsPage();

    cy.task('log', '[Folder b - Dashboard Assert] Clicking action menu');
    cy.get('#actionMenu')
      .scrollIntoView().should('be.visible')
      .click({ force: true });
    cy.task('log', '[Folder b - Dashboard Assert] Setting up intercept for settings-get');
    cy.intercept('GET', '**/api/time-planning-pn/settings').as('settings-get');
    cy.task('log', '[Folder b - Dashboard Assert] Clicking plugin settings link');
    cy.get('#plugin-settings-link0').click();
    cy.task('log', '[Folder b - Dashboard Assert] Waiting for settings-get API call');
    cy.wait('@settings-get', { timeout: 60000 });
    cy.task('log', '[Folder b - Dashboard Assert] Settings loaded successfully');
    cy.task('log', '[Folder b - Dashboard Assert] Clicking forceLoadAllPlanningsFromGoogleSheet');
    cy.get('#forceLoadAllPlanningsFromGoogleSheet').click();
    cy.task('log', '[Folder b - Dashboard Assert] Clicking saveSettings button');
    cy.get('#saveSettings').click();
    cy.task('log', '[Folder b - Dashboard Assert] Clicking Dashboard menu');
    cy.get('mat-tree-node').contains('Dashboard').click();
    cy.task('log', '[Folder b - Dashboard Assert] Waiting for index-update API call');
    cy.wait('@index-update', { timeout: 60000 });
    // Wait for spinner after index update
    cy.get('body').then(($body) => {
      if ($body.find('.overlay-spinner').length > 0) {
        cy.task('log', '[Folder b - Dashboard Assert] Spinner detected after index-update, waiting...');
        cy.get('.overlay-spinner', {timeout: 30000}).should('not.be.visible');
      }
    });
    cy.task('log', '[Folder b - Dashboard Assert] Index updated successfully');
    cy.task('log', '[Folder b - Dashboard Assert] Clicking toolbar button');
    cy.get('mat-toolbar > div > button .mat-mdc-button-persistent-ripple').first().parent().click();

    cy.task('log', '[Folder b - Dashboard Assert] Setting workingHoursSite to "c d"');
    cy.get('#workingHoursSite').clear().type('c d');
    cy.task('log', '[Folder b - Dashboard Assert] Selecting site option');
    cy.get('.ng-option.ng-option-marked').click();
    cy.task('log', '[Folder b - Dashboard Assert] Waiting for index-update API call');
    cy.wait('@index-update', { timeout: 60000 });
    // Wait for spinner after index update
    cy.get('body').then(($body) => {
      if ($body.find('.overlay-spinner').length > 0) {
        cy.task('log', '[Folder b - Dashboard Assert] Spinner detected after index-update, waiting...');
        cy.get('.overlay-spinner', {timeout: 30000}).should('not.be.visible');
      }
    });
    cy.task('log', '[Folder b - Dashboard Assert] Clicking backwards button');
    cy.get('#backwards').click();
    cy.task('log', '[Folder b - Dashboard Assert] Waiting for index-update API call');
    cy.wait('@index-update', { timeout: 60000 });
    // Wait for spinner after index update
    cy.get('body').then(($body) => {
      if ($body.find('.overlay-spinner').length > 0) {
        cy.task('log', '[Folder b - Dashboard Assert] Spinner detected after index-update, waiting...');
        cy.get('.overlay-spinner', {timeout: 30000}).should('not.be.visible');
      }
    });
    cy.task('log', '[Folder b - Dashboard Assert] Index updated, verifying plannedHours0 is 53:15');
    cy.get('#plannedHours0').should('include.text', '53:15');
    cy.task('log', '[Folder b - Dashboard Assert] Starting loop to verify plan texts in dashboard (7 days)');
    for (let i = 0; i < planTexts.length; i++) {
      cy.task('log', `[Folder b - Dashboard Assert] Verifying day ${i}: date=${planTexts[i].date}`);
      let plannedHoursId = `#plannedHours0_${i}`;
      // cy.get(plannedHoursId).should('include.text', planTexts[i].plannedHours);
      let flexBalanceToDateId = `#flexBalanceToDate0_${i}`;
      cy.task('log', `[Folder b - Dashboard Assert] Verifying flexBalanceToDate for day ${i}: ${planTexts[i].flexBalanceToDate}`);
      cy.get(flexBalanceToDateId).should('include.text', planTexts[i].flexBalanceToDate);

      let cellId = `#cell0_${i}`;
      cy.task('log', `[Folder b - Dashboard Assert] Clicking cell0_${i}`);
      cy.get(cellId).scrollIntoView();
      cy.get(cellId).click();
      cy.get('#planHours').scrollIntoView().should('be.visible');
      cy.task('log', `[Folder b - Dashboard Assert] Verifying values: planHours=${planTexts[i].calculatedHours}, shift1=${planTexts[i].plannedStartOfShift1}-${planTexts[i].plannedEndOfShift1}`);
      cy.get('#planHours').should('have.value', planTexts[i].calculatedHours);
      cy.get('[data-testid="plannedStartOfShift1"]').should('have.value', planTexts[i].plannedStartOfShift1);
      cy.get('[data-testid="plannedBreakOfShift1"]').should('have.value', planTexts[i].plannedBreakOfShift1);
      cy.get('[data-testid="plannedEndOfShift1"]').should('have.value', planTexts[i].plannedEndOfShift1);
      cy.get('[data-testid="plannedStartOfShift2"]').should('have.value', planTexts[i].plannedStartOfShift2);
      cy.get('[data-testid="plannedBreakOfShift2"]').should('have.value', planTexts[i].plannedBreakOfShift2);
      cy.get('[data-testid="plannedEndOfShift2"]').should('have.value', planTexts[i].plannedEndOfShift2);
      cy.task('log', '[Folder b - Dashboard Assert] Clicking cancel button');
      cy.get('#cancelButton').click();
      cy.wait(500);
    }

    cy.task('log', '[Folder b - Dashboard Assert] Clicking forwards button');
    cy.get('#forwards').click();
    cy.task('log', '[Folder b - Dashboard Assert] Waiting for index-update API call');
    cy.wait('@index-update', { timeout: 60000 });
    // Wait for spinner after index update
    cy.get('body').then(($body) => {
      if ($body.find('.overlay-spinner').length > 0) {
        cy.task('log', '[Folder b - Dashboard Assert] Spinner detected after index-update, waiting...');
        cy.get('.overlay-spinner', {timeout: 30000}).should('not.be.visible');
      }
    });
    cy.wait(1000);
    cy.task('log', '[Folder b - Dashboard Assert] Clicking forwards button again');
    cy.get('#forwards').click();
    cy.task('log', '[Folder b - Dashboard Assert] Waiting for index-update API call');
    cy.wait('@index-update', { timeout: 60000 });
    // Wait for spinner after index update
    cy.get('body').then(($body) => {
      if ($body.find('.overlay-spinner').length > 0) {
        cy.task('log', '[Folder b - Dashboard Assert] Spinner detected after index-update, waiting...');
        cy.get('.overlay-spinner', {timeout: 30000}).should('not.be.visible');
      }
    });
    cy.wait(1000);
    cy.task('log', '[Folder b - Dashboard Assert] Starting loop to verify next week plan texts in dashboard');
    for (let i = 0; i < planTextsNextWeek.length; i++) {
      cy.task('log', `[Folder b - Dashboard Assert] Verifying next week day ${i}: date=${planTextsNextWeek[i].date}`);
      let firstShiftId = `#firstShift0_${i}`;
      cy.task('log', `[Folder b - Dashboard Assert] Verifying firstShift: ${planTextsNextWeek[i].firstShift}`);
      cy.get(firstShiftId).should('include.text', planTextsNextWeek[i].firstShift);
      if (planTextsNextWeek[i].secondShift) {
        let secondShiftId = `#secondShift0_${i}`;
        cy.task('log', `[Folder b - Dashboard Assert] Verifying secondShift: ${planTextsNextWeek[i].secondShift}`);
        cy.get(secondShiftId).should('include.text', planTextsNextWeek[i].secondShift);
      }

      let cellId = `#cell0_${i}`;
      cy.task('log', `[Folder b - Dashboard Assert] Clicking cell0_${i}`);
      cy.get(cellId).scrollIntoView();
      cy.get(cellId).click();
      cy.get('#planHours').scrollIntoView().should('be.visible');
      cy.task('log', `[Folder b - Dashboard Assert] Verifying planHours=${planTextsNextWeek[i].calculatedHours}`);
      cy.get('#planHours').should('have.value', planTextsNextWeek[i].calculatedHours);
      cy.get('[data-testid="plannedStartOfShift1"]').should('have.value', planTextsNextWeek[i].plannedStartOfShift1);
      cy.get('[data-testid="plannedBreakOfShift1"]').should('have.value', planTextsNextWeek[i].plannedBreakOfShift1);
      cy.get('[data-testid="plannedEndOfShift1"]').should('have.value', planTextsNextWeek[i].plannedEndOfShift1);
      cy.get('[data-testid="plannedStartOfShift2"]').should('have.value', planTextsNextWeek[i].plannedStartOfShift2);
      cy.get('[data-testid="plannedBreakOfShift2"]').should('have.value', planTextsNextWeek[i].plannedBreakOfShift2);
      cy.get('[data-testid="plannedEndOfShift2"]').should('have.value', planTextsNextWeek[i].plannedEndOfShift2);
      cy.task('log', '[Folder b - Dashboard Assert] Clicking cancel button');
      cy.get('#cancelButton').click();
    }

    cy.task('log', '[Folder b - Dashboard Assert] Clicking forwards button for future week');
    cy.get('#forwards').click();
    cy.task('log', '[Folder b - Dashboard Assert] Waiting for index-update API call');
    cy.wait('@index-update', { timeout: 60000 });
    // Wait for spinner after index update
    cy.get('body').then(($body) => {
      if ($body.find('.overlay-spinner').length > 0) {
        cy.task('log', '[Folder b - Dashboard Assert] Spinner detected after index-update, waiting...');
        cy.get('.overlay-spinner', {timeout: 30000}).should('not.be.visible');
      }
    });
    cy.wait(1000);
    cy.task('log', '[Folder b - Dashboard Assert] Starting loop to verify future week plan texts in dashboard');
    for (let i = 0; i < planTextsFutureWeek.length; i++) {
      cy.task('log', `[Folder b - Dashboard Assert] Verifying future week day ${i}: date=${planTextsFutureWeek[i].date}`);
      if (planTextsFutureWeek[i].firstShift) {
        let firstShiftId = `#firstShift0_${i}`;
        cy.task('log', `[Folder b - Dashboard Assert] Verifying firstShift: ${planTextsFutureWeek[i].firstShift}`);
        cy.get(firstShiftId).should('include.text', planTextsFutureWeek[i].firstShift);
      } else {
        let plannedHoursId = `#plannedHours0_${i}`;
        cy.task('log', `[Folder b - Dashboard Assert] Verifying plannedHours: ${planTextsFutureWeek[i].plannedHours}`);
        cy.get(plannedHoursId).should('include.text', planTextsFutureWeek[i].plannedHours);
      }
      if (planTextsFutureWeek[i].secondShift) {
        let secondShiftId = `#secondShift0_${i}`;
        cy.task('log', `[Folder b - Dashboard Assert] Verifying secondShift: ${planTextsFutureWeek[i].secondShift}`);
        cy.get(secondShiftId).should('include.text', planTextsFutureWeek[i].secondShift);
      }

      let cellId = `#cell0_${i}`;
      cy.task('log', `[Folder b - Dashboard Assert] Clicking cell0_${i}`);
      cy.get(cellId).scrollIntoView();
      cy.get(cellId).click();
      cy.get('#planHours').scrollIntoView().should('be.visible');
      cy.task('log', `[Folder b - Dashboard Assert] Verifying planHours=${planTextsFutureWeek[i].calculatedHours}`);
      cy.get('#planHours').should('have.value', planTextsFutureWeek[i].calculatedHours);
      cy.get('[data-testid="plannedStartOfShift1"]').should('have.value', planTextsFutureWeek[i].plannedStartOfShift1);
      cy.get('[data-testid="plannedBreakOfShift1"]').should('have.value', planTextsFutureWeek[i].plannedBreakOfShift1);
      cy.get('[data-testid="plannedEndOfShift1"]').should('have.value', planTextsFutureWeek[i].plannedEndOfShift1);
      cy.get('[data-testid="plannedStartOfShift2"]').should('have.value', planTextsFutureWeek[i].plannedStartOfShift2);
      cy.get('[data-testid="plannedBreakOfShift2"]').should('have.value', planTextsFutureWeek[i].plannedBreakOfShift2);
      cy.get('[data-testid="plannedEndOfShift2"]').should('have.value', planTextsFutureWeek[i].plannedEndOfShift2);
      cy.task('log', '[Folder b - Dashboard Assert] Clicking cancel button');
      cy.get('#cancelButton').click();
    }
    cy.task('log', '[Folder b - Dashboard Assert] Test completed successfully');
  });

  it('should go to dashboard after updating planText to new values and they should change in dashboard', () => {
    cy.task('log', '[Folder b - Dashboard Assert] ========== Test: Update planText to new values ==========');
    cy.task('log', '[Folder b - Dashboard Assert] Clicking Timeregistrering nested menu');
    // Wait for spinner before clicking Timeregistrering nested menu
    cy.get('body').then(($body) => {
      if ($body.find('.overlay-spinner').length > 0) {
        cy.task('log', '[Folder b - Dashboard Assert] Spinner detected before Timeregistrering nested menu click, waiting...');
        cy.get('.overlay-spinner', {timeout: 30000}).should('not.be.visible');
        cy.task('log', '[Folder b - Dashboard Assert] Spinner gone, proceeding with Timeregistrering nested menu click');
      }
    });
    cy.get('mat-nested-tree-node').contains('Timeregistrering').click();
    cy.task('log', '[Folder b - Dashboard Assert] Clicking Timeregistrering tree menu');
    // Wait for spinner before clicking Timeregistrering tree menu
    cy.get('body').then(($body) => {
      if ($body.find('.overlay-spinner').length > 0) {
        cy.task('log', '[Folder b - Dashboard Assert] Spinner detected before Timeregistrering tree menu click, waiting...');
        cy.get('.overlay-spinner', {timeout: 30000}).should('not.be.visible');
        cy.task('log', '[Folder b - Dashboard Assert] Spinner gone, proceeding with Timeregistrering tree menu click');
      }
    });
    cy.get('mat-tree-node').contains('Timeregistrering').click();
    cy.task('log', '[Folder b - Dashboard Assert] Clicking toolbar button');
    // Wait for spinner before clicking toolbar button
    cy.get('body').then(($body) => {
      if ($body.find('.overlay-spinner').length > 0) {
        cy.task('log', '[Folder b - Dashboard Assert] Spinner detected before toolbar button click, waiting...');
        cy.get('.overlay-spinner', {timeout: 30000}).should('not.be.visible');
        cy.task('log', '[Folder b - Dashboard Assert] Spinner gone, proceeding with toolbar button click');
      }
    });
    cy.get('mat-toolbar > div > button .mat-mdc-button-persistent-ripple').first().parent().click();
    cy.task('log', '[Folder b - Dashboard Assert] Setting workingHoursSite to "c d"');
    cy.get('#workingHoursSite').clear().type('c d');
    cy.task('log', '[Folder b - Dashboard Assert] Selecting site option');
    cy.get('.ng-option.ng-option-marked').click();
    cy.task('log', '[Folder b - Dashboard Assert] Setting up intercept for update');
    cy.intercept('POST', '**/api/time-planning-pn/working-hours/index').as('update');
    cy.task('log', '[Folder b - Dashboard Assert] Clicking date form input');
    TimePlanningWorkingHoursPage.dateFormInput().click();
    cy.task('log', `[Folder b - Dashboard Assert] Selecting date range for last week`);
    selectDateRangeOnNewDatePicker(
      filters[0].dateRange.yearFrom, filters[0].dateRange.monthFrom,  filters[0].dateRange.dayFrom,
      filters[0].dateRange.yearTo, filters[0].dateRange.monthTo, filters[0].dateRange.dayTo
    );
    cy.task('log', '[Folder b - Dashboard Assert] Waiting for update API call');
    cy.wait('@update');
    cy.get('.overlay-spinner', {timeout: 30000}).should('not.be.visible');
    cy.task('log', '[Folder b - Dashboard Assert] Update completed, verifying sumFlex0 is 97.45');
    cy.get('#sumFlex0 input').should('contain.value', '97.45');
    cy.task('log', '[Folder b - Dashboard Assert] Starting loop to set updated plan hours for last week');
    for (let i = 0; i < updatePlanHours.length; i++) {
      cy.task('log', `[Folder b - Dashboard Assert] Setting day ${i + 1}: hours=${updatePlanHours[i].hours}`);
      let id = `#planHours${i+1}`;
      cy.get(id).find('input').clear().type(updatePlanHours[i].hours.toString());
      cy.task('log', `[Folder b - Dashboard Assert] Verifying day ${i + 1}: sumFlex=${updatePlanHours[i].sumFlex}`);
      let sumFlexId = `#sumFlex${i+1}`;
      cy.get(sumFlexId).find('input').should('contain.value', updatePlanHours[i].sumFlex.toString());
      let nettoHoursId = `#nettoHours${i+1}`;
      cy.get(nettoHoursId).find('input').should('contain.value', updatePlanHours[i].nettoHours.toString());
      let flexId = `#flexHours${i+1}`;
      cy.get(flexId).find('input').should('contain.value', updatePlanHours[i].flex.toString());
    }
    cy.task('log', '[Folder b - Dashboard Assert] Starting loop to set updated plan texts');
    for (let i = 0; i < updatePlanTexts.length; i++) {
      cy.task('log', `[Folder b - Dashboard Assert] Setting planText ${i + 1}: ${updatePlanTexts[i].text}`);
      let id = `#planText${i+1}`;
      cy.get(id).find('input').clear().type(updatePlanTexts[i].text);
    }
    cy.task('log', '[Folder b - Dashboard Assert] Setting up intercept for save');
    cy.intercept('PUT', '**/api/time-planning-pn/working-hours').as('save');
    cy.task('log', '[Folder b - Dashboard Assert] Clicking workingHoursSave button');
    // Wait for spinner before clicking workingHoursSave button
    cy.get('body').then(($body) => {
      if ($body.find('.overlay-spinner').length > 0) {
        cy.task('log', '[Folder b - Dashboard Assert] Spinner detected before workingHoursSave click, waiting...');
        cy.get('.overlay-spinner', {timeout: 30000}).should('not.be.visible');
        cy.task('log', '[Folder b - Dashboard Assert] Spinner gone, proceeding with workingHoursSave click');
      }
    });
    cy.get('#workingHoursSave').click();
    cy.task('log', '[Folder b - Dashboard Assert] Waiting for save API call');
    cy.wait('@save');
    cy.get('.overlay-spinner', {timeout: 30000}).should('not.be.visible');
    cy.task('log', '[Folder b - Dashboard Assert] Save completed, verifying sumFlex7 is 76.45');
    cy.get('#sumFlex7 input').should('contain.value', '76.45');

    cy.task('log', '[Folder b - Dashboard Assert] Setting up intercept for next week update');
    cy.intercept('POST', '**/api/time-planning-pn/working-hours/index').as('update');
    cy.task('log', '[Folder b - Dashboard Assert] Clicking date form input for next week');
    TimePlanningWorkingHoursPage.dateFormInput().click();
    cy.wait('@update');
    cy.get('.overlay-spinner', {timeout: 30000}).should('not.be.visible');
    cy.task('log', `[Folder b - Dashboard Assert] Selecting next week date range`);
    selectDateRangeOnNewDatePicker(
      filtersNextWeek[0].dateRange.yearFrom, filtersNextWeek[0].dateRange.monthFrom,  filtersNextWeek[0].dateRange.dayFrom,
      filtersNextWeek[0].dateRange.yearTo, filtersNextWeek[0].dateRange.monthTo, filtersNextWeek[0].dateRange.dayTo
    );
    cy.task('log', '[Folder b - Dashboard Assert] Waiting for update API call');
    cy.wait('@update');
    cy.get('.overlay-spinner', {timeout: 30000}).should('not.be.visible');
    cy.task('log', '[Folder b - Dashboard Assert] Update completed');

    cy.task('log', '[Folder b - Dashboard Assert] Verifying sumFlex0=44.2, nettoHours0=0');
    cy.get('#sumFlex0 input').should('contain.value', '44.2');
    cy.get('#nettoHours0 input').should('contain.value', '0');

    cy.task('log', '[Folder b - Dashboard Assert] Starting loop to set updated plan hours for next week');
    for (let i = 0; i < updatePlanHoursNextWeek.length; i++) {
      cy.task('log', `[Folder b - Dashboard Assert] Setting next week day ${i + 1}: hours=${updatePlanHoursNextWeek[i].hours}`);
      let id = `#planHours${i+1}`;
      cy.get(id).find('input').clear().type(updatePlanHoursNextWeek[i].hours.toString());
      cy.task('log', `[Folder b - Dashboard Assert] Verifying next week day ${i + 1}: sumFlex=${updatePlanHoursNextWeek[i].sumFlex}`);
      let sumFlexId = `#sumFlex${i+1}`;
      cy.get(sumFlexId).find('input').should('contain.value', updatePlanHoursNextWeek[i].sumFlex.toString());
      let nettoHoursId = `#nettoHours${i+1}`;
      cy.get(nettoHoursId).find('input').should('contain.value', updatePlanHoursNextWeek[i].nettoHours.toString());
      let flexId = `#flexHours${i+1}`;
      cy.get(flexId).find('input').should('contain.value', updatePlanHoursNextWeek[i].flex.toString());
    }
    cy.task('log', '[Folder b - Dashboard Assert] Starting loop to set updated plan texts for next week');
    for (let i = 0; i < updatePlanTextsNextWeek.length; i++) {
      cy.task('log', `[Folder b - Dashboard Assert] Setting next week planText ${i + 1}: ${updatePlanTextsNextWeek[i].text}`);
      let id = `#planText${i+1}`;
      cy.get(id).find('input').clear().type(updatePlanTextsNextWeek[i].text);
    }

    // cy.intercept('PUT', '**/api/time-planning-pn/working-hours').as('save');
    cy.task('log', '[Folder b - Dashboard Assert] Clicking workingHoursSave button');
    cy.get('#workingHoursSave').click();
    cy.task('log', '[Folder b - Dashboard Assert] Waiting for save API call');
    cy.wait('@save');
    cy.get('.overlay-spinner', {timeout: 30000}).should('not.be.visible');
    cy.task('log', '[Folder b - Dashboard Assert] Save completed, verifying sumFlex7=12.2');
    cy.get('#sumFlex7 input').should('contain.value', '12.2');

    // cy.intercept('POST', '**/api/time-planning-pn/working-hours/index').as('update');
    cy.task('log', '[Folder b - Dashboard Assert] Clicking date form input for future week');
    TimePlanningWorkingHoursPage.dateFormInput().click();
    cy.task('log', `[Folder b - Dashboard Assert] Selecting future week date range`);
    selectDateRangeOnNewDatePicker(
      filtersFutureWeek[0].dateRange.yearFrom, filtersFutureWeek[0].dateRange.monthFrom,  filtersFutureWeek[0].dateRange.dayFrom,
      filtersFutureWeek[0].dateRange.yearTo, filtersFutureWeek[0].dateRange.monthTo, filtersFutureWeek[0].dateRange.dayTo
    );
    cy.task('log', '[Folder b - Dashboard Assert] Waiting for update API call');
    cy.wait('@update');
    cy.get('.overlay-spinner', {timeout: 30000}).should('not.be.visible');
    cy.task('log', '[Folder b - Dashboard Assert] Update completed');


    cy.task('log', '[Folder b - Dashboard Assert] Verifying nettoHours0=0');
    cy.get('#nettoHours0 input').should('contain.value', '0');
    cy.task('log', '[Folder b - Dashboard Assert] Starting loop to set updated plan hours for future week');
    for (let i = 0; i < updatePlanHoursFutureWeek.length; i++) {
      cy.task('log', `[Folder b - Dashboard Assert] Setting future week day ${i + 1}: hours=${updatePlanHoursFutureWeek[i].hours}`);
      let id = `#planHours${i+1}`;
      cy.get(id).find('input').clear().type(updatePlanHoursFutureWeek[i].hours.toString());
      cy.task('log', `[Folder b - Dashboard Assert] Verifying future week day ${i + 1}: sumFlex=${updatePlanHoursFutureWeek[i].sumFlex}`);
      let sumFlexId = `#sumFlex${i+1}`;
      cy.get(sumFlexId).find('input').should('contain.value', updatePlanHoursFutureWeek[i].sumFlex.toString());
      let nettoHoursId = `#nettoHours${i+1}`;
      cy.get(nettoHoursId).find('input').should('contain.value', updatePlanHoursFutureWeek[i].nettoHours.toString());
      let flexId = `#flexHours${i+1}`;
      cy.get(flexId).find('input').should('contain.value', updatePlanHoursFutureWeek[i].flex.toString());
    }
    cy.task('log', '[Folder b - Dashboard Assert] Starting loop to set updated plan texts for future week');
    for (let i = 0; i < updatePlanTextsFutureWeek.length; i++) {
      cy.task('log', `[Folder b - Dashboard Assert] Setting future week planText ${i + 1}: ${updatePlanTextsFutureWeek[i].text}`);
      let id = `#planText${i+1}`;
      cy.get(id).find('input').clear().type(updatePlanTextsFutureWeek[i].text);
    }

    cy.task('log', '[Folder b - Dashboard Assert] Setting up intercept for save');
    cy.intercept('PUT', '**/api/time-planning-pn/working-hours').as('save');
    cy.task('log', '[Folder b - Dashboard Assert] Clicking workingHoursSave button');
    cy.get('#workingHoursSave').click();
    cy.task('log', '[Folder b - Dashboard Assert] Waiting for save API call');
    cy.wait('@save');
    cy.get('.overlay-spinner', {timeout: 30000}).should('not.be.visible');
    cy.task('log', '[Folder b - Dashboard Assert] Clicking toolbar button to close');
    cy.get('mat-toolbar > div > button .mat-mdc-button-persistent-ripple').first().parent().click();
    cy.task('log', '[Folder b - Dashboard Assert] Verifying sumFlex7=-48.05');
    cy.get('#sumFlex7 input').should('contain.value', '-48.05');



    cy.task('log', '[Folder b - Dashboard Assert] Setting up intercept for dashboard index-update');
    cy.intercept('POST', '**/api/time-planning-pn/plannings/index').as('index-update');
    cy.task('log', '[Folder b - Dashboard Assert] Clicking Dashboard menu');
    cy.get('mat-tree-node').contains('Dashboard').click();
    cy.task('log', '[Folder b - Dashboard Assert] Waiting for index-update API call');
    cy.wait('@index-update', { timeout: 60000 });
    // Wait for spinner after index update
    cy.get('body').then(($body) => {
      if ($body.find('.overlay-spinner').length > 0) {
        cy.task('log', '[Folder b - Dashboard Assert] Spinner detected after index-update, waiting...');
        cy.get('.overlay-spinner', {timeout: 30000}).should('not.be.visible');
      }
    });
    cy.task('log', '[Folder b - Dashboard Assert] Setting workingHoursSite to "c d"');
    cy.get('#workingHoursSite').clear().type('c d');
    cy.task('log', '[Folder b - Dashboard Assert] Selecting site option');
    cy.get('.ng-option.ng-option-marked').click();
    cy.task('log', '[Folder b - Dashboard Assert] Waiting for index-update API call');
    cy.wait('@index-update', { timeout: 60000 });
    // Wait for spinner after index update
    cy.get('body').then(($body) => {
      if ($body.find('.overlay-spinner').length > 0) {
        cy.task('log', '[Folder b - Dashboard Assert] Spinner detected after index-update, waiting...');
        cy.get('.overlay-spinner', {timeout: 30000}).should('not.be.visible');
      }
    });
    cy.task('log', '[Folder b - Dashboard Assert] Clicking backwards button');
    cy.get('#backwards').click();
    cy.task('log', '[Folder b - Dashboard Assert] Waiting for index-update API call');
    cy.wait('@index-update', { timeout: 60000 });
    // Wait for spinner after index update
    cy.get('body').then(($body) => {
      if ($body.find('.overlay-spinner').length > 0) {
        cy.task('log', '[Folder b - Dashboard Assert] Spinner detected after index-update, waiting...');
        cy.get('.overlay-spinner', {timeout: 30000}).should('not.be.visible');
      }
    });
    cy.task('log', '[Folder b - Dashboard Assert] Verifying plannedHours0=53:15');
    cy.get('#plannedHours0').should('include.text', '53:15');
    cy.task('log', '[Folder b - Dashboard Assert] Starting loop to verify updated plan texts in dashboard (last week)');
    for (let i = 0; i < updatePlanTexts.length; i++) {
      cy.task('log', `[Folder b - Dashboard Assert] Verifying day ${i}: date=${updatePlanTexts[i].date}`);
      // let plannedHoursId = `#plannedHours0_${i}`;
      // if (updatePlanTexts[i].plannedHours !== '') {
      //   cy.get(plannedHoursId).should('include.text', updatePlanTexts[i].plannedHours);
      // }
      let flexBalanceToDateId = `#flexBalanceToDate0_${i}`;
      if (updatePlanTexts[i].flexBalanceToDate !== '') {
        cy.task('log', `[Folder b - Dashboard Assert] Verifying flexBalanceToDate: ${updatePlanTexts[i].flexBalanceToDate}`);
        cy.get(flexBalanceToDateId).should('include.text', updatePlanTexts[i].flexBalanceToDate);
      }

      let cellId = `#cell0_${i}`;
      cy.task('log', `[Folder b - Dashboard Assert] Clicking cell0_${i}`);
      cy.get(cellId).scrollIntoView();
      cy.get(cellId).click();
      cy.get('#planHours').scrollIntoView().should('be.visible');
      cy.task('log', `[Folder b - Dashboard Assert] Verifying planHours=${updatePlanTexts[i].calculatedHours}`);
      cy.get('#planHours').should('include.value', updatePlanTexts[i].calculatedHours);
      cy.get('[data-testid="plannedStartOfShift1"]').should('include.value', updatePlanTexts[i].plannedStartOfShift1);
      cy.get('[data-testid="plannedBreakOfShift1"]').should('include.value', updatePlanTexts[i].plannedBreakOfShift1);
      cy.get('[data-testid="plannedEndOfShift1"]').should('include.value', updatePlanTexts[i].plannedEndOfShift1);
      cy.get('[data-testid="plannedStartOfShift2"]').should('include.value', updatePlanTexts[i].plannedStartOfShift2);
      cy.get('[data-testid="plannedBreakOfShift2"]').should('include.value', updatePlanTexts[i].plannedBreakOfShift2);
      cy.get('[data-testid="plannedEndOfShift2"]').should('include.value', updatePlanTexts[i].plannedEndOfShift2);
      cy.task('log', '[Folder b - Dashboard Assert] Clicking cancel button');
      cy.get('#cancelButton').click();
      cy.wait(500);
    }

    cy.task('log', '[Folder b - Dashboard Assert] Clicking forwards button');
    cy.get('#forwards').click();
    cy.task('log', '[Folder b - Dashboard Assert] Waiting for index-update API call');
    cy.wait('@index-update', { timeout: 60000 });
    // Wait for spinner after index update
    cy.get('body').then(($body) => {
      if ($body.find('.overlay-spinner').length > 0) {
        cy.task('log', '[Folder b - Dashboard Assert] Spinner detected after index-update, waiting...');
        cy.get('.overlay-spinner', {timeout: 30000}).should('not.be.visible');
      }
    });
    cy.wait(500);
    cy.task('log', '[Folder b - Dashboard Assert] Clicking forwards button again');
    cy.get('#forwards').click();
    cy.task('log', '[Folder b - Dashboard Assert] Waiting for index-update API call');
    cy.wait('@index-update', { timeout: 60000 });
    // Wait for spinner after index update
    cy.get('body').then(($body) => {
      if ($body.find('.overlay-spinner').length > 0) {
        cy.task('log', '[Folder b - Dashboard Assert] Spinner detected after index-update, waiting...');
        cy.get('.overlay-spinner', {timeout: 30000}).should('not.be.visible');
      }
    });
    cy.wait(500);
    cy.task('log', '[Folder b - Dashboard Assert] Starting loop to verify updated next week plan texts in dashboard');
    for (let i = 0; i < updatePlanTextsNextWeek.length; i++) {
      cy.task('log', `[Folder b - Dashboard Assert] Verifying next week day ${i}: date=${updatePlanTextsNextWeek[i].date}`);
      let firstShiftId = `#firstShift0_${i}`;
      let cellId = `#cell0_${i}`;
      cy.get(cellId).scrollIntoView();
      cy.get(firstShiftId).scrollIntoView();
      cy.task('log', `[Folder b - Dashboard Assert] Verifying firstShift: ${updatePlanTextsNextWeek[i].firstShift}`);
      cy.get(firstShiftId).should('include.text', updatePlanTextsNextWeek[i].firstShift);
      if (planTextsNextWeek[i].secondShift) {
        let secondShiftId = `#secondShift0_${i}`;
        cy.task('log', `[Folder b - Dashboard Assert] Verifying secondShift: ${updatePlanTextsNextWeek[i].secondShift}`);
        cy.get(secondShiftId).should('include.text', updatePlanTextsNextWeek[i].secondShift);
      }

      cy.task('log', `[Folder b - Dashboard Assert] Clicking cell0_${i}`);
      cy.get(cellId).click();
      cy.get('#planHours').scrollIntoView().should('be.visible');
      cy.task('log', `[Folder b - Dashboard Assert] Verifying planHours=${updatePlanTextsNextWeek[i].calculatedHours}`);
      cy.get('#planHours').should('include.value', updatePlanTextsNextWeek[i].calculatedHours);
      cy.get('[data-testid="plannedStartOfShift1"]').should('include.value', updatePlanTextsNextWeek[i].plannedStartOfShift1);
      cy.get('[data-testid="plannedBreakOfShift1"]').should('include.value', updatePlanTextsNextWeek[i].plannedBreakOfShift1);
      cy.get('[data-testid="plannedEndOfShift1"]').should('include.value', updatePlanTextsNextWeek[i].plannedEndOfShift1);
      cy.get('[data-testid="plannedStartOfShift2"]').should('include.value', updatePlanTextsNextWeek[i].plannedStartOfShift2);
      cy.get('[data-testid="plannedBreakOfShift2"]').should('include.value', updatePlanTextsNextWeek[i].plannedBreakOfShift2);
      cy.get('[data-testid="plannedEndOfShift2"]').should('include.value', updatePlanTextsNextWeek[i].plannedEndOfShift2);
      cy.task('log', '[Folder b - Dashboard Assert] Clicking cancel button');
      cy.get('#cancelButton').click();
    }
    cy.task('log', '[Folder b - Dashboard Assert] Clicking forwards button for future week');
    cy.get('#forwards').click();
    cy.task('log', '[Folder b - Dashboard Assert] Waiting for index-update API call');
    cy.wait('@index-update', { timeout: 60000 });
    // Wait for spinner after index update
    cy.get('body').then(($body) => {
      if ($body.find('.overlay-spinner').length > 0) {
        cy.task('log', '[Folder b - Dashboard Assert] Spinner detected after index-update, waiting...');
        cy.get('.overlay-spinner', {timeout: 30000}).should('not.be.visible');
      }
    });
    cy.wait(500);
    cy.task('log', '[Folder b - Dashboard Assert] Starting loop to verify updated future week plan texts in dashboard');
    for (let i = 0; i < updatePlanTextsFutureWeek.length; i++) {
      cy.task('log', `[Folder b - Dashboard Assert] Verifying future week day ${i}: date=${updatePlanTextsFutureWeek[i].date}`);
      let cellId = `#cell0_${i}`;
      cy.get(cellId).scrollIntoView();
      if (planTextsFutureWeek[i].firstShift) {
        let firstShiftId = `#firstShift0_${i}`;
        cy.task('log', `[Folder b - Dashboard Assert] Verifying firstShift: ${updatePlanTextsFutureWeek[i].firstShift}`);
        cy.get(firstShiftId).should('include.text', updatePlanTextsFutureWeek[i].firstShift);
      } else {
        if (updatePlanTextsFutureWeek[i].plannedHours !== '') {
          let plannedHoursId = `#plannedHours0_${i}`;
          cy.task('log', `[Folder b - Dashboard Assert] Verifying plannedHours: ${updatePlanTextsFutureWeek[i].plannedHours}`);
          cy.get(plannedHoursId).should('include.text', updatePlanTextsFutureWeek[i].plannedHours);
        }
      }
      if (planTextsFutureWeek[i].secondShift) {
        let secondShiftId = `#secondShift0_${i}`;
        cy.task('log', `[Folder b - Dashboard Assert] Verifying secondShift: ${updatePlanTextsFutureWeek[i].secondShift}`);
        cy.get(secondShiftId).should('include.text', updatePlanTextsFutureWeek[i].secondShift);
      }
      cy.task('log', `[Folder b - Dashboard Assert] Clicking cell0_${i}`);
      cy.get(cellId).click();
      cy.get('#planHours').scrollIntoView().should('be.visible');
      cy.task('log', `[Folder b - Dashboard Assert] Verifying planHours=${updatePlanTextsFutureWeek[i].calculatedHours}`);
      cy.get('#planHours').should('include.value', updatePlanTextsFutureWeek[i].calculatedHours);
      cy.get('[data-testid="plannedStartOfShift1"]').should('include.value', updatePlanTextsFutureWeek[i].plannedStartOfShift1);
      cy.get('[data-testid="plannedBreakOfShift1"]').should('include.value', updatePlanTextsFutureWeek[i].plannedBreakOfShift1);
      cy.get('[data-testid="plannedEndOfShift1"]').should('include.value', updatePlanTextsFutureWeek[i].plannedEndOfShift1);
      cy.get('[data-testid="plannedStartOfShift2"]').should('include.value', updatePlanTextsFutureWeek[i].plannedStartOfShift2);
      cy.get('[data-testid="plannedBreakOfShift2"]').should('include.value', updatePlanTextsFutureWeek[i].plannedBreakOfShift2);
      cy.get('[data-testid="plannedEndOfShift2"]').should('include.value', updatePlanTextsFutureWeek[i].plannedEndOfShift2);
      cy.task('log', '[Folder b - Dashboard Assert] Clicking cancel button');
      cy.get('#cancelButton').click();
    }
    cy.task('log', '[Folder b - Dashboard Assert] Test completed successfully');
  });
});
