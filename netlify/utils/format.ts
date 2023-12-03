export const dateToNumber = (date: Date) => {
  return Math.round(date.getTime() / 1000);
};

export const numberToDate = (number: number) => {
  return new Date(number * 1000);
};
