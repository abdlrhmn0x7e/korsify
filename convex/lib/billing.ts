export const BASE_AMOUNT_CENTS = 50000; // 500 EGP
const COST_PER_MINUTE_CENTS = 100; // 1 EGP per minute

export function calculateAmountCents(totalDurationSeconds: number): number {
  const totalMinutes = Math.ceil(totalDurationSeconds / 60);
  return BASE_AMOUNT_CENTS + totalMinutes * COST_PER_MINUTE_CENTS;
}
