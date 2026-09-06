import Chip from "./shared/Chip";
import "../styles/components/ShopTabs.css";

export const SHOP_TABS = [
  { key: "top-brands", label: "Top Brands" },
  { key: "nearby-stores", label: "Nearby Stores" },
  { key: "marketplace", label: "1Fi Marketplace" },
];

export default function ShopTabs({ active, onChange }) {
  return (
    <div className="shop-tabs">
      {SHOP_TABS.map((tab) => (
        <Chip
          key={tab.key}
          label={tab.label}
          look="tab"
          active={active === tab.key}
          onClick={() => onChange(tab.key)}
        />
      ))}
    </div>
  );
}
