import loginPage from '../../../Login.page';
import pluginPage from '../../../Plugin.page';
import TimePlanningWorkingHoursPage from "../TimePlanningWorkingHours.page";
import {selectDateRangeOnNewDatePicker} from "../../../helper-functions";



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
  { date: nextWeekDates[0], hours: 8, sumFlex: 68.45, nettoHours: 0, flex: -8, humanFlex: '68:27'},
  { date: nextWeekDates[1], hours: 8, sumFlex: 60.45, nettoHours: 0, flex: -8, humanFlex: '60:27'},
  { date: nextWeekDates[2], hours: 0, sumFlex: 60.45, nettoHours: 0, flex: 0, humanFlex: '60:27'},
  { date: nextWeekDates[3], hours: 0, sumFlex: 60.45, nettoHours: 0, flex: 0, humanFlex: '60:27'},
  { date: nextWeekDates[4], hours: 0, sumFlex: 60.45, nettoHours: 0, flex: 0, humanFlex: '60:27'},
  { date: nextWeekDates[5], hours: 8, sumFlex: 52.45, nettoHours: 0, flex: -8, humanFlex: '52:27'},
  { date: nextWeekDates[6], hours: 8, sumFlex: 44.45, nettoHours: 0, flex: -8, humanFlex: '44:27'},
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
  { date: futureWeekDates[0], hours: 2, sumFlex: 42.45, nettoHours: 0, flex: -2, humanFlex: '42:27'},
  { date: futureWeekDates[1], hours: 4, sumFlex: 38.45, nettoHours: 0, flex: -4, humanFlex: '38:27'},
  { date: futureWeekDates[2], hours: 0, sumFlex: 38.45, nettoHours: 0, flex: 0, humanFlex: '38:27'},
  { date: futureWeekDates[3], hours: 10, sumFlex: 28.45, nettoHours: 0, flex: -10, humanFlex: '28:27'},
  { date: futureWeekDates[4], hours: 12, sumFlex: 16.45, nettoHours: 0, flex: -12, humanFlex: '16:27'},
  { date: futureWeekDates[5], hours: 3, sumFlex: 13.45, nettoHours: 0, flex: -3, humanFlex: '13:27'},
  { date: futureWeekDates[6], hours: 8, sumFlex: 5.45, nettoHours: 0, flex: -8, humanFlex:' 5:27'},
]

const planTexts = [
  { date: lastWeekDates[0], text: '07:30-15:30', plannedHours: '8:00', flexBalanceToDate: 'Flex saldo til dato: 89:27', calculatedHours: '8', plannedStartOfShift1: '00:00', plannedEndOfShift1: '00:00', plannedBreakOfShift1: '00:00', plannedStartOfShift2: '', plannedEndOfShift2: '', plannedBreakOfShift2: '' },
  { date: lastWeekDates[1], text: '7:45-16:00/1', plannedHours: '8:00', flexBalanceToDate: 'Flex saldo til dato: 81:27', calculatedHours: '8', plannedStartOfShift1: '00:00', plannedEndOfShift1: '00:00', plannedBreakOfShift1: '00:00', plannedStartOfShift2: '', plannedEndOfShift2: '', plannedBreakOfShift2: '' },
  { date: lastWeekDates[2], text: '7:15-16:00/1;17-20/0,5', plannedHours: '8:00', flexBalanceToDate: 'Flex saldo til dato: 73:27', calculatedHours: '8', plannedStartOfShift1: '00:00', plannedEndOfShift1: '00:00', plannedBreakOfShift1: '00:00', plannedStartOfShift2: '00:00', plannedEndOfShift2: '00:00', plannedBreakOfShift2: '00:00' },
  { date: lastWeekDates[3], text: '6-12/½;18:00-20:00/0.5', plannedHours: '8:00', flexBalanceToDate: 'Flex saldo til dato: 65:27', calculatedHours: '8', plannedStartOfShift1: '00:00', plannedEndOfShift1: '00:00', plannedBreakOfShift1: '00:00', plannedStartOfShift2: '00:00', plannedEndOfShift2: '00:00', plannedBreakOfShift2: '00:00' },
  { date: lastWeekDates[4], text: '06:00-12:00/¾;18:00-20:00/0.5', plannedHours: '8:00', flexBalanceToDate: 'Flex saldo til dato: 57:27', calculatedHours: '8', plannedStartOfShift1: '00:00', plannedEndOfShift1: '00:00', plannedBreakOfShift1: '00:00', plannedStartOfShift2: '00:00', plannedEndOfShift2: '00:00', plannedBreakOfShift2: '00:00' },
  { date: lastWeekDates[5], text: '6-12/¾;18-20/¾', plannedHours: '8:00', flexBalanceToDate: 'Flex saldo til dato: 49:27', calculatedHours: '8', plannedStartOfShift1: '00:00', plannedEndOfShift1: '00:00', plannedBreakOfShift1: '00:00', plannedStartOfShift2: '00:00', plannedEndOfShift2: '00:00', plannedBreakOfShift2: '00:00' },
  { date: lastWeekDates[6], text: '6-14/½', plannedHours: '8:00', flexBalanceToDate: 'Flex saldo til dato: 41:27', calculatedHours: '8', plannedStartOfShift1: '00:00', plannedEndOfShift1: '00:00', plannedBreakOfShift1: '00:00', plannedStartOfShift2: '', plannedEndOfShift2: '', plannedBreakOfShift2: '' },
];

