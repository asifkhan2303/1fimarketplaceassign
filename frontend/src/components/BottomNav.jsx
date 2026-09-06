import { Link, useLocation } from "react-router-dom";
import "../styles/components/BottomNav.css";

// Every item now routes somewhere - Shop shows the full experience,
// the rest land on a lightweight "coming soon" placeholder that still
// has this same nav, so switching back to Shop is one tap away.
const NAV_ITEMS = [
  { key: "home", label: "Home", icon: "🏠", path: "/home" },
  { key: "shop", label: "Shop", icon: "🛍️", path: "/shop" },
  { key: "emi", label: "EMI Dues", icon: "🧾", path: "/emi" },
  { key: "limit", label: "Limit", icon: "📈", path: "/limit" },
  { key: "profile", label: "Profile", icon: "👤", path: "/profile" },
];

export default function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav className="bottom-nav">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname.startsWith(item.path);
        return (
          <Link
            key={item.key}
            to={item.path}
            className={`bottom-nav__item ${isActive ? "bottom-nav__item--active" : ""}`}
          >
            <span className="bottom-nav__icon">{item.icon}</span>
            <span className="bottom-nav__label">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}