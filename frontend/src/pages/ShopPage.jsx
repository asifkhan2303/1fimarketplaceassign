import { useSearchParams } from "react-router-dom";
import ShopTabs, { SHOP_TABS } from "../components/ShopTabs";
import BlankTabPlaceholder from "../components/BlankTabPlaceholder";
import BottomNav from "../components/BottomNav";
import MarketplaceHome from "./MarketplaceHome";
import "../styles/pages/ShopPage.css";

const DEFAULT_TAB = "top-brands";
const VALID_TAB_KEYS = SHOP_TABS.map((tab) => tab.key);

export default function ShopPage() {
  // Kept in the URL (not local state) so it survives a full unmount/remount -
  // e.g. tapping a product then hitting back should land you back on whichever
  // tab you were on, not reset to the default.
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const activeTab = VALID_TAB_KEYS.includes(requestedTab) ? requestedTab : DEFAULT_TAB;

  const handleTabChange = (tabKey) => {
    setSearchParams(tabKey === DEFAULT_TAB ? {} : { tab: tabKey }, { replace: true });
  };

  return (
    <div className="app-shell">
      <header className="shop-hero">
        <span className="shop-hero__badge">✨ NO-COST EMIs</span>
        <h1 className="shop-hero__title">
          Shop today,
          <br />
          <em>Pay later using</em>
          <br />
          Mutual funds.
        </h1>
        <p className="shop-hero__subtitle">
          No credit score required. No interest.
          <br />
          Backed by your investments.
        </p>
      </header>

      <ShopTabs active={activeTab} onChange={handleTabChange} />

      <main className="shop-content">
        {activeTab === "top-brands" && <BlankTabPlaceholder label="Top Brands" />}
        {activeTab === "nearby-stores" && <BlankTabPlaceholder label="Nearby Stores" />}
        {activeTab === "marketplace" && <MarketplaceHome />}
      </main>

      <BottomNav />
    </div>
  );
}