//@flow
type chalk$StyleElement = {
  open: string;
  close: string;
};

type chalk$Chain = chalk$Style & (...text: string[]) => string;

type chalk$Style = {
  // General
  reset: chalk$Chain;
  bold: chalk$Chain;
  dim: chalk$Chain;
  italic: chalk$Chain;
  underline: chalk$Chain;
  inverse: chalk$Chain;
  hidden: chalk$Chain;
  strikethrough: chalk$Chain;

  // Text colors
  black: chalk$Chain;
  red: chalk$Chain;
  green: chalk$Chain;
  yellow: chalk$Chain;
  blue: chalk$Chain;
  magenta: chalk$Chain;
  cyan: chalk$Chain;
  white: chalk$Chain;
  gray: chalk$Chain;
  grey: chalk$Chain;

  // Background colors
  bgBlack: chalk$Chain;
  bgRed: chalk$Chain;
  bgGreen: chalk$Chain;
  bgYellow: chalk$Chain;
  bgBlue: chalk$Chain;
  bgMagenta: chalk$Chain;
  bgCyan: chalk$Chain;
  bgWhite: chalk$Chain;
};

type chalk$StyleMap = {
  // General
  reset: chalk$StyleElement;
  bold: chalk$StyleElement;
  dim: chalk$StyleElement;
  italic: chalk$StyleElement;
  underline: chalk$StyleElement;
  inverse: chalk$StyleElement;
  strikethrough: chalk$StyleElement;
  hidden: chalk$StyleElement;

  // Text colors
  black: chalk$StyleElement;
  red: chalk$StyleElement;
  green: chalk$StyleElement;
  yellow: chalk$StyleElement;
  blue: chalk$StyleElement;
  magenta: chalk$StyleElement;
  cyan: chalk$StyleElement;
  white: chalk$StyleElement;
  gray: chalk$StyleElement;

  // Background colors
  bgBlack: chalk$StyleElement;
  bgRed: chalk$StyleElement;
  bgGreen: chalk$StyleElement;
  bgYellow: chalk$StyleElement;
  bgBlue: chalk$StyleElement;
  bgMagenta: chalk$StyleElement;
  bgCyan: chalk$StyleElement;
  bgWhite: chalk$StyleElement;
};

declare module 'chalk' {
  declare var enabled: boolean;
  declare var supportsColor: boolean;
  declare var styles: chalk$StyleMap;

  declare function stripColor(value: string): string;
  declare function hasColor(str: string): boolean;

  // General
  declare var reset: chalk$Chain;
  declare var bold: chalk$Chain;
  declare var dim: chalk$Chain;
  declare var italic: chalk$Chain;
  declare var underline: chalk$Chain;
  declare var inverse: chalk$Chain;
  declare var strikethrough: chalk$Chain;
  declare var hidden: chalk$Chain;

  // Text colors
  declare var black: chalk$Chain;
  declare var red: chalk$Chain;
  declare var green: chalk$Chain;
  declare var yellow: chalk$Chain;
  declare var blue: chalk$Chain;
  declare var magenta: chalk$Chain;
  declare var cyan: chalk$Chain;
  declare var white: chalk$Chain;
  declare var gray: chalk$Chain;
  declare var grey: chalk$Chain;

  // Background colors
  declare var bgBlack: chalk$Chain;
  declare var bgRed: chalk$Chain;
  declare var bgGreen: chalk$Chain;
  declare var bgYellow: chalk$Chain;
  declare var bgBlue: chalk$Chain;
  declare var bgMagenta: chalk$Chain;
  declare var bgCyan: chalk$Chain;
  declare var bgWhite: chalk$Chain;
}