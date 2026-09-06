import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LoadingState, ErrorState } from "../components/StatusStates";
import { formatINR } from "../utils/format";
import "../styles/pages/OrderConfirmationPage.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    fetch(`${BASE_URL}/orders/${orderId}`)
      .then((res) => res.json())
      .then((body) => {
        if (!body.success) throw new Error(body.message);
        setOrder(body.data);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  }, [orderId]);

  if (status === "loading") return <LoadingState label="Confirming your plan..." />;
  if (status === "error") return <ErrorState message="Couldn't load this order." />;

  return (
    <div className="order-confirmation">
      <div className="order-confirmation__icon">✅</div>
      <h1 className="order-confirmation__title">Plan Selected!</h1>
      <p className="order-confirmation__subtitle">{order.productName}</p>

      <div className="order-confirmation__card">
        <div className="order-confirmation__row">
          <span>Monthly amount</span>
          <span>{formatINR(order.monthlyAmount)}</span>
        </div>
        <div className="order-confirmation__row">
          <span>Tenure</span>
          <span>{order.tenureMonths} months</span>
        </div>
        <div className="order-confirmation__row">
          <span>Processing fee</span>
          <span>{formatINR(order.processingFee)}</span>
        </div>
      </div>

      <button
        type="button"
        className="order-confirmation__button"
        onClick={() => navigate("/shop?tab=marketplace")}
      >
        Back to Shop
      </button>
    </div>
  );
}