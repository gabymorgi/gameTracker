export const dateToNumber = (date: Date) => {
  return Math.round(date.getTime() / 1000);
};