const updatePlanTexts = [
  { date: lastWeekDates[0], text: '07:30-15:30', plannedHours: '1:00', flexBalanceToDate: 'Flex saldo til dato: 96:27', calculatedHours: '1', plannedStartOfShift1: '00:00', plannedEndOfShift1: '00:00', plannedBreakOfShift1: '00:00', plannedStartOfShift2: '', plannedEndOfShift2: '', plannedBreakOfShift2: '' },
  { date: lastWeekDates[1], text: '7:45-16:00/1', plannedHours: '2:00', flexBalanceToDate: 'Flex saldo til dato: 94:27', calculatedHours: '2', plannedStartOfShift1: '00:00', plannedEndOfShift1: '00:00', plannedBreakOfShift1: '00:00', plannedStartOfShift2: '', plannedEndOfShift2: '', plannedBreakOfShift2: '' },
  { date: lastWeekDates[2], text: '7:15-16:00/1;17-20/0,5', plannedHours: '3:00', flexBalanceToDate: 'Flex saldo til dato: 91:27', calculatedHours: '3', plannedStartOfShift1: '00:00', plannedEndOfShift1: '00:00', plannedBreakOfShift1: '00:00', plannedStartOfShift2: '00:00', plannedEndOfShift2: '00:00', plannedBreakOfShift2: '00:00' },
  { date: lastWeekDates[3], text: '6-12/½;18:00-20:00/0.5', plannedHours: '', flexBalanceToDate: '', calculatedHours: '0', plannedStartOfShift1: '00:00', plannedEndOfShift1: '00:00', plannedBreakOfShift1: '00:00', plannedStartOfShift2: '00:00', plannedEndOfShift2: '00:00', plannedBreakOfShift2: '00:00' },
  { date: lastWeekDates[4], text: '06:00-12:00/¾;18:00-20:00/0.5', plannedHours: '4:00', flexBalanceToDate: 'Flex saldo til dato: 87:27', calculatedHours: '4', plannedStartOfShift1: '00:00', plannedEndOfShift1: '00:00', plannedBreakOfShift1: '00:00', plannedStartOfShift2: '00:00', plannedEndOfShift2: '00:00', plannedBreakOfShift2: '00:00' },
  { date: lastWeekDates[5], text: '6-12/¾;18-20/¾', plannedHours: '5:00', flexBalanceToDate: 'Flex saldo til dato: 82:27', calculatedHours: '5', plannedStartOfShift1: '00:00', plannedEndOfShift1: '00:00', plannedBreakOfShift1: '00:00', plannedStartOfShift2: '00:00', plannedEndOfShift2: '00:00', plannedBreakOfShift2: '00:00' },
  { date: lastWeekDates[6], text: '6-14/½', plannedHours: '6:00', flexBalanceToDate: 'Flex saldo til dato: 76:27', calculatedHours: '6', plannedStartOfShift1: '00:00', plannedEndOfShift1: '00:00', plannedBreakOfShift1: '00:00', plannedStartOfShift2: '', plannedEndOfShift2: '', plannedBreakOfShift2: '' },
];

