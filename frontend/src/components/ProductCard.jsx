import { useNavigate } from "react-router-dom";
import { formatINR } from "../utils/format";
import "../styles/components/ProductCard.css";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const discountPercent = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  return (
    <button
      type="button"
      className="product-card"
      onClick={() => navigate(`/shop/marketplace/product/${product._id}`)}
    >
      <div className="product-card__image-wrap">
        <img src={product.images[0]} alt={product.name} loading="lazy" />
      </div>

      <div className="product-card__info">
        <p className="product-card__brand">{product.brand}</p>
        <p className="product-card__name">{product.name}</p>

        <div className="product-card__price-row">
          <span className="product-card__price">{formatINR(product.price)}</span>
          {discountPercent > 0 && (
            <span className="product-card__mrp">{formatINR(product.mrp)}</span>
          )}
        </div>

        {discountPercent > 0 && (
          <span className="product-card__discount">{discountPercent}% off</span>
        )}

        <span className="product-card__emi-tag">No-cost EMI available</span>
      </div>
    </button>
  );
}
