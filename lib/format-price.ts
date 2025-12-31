export function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
  }).format(amount);
}