const planTextsNextWeek = [
  { date: nextWeekDates[0], text: '07:30-15:30', firstShift: '07:30 - 15:30 / 00:00', plannedHours: '8:00', flexBalanceToDate: 'Flex saldo til dato: 33:27', calculatedHours: '8', plannedStartOfShift1: '07:30', plannedEndOfShift1: '15:30', plannedBreakOfShift1: '00:00', plannedStartOfShift2: '', plannedEndOfShift2: '', plannedBreakOfShift2: '' },
  { date: nextWeekDates[1], text: '7:45-16:00/1', firstShift: '07:45 - 16:00 / 01:00', plannedHours: '8:00', flexBalanceToDate: 'Flex saldo til dato: 25:27', calculatedHours: '7.25', plannedStartOfShift1: '07:45', plannedEndOfShift1: '16:00', plannedBreakOfShift1: '01:00', plannedStartOfShift2: '', plannedEndOfShift2: '', plannedBreakOfShift2: '' },
  { date: nextWeekDates[2], text: '7:15-16:00/1;17-20/0,5', firstShift: '07:15 - 16:00 / 01:00', secondShift: '17:00 - 20:00 / 00:30', plannedHours: '8:00', flexBalanceToDate: 'Flex saldo til dato: 17:27', calculatedHours: '10.25', plannedStartOfShift1: '07:15', plannedEndOfShift1: '16:00', plannedBreakOfShift1: '01:00', plannedStartOfShift2: '17:00', plannedEndOfShift2: '20:00', plannedBreakOfShift2: '00:30' },
  { date: nextWeekDates[3], text: '6-12/½;18:00-20:00/0.5', firstShift: '06:00 - 12:00 / 00:30', secondShift: '18:00 - 20:00 / 00:30', plannedHours: '8:00', flexBalanceToDate: 'Flex saldo til dato: 9:27', calculatedHours: '7', plannedStartOfShift1: '06:00', plannedEndOfShift1: '12:00', plannedBreakOfShift1: '00:30', plannedStartOfShift2: '18:00', plannedEndOfShift2: '20:00', plannedBreakOfShift2: '00:30' },
  { date: nextWeekDates[4], text: '06:00-12:00/¾;18:00-20:00/0.5', firstShift: '06:00 - 12:00 / 00:45', secondShift: '18:00 - 20:00 / 00:30', plannedHours: '8:00', flexBalanceToDate: 'Flex saldo til dato: 1:27', calculatedHours: '7', plannedStartOfShift1: '06:00', plannedEndOfShift1: '12:00', plannedBreakOfShift1: '00:45', plannedStartOfShift2: '18:00', plannedEndOfShift2: '20:00', plannedBreakOfShift2: '00:30' },
  { date: nextWeekDates[5], text: '6-12/¾;18-20/¾', firstShift: '06:00 - 12:00 / 00:45', secondShift: '18:00 - 20:00 / 00:45', plannedHours: '8:00', flexBalanceToDate: 'Flex saldo til dato: -6:33', calculatedHours: '6.5', plannedStartOfShift1: '06:00', plannedEndOfShift1: '12:00', plannedBreakOfShift1: '00:45', plannedStartOfShift2: '18:00', plannedEndOfShift2: '20:00', plannedBreakOfShift2: '00:45' },
  { date: lastWeekDates[6], text: '6-14/½', firstShift: '06:00 - 14:00 / 00:30', plannedHours: '8:00', flexBalanceToDate: 'Flex saldo til dato: -14:33', calculatedHours: '7.5', plannedStartOfShift1: '06:00', plannedEndOfShift1: '14:00', plannedBreakOfShift1: '00:30', plannedStartOfShift2: '', plannedEndOfShift2: '', plannedBreakOfShift2: '' },
];

