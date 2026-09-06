import { Routes, Route, Navigate } from "react-router-dom";
import ShopPage from "./pages/ShopPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import ComingSoonPage from "./pages/ComingSoonPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/shop" replace />} />
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/shop/marketplace/product/:id" element={<ProductDetailPage />} />
      <Route path="/shop/marketplace/confirmation/:orderId" element={<OrderConfirmationPage />} />

      {/* Only Shop has real functionality - the rest of the bottom nav
          lands on a shared placeholder so switching back to Shop always works. */}
      <Route path="/home" element={<ComingSoonPage label="Home" />} />
      <Route path="/emi" element={<ComingSoonPage label="EMI Dues" />} />
      <Route path="/limit" element={<ComingSoonPage label="Limit" />} />
      <Route path="/profile" element={<ComingSoonPage label="Profile" />} />
    </Routes>
  );
}