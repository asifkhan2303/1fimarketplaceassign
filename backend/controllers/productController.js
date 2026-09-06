import Product from "../models/Product.js";
import { buildEmiPlans } from "../utils/emi.js";

/**
 * GET /api/products
 * Supports optional query params:
 *   ?category=Mobiles
 *   ?search=iphone
 *   ?brand=Apple
 * Used by the 1Fi Marketplace listing screen.
 */
export const getProducts = async (req, res) => {
  try {
    const { category, search, brand } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (search) filter.$text = { $search: search };

    const products = await Product.find(filter)
      .select("name brand category images price mrp rating reviewCount inStock")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch products", error: err.message });
  }
};

/**
 * GET /api/products/categories
 * Returns the distinct category chips for the marketplace filter bar.
 */
export const getCategories = async (_req, res) => {
  try {
    const categories = await Product.distinct("category");
    res.status(200).json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch categories", error: err.message });
  }
};

/**
 * GET /api/products/:id
 * Full product detail, used by the product detail screen.
 */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: product });
  } catch (err) {
    // Malformed ObjectId also lands here as a cast error -> treat as 404
    res.status(404).json({ success: false, message: "Product not found", error: err.message });
  }
};

/**
 * GET /api/products/:id/emi-plans?variants=Storage:128GB,Color:Black
 * Computes EMI plans for the product's price *after* applying any
 * selected variant price deltas. Kept as a dedicated endpoint so the
 * pricing logic never has to be duplicated on the frontend.
 */
export const getEmiPlans = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const selectedVariants = parseVariantsQuery(req.query.variants);
    const unitPrice = computeUnitPrice(product, selectedVariants);
    const plans = buildEmiPlans(unitPrice, product.emiTenuresAvailable);

    res.status(200).json({
      success: true,
      data: { unitPrice, plans },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to compute EMI plans", error: err.message });
  }
};

/** Parses "Storage:128GB,Color:Black" into { Storage: "128GB", Color: "Black" } */
function parseVariantsQuery(raw) {
  if (!raw) return {};
  return raw.split(",").reduce((acc, pair) => {
    const [key, value] = pair.split(":");
    if (key && value) acc[key.trim()] = value.trim();
    return acc;
  }, {});
}

/** Applies matching variant option price deltas on top of the base price. */
function computeUnitPrice(product, selectedVariants) {
  let price = product.price;

  for (const group of product.variants || []) {
    const chosenLabel = selectedVariants[group.name];
    if (!chosenLabel) continue;

    const option = group.options.find((o) => o.label === chosenLabel);
    if (option) price += option.priceDelta;
  }

  return price;
}