const updatePlanTextsNextWeek = [
  { date: nextWeekDates[0], text: '07:30-15:30', firstShift: '07:30 - 15:30 / 00:00', plannedHours: '8:00', flexBalanceToDate: 'Flex saldo til dato: 33:27', calculatedHours: '8', plannedStartOfShift1: '07:30', plannedEndOfShift1: '15:30', plannedBreakOfShift1: '00:00', plannedStartOfShift2: '', plannedEndOfShift2: '', plannedBreakOfShift2: '' },
  { date: nextWeekDates[1], text: '7:45-16:00/1', firstShift: '07:45 - 16:00 / 01:00', plannedHours: '8:00', flexBalanceToDate: 'Flex saldo til dato: 25:27', calculatedHours: '7.25', plannedStartOfShift1: '07:45', plannedEndOfShift1: '16:00', plannedBreakOfShift1: '01:00', plannedStartOfShift2: '', plannedEndOfShift2: '', plannedBreakOfShift2: '' },
  { date: nextWeekDates[2], text: '7:15-16:00/1;17-20/0,5', firstShift: '07:15 - 16:00 / 01:00', secondShift: '17:00 - 20:00 / 00:30', plannedHours: '8:00', flexBalanceToDate: 'Flex saldo til dato: 17:27', calculatedHours: '10.25', plannedStartOfShift1: '07:15', plannedEndOfShift1: '16:00', plannedBreakOfShift1: '01:00', plannedStartOfShift2: '17:00', plannedEndOfShift2: '20:00', plannedBreakOfShift2: '00:30' },
  { date: nextWeekDates[3], text: '6-12/½;18:00-20:00/0.5', firstShift: '06:00 - 12:00 / 00:30', secondShift: '18:00 - 20:00 / 00:30', plannedHours: '8:00', flexBalanceToDate: 'Flex saldo til dato: 9:27', calculatedHours: '7', plannedStartOfShift1: '06:00', plannedEndOfShift1: '12:00', plannedBreakOfShift1: '00:30', plannedStartOfShift2: '18:00', plannedEndOfShift2: '20:00', plannedBreakOfShift2: '00:30' },
  { date: nextWeekDates[4], text: '06:00-12:00/¾;18:00-20:00/0.5', firstShift: '06:00 - 12:00 / 00:45', secondShift: '18:00 - 20:00 / 00:30', plannedHours: '8:00', flexBalanceToDate: 'Flex saldo til dato: 1:27', calculatedHours: '7', plannedStartOfShift1: '06:00', plannedEndOfShift1: '12:00', plannedBreakOfShift1: '00:45', plannedStartOfShift2: '18:00', plannedEndOfShift2: '20:00', plannedBreakOfShift2: '00:30' },
  { date: nextWeekDates[5], text: '6-12/¾;18-20/¾', firstShift: '06:00 - 12:00 / 00:45', secondShift: '18:00 - 20:00 / 00:45', plannedHours: '8:00', flexBalanceToDate: 'Flex saldo til dato: -6:33', calculatedHours: '6.5', plannedStartOfShift1: '06:00', plannedEndOfShift1: '12:00', plannedBreakOfShift1: '00:45', plannedStartOfShift2: '18:00', plannedEndOfShift2: '20:00', plannedBreakOfShift2: '00:45' },
  { date: lastWeekDates[6], text: '6-14/½', firstShift: '06:00 - 14:00 / 00:30', plannedHours: '8:00', flexBalanceToDate: 'Flex saldo til dato: -14:33', calculatedHours: '7.5', plannedStartOfShift1: '06:00', plannedEndOfShift1: '14:00', plannedBreakOfShift1: '00:30', plannedStartOfShift2: '', plannedEndOfShift2: '', plannedBreakOfShift2: '' },
];

