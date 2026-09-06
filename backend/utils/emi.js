/**
 * 1Fi's marketplace EMI model, per the product's marketing (see the
 * "No-cost EMIs / pay later using mutual funds" banner): no interest
 * is charged, the loan is simply collateralised against the user's
 * mutual fund holdings. A small flat processing fee is modelled here
 * since that is standard even for zero-interest plans; set to 0 to
 * turn it off entirely.
 */
const PROCESSING_FEE_FLAT = 0; // INR, applied once per plan, not per month
const PROCESSING_FEE_PERCENT = 0; // e.g. 0.5 for 0.5% of unit price

/**
 * Builds the list of EMI plans a product can be bought under.
 * @param {number} unitPrice - price after variant price deltas are applied
 * @param {number[]} tenures - allowed tenures in months, e.g. [3,6,9,12]
 */
export function buildEmiPlans(unitPrice, tenures) {
  return tenures
    .slice()
    .sort((a, b) => a - b)
    .map((tenureMonths) => {
      const processingFee =
        PROCESSING_FEE_FLAT + Math.round((PROCESSING_FEE_PERCENT / 100) * unitPrice);
      const monthlyAmount = Math.round(unitPrice / tenureMonths);

      return {
        tenureMonths,
        monthlyAmount,
        processingFee,
        totalPayable: monthlyAmount * tenureMonths + processingFee,
        interestRate: 0,
      };
    });
}
