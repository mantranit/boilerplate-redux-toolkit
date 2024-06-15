export const FormatCurrency = (number: number) => {
  return new Intl.NumberFormat("vn-VN", {
    style: "currency",
    currency: "VND",
  }).format(number);
};

export const isLossedMatch = (match: any) => {
  const forecastArr = match.forecast
    .split("-")
    .map((str: any) => parseFloat(str));
  const resultArr = match.result.split("-").map((str: any) => parseFloat(str));

  const forecastSub = forecastArr[0] - forecastArr[1];
  const resultSub = resultArr[0] - resultArr[1];
  if (
    !match.bet ||
    (match.bet === "awayName" && forecastSub < resultSub) ||
    (match.bet === "homeName" && forecastSub > resultSub)
  ) {
    return true;
  }
  return false;
};