const planTextsFutureWeek = [
  { date: futureWeekDates[0], text: '07:30-15:30;foobar', firstShift: '07:30 - 15:30 / 00:00', plannedHours: '8:00', flexBalanceToDate: 'Flex saldo til dato: -22:33', calculatedHours: '8', plannedStartOfShift1: '07:30', plannedEndOfShift1: '15:30', plannedBreakOfShift1: '00:00', plannedStartOfShift2: '', plannedEndOfShift2: '', plannedBreakOfShift2: '' },
  { date: futureWeekDates[1], text: '7:45-16/0.75', firstShift: '07:45 - 16:00 / 00:45', plannedHours: '8:00', flexBalanceToDate: 'Flex saldo til dato: -30:33', calculatedHours: '7.5', plannedStartOfShift1: '07:45', plannedEndOfShift1: '16:00', plannedBreakOfShift1: '00:45', plannedStartOfShift2: '', plannedEndOfShift2: '', plannedBreakOfShift2: '' },
  { date: futureWeekDates[2], text: 'foo bar', plannedHours: '16:00', flexBalanceToDate: 'Flex saldo til dato: -46:33', calculatedHours: '16', plannedStartOfShift1: '', plannedEndOfShift1: '', plannedBreakOfShift1: '', plannedStartOfShift2: '', plannedEndOfShift2: '', plannedBreakOfShift2: '' },
  { date: futureWeekDates[3], text: '6-12;18:00-20:00', firstShift: '06:00 - 12:00 / 00:00', secondShift: '18:00 - 20:00 / 00:00', plannedHours: '8:00', flexBalanceToDate: 'Flex saldo til dato: -54:33', calculatedHours: '8', plannedStartOfShift1: '06:00', plannedEndOfShift1: '12:00', plannedBreakOfShift1: '00:00', plannedStartOfShift2: '18:00', plannedEndOfShift2: '20:00', plannedBreakOfShift2: '00:00' },
  { date: futureWeekDates[4], text: ' ', plannedHours: '8:00', flexBalanceToDate: 'Flex saldo til dato: -62:33', calculatedHours: '8', plannedStartOfShift1: '', plannedEndOfShift1: '', plannedBreakOfShift1: '', plannedStartOfShift2: '', plannedEndOfShift2: '', plannedBreakOfShift2: '' },
  { date: futureWeekDates[5], text: '6-12/¾;18-20/¾', firstShift: '06:00 - 12:00 / 00:45', secondShift: '18:00 - 20:00 / 00:45', plannedHours: '8:00', flexBalanceToDate: 'Flex saldo til dato: -70:33', calculatedHours: '6.5', plannedStartOfShift1: '06:00', plannedEndOfShift1: '12:00', plannedBreakOfShift1: '00:45', plannedStartOfShift2: '18:00', plannedEndOfShift2: '20:00', plannedBreakOfShift2: '00:45' },
  { date: futureWeekDates[6], text: '6-14/½', firstShift: '06:00 - 14:00 / 00:30', plannedHours: '8:00', flexBalanceToDate: 'Flex saldo til dato: -78:33', calculatedHours: '7.5', plannedStartOfShift1: '06:00', plannedEndOfShift1: '14:00', plannedBreakOfShift1: '00:30', plannedStartOfShift2: '', plannedEndOfShift2: '', plannedBreakOfShift2: '' },
];

const updatePlanTextsFutureWeek = [
  { date: futureWeekDates[0], text: '07:30-15:30;foobar', firstShift: '07:30 - 15:30 / 00:00', plannedHours: '8:00', flexBalanceToDate: 'Flex saldo til dato: -22:33', calculatedHours: '8', plannedStartOfShift1: '07:30', plannedEndOfShift1: '15:30', plannedBreakOfShift1: '00:00', plannedStartOfShift2: '', plannedEndOfShift2: '', plannedBreakOfShift2: '' },
  { date: futureWeekDates[1], text: '7:45-16/0.75', firstShift: '07:45 - 16:00 / 00:45', plannedHours: '8:00', flexBalanceToDate: 'Flex saldo til dato: -30:33', calculatedHours: '7.5', plannedStartOfShift1: '07:45', plannedEndOfShift1: '16:00', plannedBreakOfShift1: '00:45', plannedStartOfShift2: '', plannedEndOfShift2: '', plannedBreakOfShift2: '' },
  { date: futureWeekDates[2], text: 'foo bar', plannedHours: '', flexBalanceToDate: 'Flex saldo til dato: -46:33', calculatedHours: '0', plannedStartOfShift1: '', plannedEndOfShift1: '', plannedBreakOfShift1: '', plannedStartOfShift2: '', plannedEndOfShift2: '', plannedBreakOfShift2: '' },
  { date: futureWeekDates[3], text: '6-12;18:00-20:00', firstShift: '06:00 - 12:00 / 00:00', secondShift: '18:00 - 20:00 / 00:00', plannedHours: '8:00', flexBalanceToDate: 'Flex saldo til dato: -54:33', calculatedHours: '8', plannedStartOfShift1: '06:00', plannedEndOfShift1: '12:00', plannedBreakOfShift1: '00:00', plannedStartOfShift2: '18:00', plannedEndOfShift2: '20:00', plannedBreakOfShift2: '00:00' },
  { date: futureWeekDates[4], text: ' ', plannedHours: '12:00', flexBalanceToDate: 'Flex saldo til dato: -62:33', calculatedHours: '12', plannedStartOfShift1: '', plannedEndOfShift1: '', plannedBreakOfShift1: '', plannedStartOfShift2: '', plannedEndOfShift2: '', plannedBreakOfShift2: '' },
  { date: futureWeekDates[5], text: '6-12/¾;18-20/¾', firstShift: '06:00 - 12:00 / 00:45', secondShift: '18:00 - 20:00 / 00:45', plannedHours: '8:00', flexBalanceToDate: 'Flex saldo til dato: -70:33', calculatedHours: '6.5', plannedStartOfShift1: '06:00', plannedEndOfShift1: '12:00', plannedBreakOfShift1: '00:45', plannedStartOfShift2: '18:00', plannedEndOfShift2: '20:00', plannedBreakOfShift2: '00:45' },
  { date: futureWeekDates[6], text: '6-14/½', firstShift: '06:00 - 14:00 / 00:30', plannedHours: '8:00', flexBalanceToDate: 'Flex saldo til dato: -78:33', calculatedHours: '7.5', plannedStartOfShift1: '06:00', plannedEndOfShift1: '14:00', plannedBreakOfShift1: '00:30', plannedStartOfShift2: '', plannedEndOfShift2: '', plannedBreakOfShift2: '' },
];


