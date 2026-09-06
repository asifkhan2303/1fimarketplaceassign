import Product from "../models/Product.js";
import Order from "../models/Order.js";
import { buildEmiPlans } from "../utils/emi.js";

/**
 * POST /api/orders
 * Body: { productId, selectedVariants: { Storage: "128GB" }, tenureMonths }
 *
 * Called when the user taps "Proceed with this plan". Re-derives the
 * price and EMI numbers server-side (never trusts the client-sent
 * amount) so the stored order always reflects real product data.
 */
export const createOrder = async (req, res) => {
  try {
    const { productId, selectedVariants = {}, tenureMonths } = req.body;

    if (!productId || !tenureMonths) {
      return res.status(400).json({
        success: false,
        message: "productId and tenureMonths are required",
      });
    }

    const product = await Product.findById(productId).lean();
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    if (!product.emiTenuresAvailable.includes(tenureMonths)) {
      return res.status(400).json({
        success: false,
        message: `Tenure ${tenureMonths} months is not available for this product`,
      });
    }

    let unitPrice = product.price;
    for (const group of product.variants || []) {
      const chosenLabel = selectedVariants[group.name];
      const option = group.options.find((o) => o.label === chosenLabel);
      if (option) unitPrice += option.priceDelta;
    }

    const [plan] = buildEmiPlans(unitPrice, [tenureMonths]);

    const order = await Order.create({
      product: product._id,
      productName: product.name,
      selectedVariants,
      unitPrice,
      tenureMonths,
      monthlyAmount: plan.monthlyAmount,
      processingFee: plan.processingFee,
    });

    res.status(201).json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to create order", error: err.message });
  }
};

/** GET /api/orders/:id - used by an optional confirmation screen */
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).lean();
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    res.status(200).json({ success: true, data: order });
  } catch (err) {
    res.status(404).json({ success: false, message: "Order not found", error: err.message });
  }
};