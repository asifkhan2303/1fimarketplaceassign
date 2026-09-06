import "../styles/components/BlankTabPlaceholder.css";

/**
 * "Top Brands" and "Nearby Stores" are explicitly out of scope for this
 * assignment - kept as simple placeholders so the tab switcher has
 * somewhere to render, without inventing unrequested functionality.
 */
export default function BlankTabPlaceholder({ label }) {
  return (
    <div className="blank-tab">
      <p className="blank-tab__text">{label} is coming soon.</p>
    </div>
  );
}
