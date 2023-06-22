import {Locale} from 'date-fns';
import {da} from 'date-fns/locale';

export const customDaLocale: Locale = {
  ...da,
  formatLong: {
    ...da.formatLong,
    date: buildFormatLongFn({
      formats: {
        full: 'EEEE, d MMMM y',
        long: 'd MMMM y',
        medium: 'd MMM y',
        short: 'dd.MM.y',
      },
      defaultWidth: 'full',
    }),
  },
  localize: {
    ...da.localize,
    ordinalNumber: (
      dirtyNumber,
      _options
    ) => Number(dirtyNumber).toString(),
    month: buildLocalizeFn({
      values: {
        narrow: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'] as const,
        abbreviated: [
          'jan',
          'feb',
          'mar',
          'apr',
          'maj',
          'jun',
          'jul',
          'aug',
          'sep',
          'okt',
          'nov',
          'dec',
        ] as const,
        wide: [
          'januar',
          'februar',
          'marts',
          'april',
          'maj',
          'juni',
          'juli',
          'august',
          'september',
          'oktober',
          'november',
          'december',
        ] as const,
      },
      defaultWidth: 'wide',
    }),
  }
};

/// https://github.com/date-fns/date-fns/blob/main/src/locale/_lib/buildLocalizeFn/index.ts
function buildLocalizeFn(args) {
  return (dirtyIndex, options) => {
    const context = options?.context ? String(options.context) : 'standalone'

    let valuesArray
    if (context === 'formatting' && args.formattingValues) {
      const defaultWidth = args.defaultFormattingWidth || args.defaultWidth
      const width = (options?.width
        ? String(options.width)
        : defaultWidth)
      valuesArray = (args.formattingValues[width] ||
        args.formattingValues[defaultWidth])
    } else {
      const defaultWidth = args.defaultWidth
      const width = (options?.width
        ? String(options.width)
        : args.defaultWidth)
      valuesArray = (args.values[width] ||
        args.values[defaultWidth])
    }
    const index = (args.argumentCallback
      ? args.argumentCallback(dirtyIndex)
      : ((dirtyIndex) as unknown))
    return valuesArray[index]
  }
}

function buildFormatLongFn(args) {
  return (options = {}) => {
    // @ts-ignore
    const width = options.width
      // @ts-ignore
      ? (String(options.width) as FormatLongWidth)
      : args.defaultWidth
    const format = args.formats[width] || args.formats[args.defaultWidth]
    return format
  }
}
