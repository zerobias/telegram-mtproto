declare var Intl: {
  Collator: Class<Collator>,
  DateTimeFormat: Class<DateTimeFormat>,
  NumberFormat: Class<NumberFormat>
}

declare class Collator {
  constructor (
    locales?: string | string[],
    options?: CollatorOptions
  ): Collator;

  static (
    locales?: string | string[],
    options?: CollatorOptions
  ): Collator;

  compare (a: string, b: string): number;
}

type CollatorOptions = {
  localeMatcher?: 'lookup' | 'best fit',
  usage?: 'sort' | 'search',
  sensitivity?: 'base' | 'accent' | 'case' | 'variant',
  ignorePunctuation?: boolean,
  numeric?: boolean,
  caseFirst?: 'upper' | 'lower' | 'false'
}

declare class DateTimeFormat {
  constructor (
    locales?: string | string[],
    options?: DateTimeFormatOptions
  ): DateTimeFormat;

  static (
    locales?: string | string[],
    options?: DateTimeFormatOptions
  ): DateTimeFormat;

  format (a: Date | number): string;
}

type DateTimeFormatOptions = {
  localeMatcher?: 'lookup' | 'best fit',
  timeZone?: string,
  hour12?: boolean,
  formatMatcher?: 'basic' | 'best fit',
  weekday?: 'narrow' | 'short' | 'long',
  era?: 'narrow' | 'short' | 'long',
  year?: 'numeric' | '2-digit',
  month?: 'numeric' | '2-digit' | 'narrow' | 'short' | 'long',
  day?: 'numeric' | '2-digit',
  hour?: 'numeric' | '2-digit',
  minute?: 'numeric' | '2-digit',
  second?: 'numeric' | '2-digit',
  timeZoneName?: 'short' | 'long'
}

declare class NumberFormat {
  constructor (
    locales?: string | string[],
    options?: NumberFormatOptions
  ): NumberFormat;

  static (
    locales?: string | string[],
    options?: NumberFormatOptions
  ): NumberFormat;

  format (a: number): string;
}

type NumberFormatOptions = {
  localeMatcher?: 'lookup' | 'best fit',
  style?: 'decimal' | 'currency' | 'percent',
  currency?: string,
  currencyDisplay?: 'symbol' | 'code' | 'name',
  useGrouping?: boolean,
  minimumIntegerDigits?: number,
  minimumFractionDigits?: number,
  maximumFractionDigits?: number,
  minimumSignificantDigits?: number,
  maximumSignificantDigits?: number
}