export const firstCharToUppercase = (value: string): string =>
  `${value.charAt(0).toLocaleUpperCase()}${value.substring(1)}`;
