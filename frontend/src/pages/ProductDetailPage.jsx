import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import VariantSelector from "../components/VariantSelector";
import EmiPlanSelector from "../components/EmiPlanSelector";
import { LoadingState, ErrorState } from "../components/StatusStates";
import { fetchProductById, fetchEmiPlans, createOrder } from "../api/marketplaceApi";
import { formatINR } from "../utils/format";
import "../styles/pages/ProductDetailPage.css";

// Dummy customer feedback — no backend endpoint for reviews yet.
const DUMMY_REVIEWS = [
  {
    id: "r1",
    name: "Ananya Sharma",
    rating: 5,
    date: "2 weeks ago",
    verified: true,
    comment:
      "Great product for the price. The EMI checkout was super smooth and approval was instant. Highly recommend!",
  },
  {
    id: "r2",
    name: "Rohit Verma",
    rating: 4,
    date: "1 month ago",
    verified: true,
    comment:
      "Works exactly as described. Delivery took a couple of extra days but the quality makes up for it.",
  },
  {
    id: "r3",
    name: "Priya Nair",
    rating: 5,
    date: "1 month ago",
    verified: false,
    comment:
      "Loved how easy it was to compare variants and pick an EMI plan that fit my budget. Will buy again.",
  },
  {
    id: "r4",
    name: "Karthik Iyer",
    rating: 3,
    date: "2 months ago",
    verified: true,
    comment:
      "Decent overall. Packaging could be better, but customer support resolved my query quickly.",
  },
];

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [errorMessage, setErrorMessage] = useState("");

  const [selectedVariants, setSelectedVariants] = useState({});
  const [emiData, setEmiData] = useState(null); // { unitPrice, plans }
  const [emiStatus, setEmiStatus] = useState("idle");
  const [selectedTenure, setSelectedTenure] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Load the product once on mount.
  useEffect(() => {
    setStatus("loading");
    fetchProductById(id)
      .then((data) => {
        setProduct(data);
        // Default every variant group to its first option so an EMI plan
        // can be computed immediately, without forcing the user to tap first.
        const defaults = {};
        (data.variants || []).forEach((group) => {
          if (group.options[0]) defaults[group.name] = group.options[0].label;
        });
        setSelectedVariants(defaults);
        setStatus("success");
      })
      .catch((err) => {
        setErrorMessage(err.message);
        setStatus("error");
      });
  }, [id]);

  // Recompute EMI plans whenever the selected variant combination changes.
  useEffect(() => {
    if (!product) return;

    // Only show the spinner on the very first calculation. Once a plan is
    // already on screen, switching variants should just update the numbers
    // in place - not blank the section out and flash a loader, especially
    // when the new variant doesn't even change the price.
    if (!emiData) setEmiStatus("loading");

    fetchEmiPlans(id, selectedVariants)
      .then((data) => {
        setEmiData(data);
        setSelectedTenure((prevTenure) => {
          // Keep the user's chosen tenure if it's still offered under the
          // new variant combination - only fall back to the first plan
          // when it's genuinely no longer available.
          const stillAvailable = data.plans.some((p) => p.tenureMonths === prevTenure);
          return stillAvailable ? prevTenure : data.plans[0]?.tenureMonths ?? null;
        });
        setEmiStatus("success");
      })
      .catch(() => setEmiStatus("error"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, JSON.stringify(selectedVariants)]);

  const handleVariantSelect = (groupName, optionLabel) => {
    setSelectedVariants((prev) => ({ ...prev, [groupName]: optionLabel }));
  };

  const handleProceed = async () => {
    if (!selectedTenure) return;
    setSubmitting(true);
    setSubmitError("");

    try {
      const order = await createOrder({
        productId: id,
        selectedVariants,
        tenureMonths: selectedTenure,
      });
      navigate(`/shop/marketplace/confirmation/${order._id}`);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading") return <LoadingState label="Loading product..." />;
  if (status === "error") return <ErrorState message={errorMessage} onRetry={() => navigate(0)} />;

  const selectedPlan = emiData?.plans.find((p) => p.tenureMonths === selectedTenure);

  return (
    <div className="product-detail">
      <div className="product-detail__topbar">
        <button className="product-detail__back" onClick={() => navigate(-1)} type="button">
          ←
        </button>
        <p className="product-detail__topbar-title">Product Details</p>
      </div>

      <div className="product-detail__image-wrap">
        <img src={product.images[0]} alt={product.name} />
      </div>

      <div className="product-detail__body">
        <p className="product-detail__brand">{product.brand}</p>
        <h1 className="product-detail__name">{product.name}</h1>

        <div className="product-detail__rating">
          ⭐ {product.rating.toFixed(1)}
          <span className="product-detail__review-count">({product.reviewCount} reviews)</span>
        </div>

        <div className="product-detail__price-row">
          <span className="product-detail__price">
            {formatINR(emiData?.unitPrice ?? product.price)}
          </span>
          {product.mrp > product.price && (
            <span className="product-detail__mrp">{formatINR(product.mrp)}</span>
          )}
        </div>

        <p className="product-detail__description">{product.description}</p>

        {product.highlights?.length > 0 && (
          <ul className="product-detail__highlights">
            {product.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        )}

        {product.variants?.length > 0 && (
          <section className="product-detail__section">
            <h2 className="product-detail__section-title">Select Variant</h2>
            <VariantSelector
              variantGroups={product.variants}
              selectedVariants={selectedVariants}
              onSelect={handleVariantSelect}
            />
          </section>
        )}

        <section className="product-detail__section">
          <h2 className="product-detail__section-title">Choose an EMI Plan</h2>
          <p className="product-detail__section-subtitle">
            No interest, no credit score check — backed by your mutual fund holdings.
          </p>

          {emiStatus === "loading" && <LoadingState label="Calculating EMI plans..." />}
          {emiStatus === "error" && (
            <ErrorState message="Couldn't load EMI plans." onRetry={() => setSelectedVariants({ ...selectedVariants })} />
          )}
          {emiStatus === "success" && (
            <EmiPlanSelector
              plans={emiData.plans}
              selectedTenure={selectedTenure}
              onSelect={setSelectedTenure}
            />
          )}
        </section>

        {product.specifications?.length > 0 && (
          <section className="product-detail__section">
            <h2 className="product-detail__section-title">Specifications</h2>
            <div className="product-detail__specs">
              {product.specifications.map((spec) => (
                <div key={spec.label} className="product-detail__spec-row">
                  <span>{spec.label}</span>
                  <span>{spec.value}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="product-detail__section">
          <h2 className="product-detail__section-title">Customer Feedback</h2>
          <div className="product-detail__reviews">
            {DUMMY_REVIEWS.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-card__header">
                  <div className="review-card__avatar">{review.name.charAt(0)}</div>
                  <div className="review-card__meta">
                    <p className="review-card__name">
                      {review.name}
                      {review.verified && (
                        <span className="review-card__verified">Verified Purchase</span>
                      )}
                    </p>
                    <p className="review-card__date">{review.date}</p>
                  </div>
                  <div className="review-card__rating">
                    {"⭐".repeat(review.rating)}
                  </div>
                </div>
                <p className="review-card__comment">{review.comment}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="product-detail__cta-bar">
        {selectedPlan && (
          <div className="product-detail__cta-summary">
            <p className="product-detail__cta-amount">{formatINR(selectedPlan.monthlyAmount)}/mo</p>
            <p className="product-detail__cta-tenure">for {selectedPlan.tenureMonths} months</p>
          </div>
        )}
        <button
          type="button"
          className="product-detail__cta-button"
          disabled={!selectedTenure || submitting}
          onClick={handleProceed}
        >
          {submitting ? "Processing..." : "Proceed with this Plan"}
        </button>
      </div>

      {submitError && <p className="product-detail__submit-error">{submitError}</p>}
    </div>
  );
}