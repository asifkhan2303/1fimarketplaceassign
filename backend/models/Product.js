import mongoose from "mongoose";

/**
 * A variant option, e.g. { label: "128GB / Black", priceDelta: 0 }
 * priceDelta is added on top of the product's base `price` when this
 * option is selected. Kept as a delta (not an absolute price) so the
 * base price is always the single source of truth.
 */
const variantOptionSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    priceDelta: { type: Number, default: 0 },
    inStock: { type: Boolean, default: true },
  },
  { _id: true }
);

/**
 * A variant group, e.g. "Storage" -> [64GB, 128GB, 256GB]
 * or "Color" -> [Black, Blue, Titanium].
 */
const variantGroupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g. "Storage", "Color"
    options: { type: [variantOptionSchema], required: true },
  },
  { _id: false }
);

const specSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ["Mobiles", "Laptops", "Wearables", "Two Wheelers", "Appliances"],
    },
    images: {
      type: [String],
      required: true,
      validate: (arr) => arr.length > 0,
    },
    rating: { type: Number, min: 0, max: 5, default: 4.3 },
    reviewCount: { type: Number, default: 0 },

    // Base MRP and selling price, in INR, before any variant priceDelta.
    mrp: { type: Number, required: true },
    price: { type: Number, required: true },

    description: { type: String, required: true },
    highlights: { type: [String], default: [] },
    specifications: { type: [specSchema], default: [] },
    variants: { type: [variantGroupSchema], default: [] },

    // Tenure options (in months) this product can be bought on EMI for.
    // Kept per-product because higher-value items (laptops, two wheelers)
    // usually support longer tenures than accessories.
    emiTenuresAvailable: {
      type: [Number],
      default: [3, 6, 9, 12],
    },

    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", brand: "text", category: "text" });

const Product = mongoose.model("Product", productSchema);
export default Product;