describe('Dashboard edit values', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
  });

  it('should enable auto break calculations with empty values', () => {
    pluginPage.Navbar.goToPluginsPage();
    cy.get('#actionMenu')
      .scrollIntoView().should('be.visible')
      .click({ force: true });
    cy.intercept('GET', '**/api/time-planning-pn/settings').as('settings-get');
    cy.get('#plugin-settings-link0').click();
    cy.wait('@settings-get', { timeout: 60000 });
    // autoBreakCalculationActiveToggle-button
    cy.get('#autoBreakCalculationActiveToggle-button').invoke('attr', 'aria-checked').then(currentState => {
      cy.log('state: ' + currentState);
      expect(currentState).to.be.oneOf(['true', 'false']);
      if (currentState === 'false') {
        cy.log('current state is false, clicking to enable');
        cy.get('#autoBreakCalculationActiveToggle-button').click();
      }
    });
    cy.intercept('PUT', '**/api/time-planning-pn/settings').as('settings-update');
    cy.get('#saveSettings').click();
    cy.wait('@settings-update', { timeout: 60000 });
    cy.intercept('POST', '**/api/time-planning-pn/plannings/index').as('index-update');
    cy.get('mat-nested-tree-node').contains('Timeregistrering').click();
    cy.get('mat-tree-node').contains('Dashboard').click();
    cy.wait('@index-update', { timeout: 60000 });
    // Wait for spinner after index update
    cy.get('body').then(($body) => {
      if ($body.find('.overlay-spinner').length > 0) {
        cy.task('log', '[Folder c] Spinner detected after index-update, waiting...');
        cy.get('.overlay-spinner', {timeout: 30000}).should('not.be.visible');
      }
    });
    cy.get('#firstColumn0').click();
    cy.get('#useGoogleSheetAsDefault > div > div > input').invoke('attr', 'class').then(currentState => {
      cy.log('class: ' + currentState);
      // expect(currentState).to.be.oneOf(['true', 'false']);
      if (currentState !== 'mdc-checkbox__native-control mdc-checkbox--selected') {
        cy.log('current state is false, clicking to enable');
        cy.get('#useGoogleSheetAsDefault').click();
      }
    });
    cy.get('#autoBreakCalculationActive > div > div > input').invoke('attr', 'class').then(currentState => {
      cy.log('class: ' + currentState);
      // expect(currentState).to.be.oneOf(['true', 'false']);
      if (currentState !== 'mdc-checkbox__native-control mdc-checkbox--selected') {
        cy.log('current state is false, clicking to enable');
        cy.get('#autoBreakCalculationActive').click();
      }
    });
  });

  it('should enable auto break calculations with values', () => {
    cy.get('mat-nested-tree-node').contains('Timeregistrering').click();
    cy.get('mat-tree-node').contains('Timeregistrering').click();
    cy.get('mat-toolbar > div > button .mat-mdc-button-persistent-ripple').first().parent().click();
    cy.get('#workingHoursSite').clear().type('c d');
    cy.get('.ng-option.ng-option-marked').click();
    cy.intercept('POST', '**/api/time-planning-pn/working-hours/index').as('update');
    TimePlanningWorkingHoursPage.dateFormInput().click();
    selectDateRangeOnNewDatePicker(
      filters[0].dateRange.yearFrom, filters[0].dateRange.monthFrom,  filters[0].dateRange.dayFrom,
      filters[0].dateRange.yearTo, filters[0].dateRange.monthTo, filters[0].dateRange.dayTo
    );
    cy.wait('@update');
    cy.get('#sumFlex0 input').should('contain.value', '97.45');
    for (let i = 0; i < planHours.length; i++) {
      let id = `#planHours${i+1}`;
      cy.get(id).find('input').clear().type(planHours[i].hours.toString());
      let sumFlexId = `#sumFlex${i+1}`;
      cy.get(sumFlexId).find('input').should('contain.value', planHours[i].sumFlex.toString());
      let nettoHoursId = `#nettoHours${i+1}`;
      cy.get(nettoHoursId).find('input').should('contain.value', planHours[i].nettoHours.toString());
      let flexId = `#flexHours${i+1}`;
      cy.get(flexId).find('input').should('contain.value', planHours[i].flex.toString());
    }
    for (let i = 0; i < planTexts.length; i++) {
      let id = `#planText${i+1}`;
      cy.get(id).find('input').clear().type(planTexts[i].text);
    }

    cy.intercept('PUT', '**/api/time-planning-pn/working-hours').as('save');
    cy.get('#workingHoursSave').click();
    cy.wait('@save');
    cy.get('#sumFlex7 input').should('contain.value', '41.45');

    cy.intercept('POST', '**/api/time-planning-pn/working-hours/index').as('update');
    TimePlanningWorkingHoursPage.dateFormInput().click();
    selectDateRangeOnNewDatePicker(
      filtersNextWeek[0].dateRange.yearFrom, filtersNextWeek[0].dateRange.monthFrom,  filtersNextWeek[0].dateRange.dayFrom,
      filtersNextWeek[0].dateRange.yearTo, filtersNextWeek[0].dateRange.monthTo, filtersNextWeek[0].dateRange.dayTo
    );
    cy.wait('@update');
    cy.get('#sumFlex0 input').should('contain.value', '41.45');
    cy.get('#nettoHours0 input').should('contain.value', '0');

    for (let i = 0; i < planHoursNextWeek.length; i++) {
      let id = `#planHours${i+1}`;
      cy.get(id).find('input').clear().type(planHoursNextWeek[i].hours.toString());
      let sumFlexId = `#sumFlex${i+1}`;
      cy.get(sumFlexId).find('input').should('contain.value', planHoursNextWeek[i].sumFlex.toString());
      let nettoHoursId = `#nettoHours${i+1}`;
      cy.get(nettoHoursId).find('input').should('contain.value', planHoursNextWeek[i].nettoHours.toString());
      let flexId = `#flexHours${i+1}`;
      cy.get(flexId).find('input').should('contain.value', planHoursNextWeek[i].flex.toString());
    }
    for (let i = 0; i < planTextsNextWeek.length; i++) {
      let id = `#planText${i+1}`;
      cy.get(id).find('input').clear().type(planTextsNextWeek[i].text);
    }

    cy.intercept('PUT', '**/api/time-planning-pn/working-hours').as('save');
    cy.get('#workingHoursSave').click();
    cy.wait('@save');
    cy.get('#sumFlex7 input').should('contain.value', '-14.55');
    // cy.intercept('POST', '**/api/time-planning-pn/plannings/index').as('index-update');
    // cy.get('mat-nested-tree-node').contains('Timeregistrering').click();
    // cy.get('mat-tree-node').contains('Dashboard').click();
    // cy.wait('@index-update', { timeout: 60000 });
    // cy.get('#firstColumn0').click();
    // cy.get('#mat-tab-group-0-label-1').click();
    // cy.get('#mondayLoadDefaults').click();
    // cy.get('#mondayBreakMinutesDivider').should('have.value', '03:00');
    // cy.get('#mondayBreakMinutesPrDivider').should('have.value', '00:30');
    // cy.get('#mondayBreakMinutesUpperLimit').should('have.value', '01:00');
    // cy.get('#tuesdayLoadDefaults').click();
    // cy.get('#tuesdayBreakMinutesDivider').should('have.value', '03:00');
    // cy.get('#tuesdayBreakMinutesPrDivider').should('have.value', '00:30');
    // cy.get('#tuesdayBreakMinutesUpperLimit').should('have.value', '01:00');
    // cy.get('#wednesdayLoadDefaults').click();
    // cy.get('#wednesdayBreakMinutesDivider').should('have.value', '03:00');
    // cy.get('#wednesdayBreakMinutesPrDivider').should('have.value', '00:30');
    // cy.get('#wednesdayBreakMinutesUpperLimit').should('have.value', '01:00');
    // cy.get('#thursdayLoadDefaults').click();
    // cy.get('#thursdayBreakMinutesDivider').should('have.value', '03:00');
    // cy.get('#thursdayBreakMinutesPrDivider').should('have.value', '00:30');
    // cy.get('#thursdayBreakMinutesUpperLimit').should('have.value', '01:00');
    // cy.get('#fridayLoadDefaults').click();
    // cy.get('#fridayBreakMinutesDivider').should('have.value', '03:00');
    // cy.get('#fridayBreakMinutesPrDivider').should('have.value', '00:30');
    // cy.get('#fridayBreakMinutesUpperLimit').should('have.value', '01:00');
    // cy.get('#saturdayLoadDefaults').click();
    // cy.get('#saturdayBreakMinutesDivider').should('have.value', '02:00');
    // cy.get('#saturdayBreakMinutesPrDivider').should('have.value', '00:30');
    // cy.get('#saturdayBreakMinutesUpperLimit').should('have.value', '01:00');
    // cy.get('#sundayLoadDefaults').click();
    // cy.get('#sundayBreakMinutesDivider').should('have.value', '02:00');
    // cy.get('#sundayBreakMinutesPrDivider').should('have.value', '00:30');
    // cy.get('#sundayBreakMinutesUpperLimit').should('have.value', '01:00');
    // cy.intercept('PUT', '**/api/time-planning-pn/settings/assigned-site').as('assigned-site-update');
    // cy.get('#saveButton').click();
    // cy.wait('@assigned-site-update', { timeout: 60000 });
    // cy.intercept('GET', '**/api/time-planning-pn/settings/assigned-sites?*').as('assigned-site-get');
    // cy.get('#firstColumn0').click();
    // cy.wait('@assigned-site-get', { timeout: 60000 });
    // cy.get('#mat-tab-group-1-label-1').click();
    // cy.get('#mondayBreakMinutesDivider').should('have.value', '03:00');
    // cy.get('#mondayBreakMinutesPrDivider').should('have.value', '00:30');
    // cy.get('#mondayBreakMinutesUpperLimit').should('have.value', '01:00');
    // cy.get('#tuesdayBreakMinutesDivider').should('have.value', '03:00');
    // cy.get('#tuesdayBreakMinutesPrDivider').should('have.value', '00:30');
    // cy.get('#tuesdayBreakMinutesUpperLimit').should('have.value', '01:00');
    // cy.get('#wednesdayBreakMinutesDivider').should('have.value', '03:00');
    // cy.get('#wednesdayBreakMinutesPrDivider').should('have.value', '00:30');
    // cy.get('#wednesdayBreakMinutesUpperLimit').should('have.value', '01:00');
    // cy.get('#thursdayBreakMinutesDivider').should('have.value', '03:00');
    // cy.get('#thursdayBreakMinutesPrDivider').should('have.value', '00:30');
    // cy.get('#thursdayBreakMinutesUpperLimit').should('have.value', '01:00');
    // cy.get('#fridayBreakMinutesDivider').should('have.value', '03:00');
    // cy.get('#fridayBreakMinutesPrDivider').should('have.value', '00:30');
    // cy.get('#fridayBreakMinutesUpperLimit').should('have.value', '01:00');
    // cy.get('#saturdayBreakMinutesDivider').should('have.value', '02:00');
    // cy.get('#saturdayBreakMinutesPrDivider').should('have.value', '00:30');
    // cy.get('#saturdayBreakMinutesUpperLimit').should('have.value', '01:00');
    // cy.get('#sundayBreakMinutesDivider').should('have.value', '02:00');
    // cy.get('#sundayBreakMinutesPrDivider').should('have.value', '00:30');
    // cy.get('#sundayBreakMinutesUpperLimit').should('have.value', '01:00');
  });
});
