export const FormatCurrency = (number: number) => {
  return new Intl.NumberFormat("vn-VN").format(number);
};

export const isLossedMatch = (match: any) => {
  const resultArr = match.result.split("-").map((str: any) => parseFloat(str));
  const resultSub = resultArr[0] - resultArr[1];
  if (!match.forecast) {
    if (
      !match.bet ||
      (match.bet === "awayName" && resultSub > 0) ||
      (match.bet === "homeName" && resultSub < 0)
    ) {
      return true;
    }
    return false;
  }
  const forecastArr = match.forecast
    .split("-")
    .map((str: any) => parseFloat(str));

  const forecastSub = forecastArr[0] - forecastArr[1];
  if (
    !match.bet ||
    (match.bet === "awayName" && forecastSub < resultSub) ||
    (match.bet === "homeName" && forecastSub > resultSub)
  ) {
    return true;
  }
  return false;
};

export const isDisplay = (deposits: any[], deposit: number) => {
  const exist = deposits.find((obj: any) => obj.deposit === deposit);
  return exist && exist.display;
};

export const hasHistory = (deposits: any[]) => {
  const exist = deposits.find((obj: any) => !obj.display);
  return !!exist;
};
