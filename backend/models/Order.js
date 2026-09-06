import mongoose from "mongoose";

/**
 * Created when a user taps "Proceed with this plan" on the product
 * detail screen. This is intentionally a lightweight record — in the
 * real 1Fi app this step would hand off to the mutual-fund-backed
 * EMI underwriting flow, which is out of scope.
 */
const orderSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productName: { type: String, required: true }, // denormalised for easy display
    selectedVariants: {
      // e.g. { Storage: "128GB", Color: "Black" }
      type: Map,
      of: String,
      default: {},
    },
    unitPrice: { type: Number, required: true }, // price after variant deltas
    tenureMonths: { type: Number, required: true },
    monthlyAmount: { type: Number, required: true },
    processingFee: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["PLAN_SELECTED", "SUBMITTED", "CANCELLED"],
      default: "PLAN_SELECTED",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
