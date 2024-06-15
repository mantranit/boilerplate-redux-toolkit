export const FormatCurrency = (number: number) => {
  return new Intl.NumberFormat("vn-VN", {
    style: "currency",
    currency: "VND",
  }).format(number);
};
