import { useEffect, useMemo, useState } from "react";
import SearchBar from "../components/SearchBar";
import CategoryChips from "../components/CategoryChips";
import ProductCard from "../components/ProductCard";
import { LoadingState, ErrorState, EmptyState } from "../components/StatusStates";
import { fetchProducts, fetchCategories } from "../api/marketplaceApi";
import "../styles/pages/MarketplaceHome.css";

export default function MarketplaceHome() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [errorMessage, setErrorMessage] = useState("");

  // Categories are fetched once - they don't change while browsing.
  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setCategories([])); // non-critical: fail silently, "All" still works
  }, []);

  // Debounce search input so we don't fire a request on every keystroke.
  useEffect(() => {
    const timer = setTimeout(() => {
      loadProducts();
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, search]);

  const loadProducts = async () => {
    setStatus("loading");
    try {
      const data = await fetchProducts({ category: activeCategory, search });
      setProducts(data);
      setStatus("success");
    } catch (err) {
      setErrorMessage(err.message);
      setStatus("error");
    }
  };

  const content = useMemo(() => {
    if (status === "loading") return <LoadingState label="Fetching products..." />;
    if (status === "error") return <ErrorState message={errorMessage} onRetry={loadProducts} />;
    if (!products.length) return <EmptyState message="No products match your search." />;

    return (
      <div className="marketplace-home__list">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, products, errorMessage]);

  return (
    <div className="marketplace-home screen-padding">
      <SearchBar value={search} onChange={setSearch} placeholder="Search phones, laptops, and more..." />

      <div className="marketplace-home__chips">
        <CategoryChips categories={categories} active={activeCategory} onSelect={setActiveCategory} />
      </div>

      <h2 className="marketplace-home__heading">1Fi Marketplace</h2>

      {content}
    </div>
  );
}
