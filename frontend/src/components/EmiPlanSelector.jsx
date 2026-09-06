import { formatINR } from "../utils/format";
import "../styles/components/EmiPlanSelector.css";

export default function EmiPlanSelector({ plans, selectedTenure, onSelect }) {
  if (!plans?.length) {
    return <p className="emi-plan-selector__empty">No EMI plans available for this product.</p>;
  }

  return (
    <div className="emi-plan-selector">
      {plans.map((plan) => {
        const isActive = selectedTenure === plan.tenureMonths;
        return (
          <button
            key={plan.tenureMonths}
            type="button"
            className={`emi-plan-selector__card ${isActive ? "emi-plan-selector__card--active" : ""}`}
            onClick={() => onSelect(plan.tenureMonths)}
          >
            <div className="emi-plan-selector__radio">
              {isActive && <span className="emi-plan-selector__radio-dot" />}
            </div>

            <div className="emi-plan-selector__details">
              <p className="emi-plan-selector__tenure">{plan.tenureMonths} months</p>
              <p className="emi-plan-selector__meta">
                {plan.processingFee > 0
                  ? `+ ${formatINR(plan.processingFee)} processing fee`
                  : "No processing fee · 0% interest"}
              </p>
            </div>

            <div className="emi-plan-selector__amount">
              <p className="emi-plan-selector__monthly">{formatINR(plan.monthlyAmount)}</p>
              <p className="emi-plan-selector__per-month">per month</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
