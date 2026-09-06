import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import Product from "../models/Product.js";

dotenv.config();

const products = [
  {
    name: "iPhone 15",
    brand: "Apple",
    category: "Mobiles",
    images: [
  "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80",
],
    rating: 4.6,
    reviewCount: 2140,
    mrp: 79900,
    price: 74900,
    description:
      "iPhone 15 features a 48MP main camera, the A16 Bionic chip, and a durable color-infused glass back.",
    highlights: ["48MP camera", "A16 Bionic chip", "USB-C", "All-day battery"],
    specifications: [
      { label: "Display", value: "6.1-inch Super Retina XDR" },
      { label: "Chip", value: "A16 Bionic" },
      { label: "Camera", value: "48MP + 12MP Ultra Wide" },
    ],
    variants: [
      {
        name: "Storage",
        options: [
          { label: "128GB", priceDelta: 0 },
          { label: "256GB", priceDelta: 10000 },
          { label: "512GB", priceDelta: 30000 },
        ],
      },
      {
        name: "Color",
        options: [
          { label: "Black", priceDelta: 0 },
          { label: "Blue", priceDelta: 0 },
          { label: "Pink", priceDelta: 0 },
        ],
      },
    ],
    emiTenuresAvailable: [3, 6, 9, 12],
  },
  {
    name: "Galaxy S24",
    brand: "Samsung",
    category: "Mobiles",
    images: [
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600",
    ],
    rating: 4.4,
    reviewCount: 980,
    mrp: 74999,
    price: 69999,
    description:
      "Galaxy S24 brings Galaxy AI, a 50MP camera system, and a bright 6.2-inch Dynamic AMOLED display.",
    highlights: ["Galaxy AI", "50MP camera", "120Hz display"],
    specifications: [
      { label: "Display", value: "6.2-inch Dynamic AMOLED 2X" },
      { label: "Chip", value: "Snapdragon 8 Gen 3" },
    ],
    variants: [
      {
        name: "Storage",
        options: [
          { label: "128GB", priceDelta: 0 },
          { label: "256GB", priceDelta: 8000 },
        ],
      },
      {
        name: "Color",
        options: [
          { label: "Onyx Black", priceDelta: 0 },
          { label: "Marble Grey", priceDelta: 0 },
        ],
      },
    ],
    emiTenuresAvailable: [3, 6, 9, 12],
  },
  {
    name: "MacBook Air M2",
    brand: "Apple",
    category: "Laptops",
    images: [
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600",
    ],
    rating: 4.8,
    reviewCount: 1520,
    mrp: 119900,
    price: 99900,
    description:
      "MacBook Air with the M2 chip delivers up to 18 hours of battery life in a fanless, ultra-portable design.",
    highlights: ["M2 chip", "18-hour battery", "Fanless design", "Liquid Retina display"],
    specifications: [
      { label: "Chip", value: "Apple M2" },
      { label: "RAM", value: "8GB unified memory" },
      { label: "Display", value: "13.6-inch Liquid Retina" },
    ],
    variants: [
      {
        name: "Storage",
        options: [
          { label: "256GB SSD", priceDelta: 0 },
          { label: "512GB SSD", priceDelta: 20000 },
        ],
      },
      {
        name: "Color",
        options: [
          { label: "Midnight", priceDelta: 0 },
          { label: "Starlight", priceDelta: 0 },
          { label: "Space Grey", priceDelta: 0 },
        ],
      },
    ],
    emiTenuresAvailable: [3, 6, 9, 12, 18, 24],
  },
  {
    name: "ThinkPad E14",
    brand: "Lenovo",
    category: "Laptops",
    images: [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600",
    ],
    rating: 4.2,
    reviewCount: 410,
    mrp: 64999,
    price: 57999,
    description:
      "A dependable everyday laptop with a 14-inch FHD display, spill-resistant keyboard, and all-day battery.",
    highlights: ["14-inch FHD display", "Spill-resistant keyboard", "Rapid Charge"],
    specifications: [
      { label: "Processor", value: "Intel Core i5 13th Gen" },
      { label: "RAM", value: "16GB DDR4" },
      { label: "Storage", value: "512GB SSD" },
    ],
    variants: [
      {
        name: "Color",
        options: [{ label: "Graphite Black", priceDelta: 0 }],
      },
    ],
    emiTenuresAvailable: [3, 6, 9, 12, 18],
  },
  {
    name: "Apple Watch Series 9",
    brand: "Apple",
    category: "Wearables",
    images: [
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600",
    ],
    rating: 4.7,
    reviewCount: 860,
    mrp: 45900,
    price: 41900,
    description:
      "Apple Watch Series 9 with a brighter display, the new S9 chip, and Double Tap gesture control.",
    highlights: ["S9 chip", "Double Tap gesture", "Always-On Retina display"],
    specifications: [
      { label: "Case size", value: "45mm" },
      { label: "Water resistance", value: "50 metres" },
    ],
    variants: [
      {
        name: "Band Color",
        options: [
          { label: "Midnight", priceDelta: 0 },
          { label: "Starlight", priceDelta: 0 },
          { label: "Red", priceDelta: 1000 },
        ],
      },
    ],
    emiTenuresAvailable: [3, 6, 9],
  },
  {
    name: "TVS iQube",
    brand: "TVS",
    category: "Two Wheelers",
    images: [
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600",
    ],
    rating: 4.1,
    reviewCount: 320,
    mrp: 129999,
    price: 119999,
    description:
      "TVS iQube electric scooter with a 100+ km range, SmartXonnect app connectivity, and fast charging.",
    highlights: ["100+ km range", "SmartXonnect app", "Fast charging"],
    specifications: [
      { label: "Top speed", value: "82 km/h" },
      { label: "Range", value: "100+ km per charge" },
    ],
    variants: [
      {
        name: "Color",
        options: [
          { label: "Titanium Grey", priceDelta: 0 },
          { label: "Pearl White", priceDelta: 0 },
        ],
      },
    ],
    emiTenuresAvailable: [6, 9, 12, 18, 24],
  },
  {
    name: "LG 1.5 Ton Split AC",
    brand: "LG",
    category: "Appliances",
    images: [
  "https://img-prd-pim.poorvika.com/cdn-cgi/image/width%3D500%2Cheight%3D500%2Cquality%3D75/product/LG-1-5-Ton-5-Star-AI-plus-Convertible-6-in-1-DUAL-Inverter-Split-AC-with-ThinQ-Wi-Fi-RS-Q19JWZE-1-5-Ton-5Star-06.png",
],
    rating: 4.3,
    reviewCount: 540,
    mrp: 45990,
    price: 38990,
    description:
      "5-star inverter split AC with dual-cool convertible modes and HD filter for cleaner air.",
    highlights: ["5-star inverter", "Dual Cool convertible", "HD filter"],
    specifications: [
      { label: "Capacity", value: "1.5 Ton" },
      { label: "Energy rating", value: "5 Star" },
    ],
    variants: [],
    emiTenuresAvailable: [3, 6, 9, 12],
  },
  {
    name: "OnePlus 12",
    brand: "OnePlus",
    category: "Mobiles",
    images: [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600",
    ],
    rating: 4.5,
    reviewCount: 690,
    mrp: 69999,
    price: 64999,
    description:
      "OnePlus 12 with Hasselblad camera tuning, Snapdragon 8 Gen 3, and 100W SUPERVOOC fast charging.",
    highlights: ["Hasselblad camera", "100W fast charging", "Snapdragon 8 Gen 3"],
    specifications: [
      { label: "Display", value: "6.82-inch LTPO AMOLED" },
      { label: "Battery", value: "5400mAh" },
    ],
    variants: [
      {
        name: "Storage",
        options: [
          { label: "256GB", priceDelta: 0 },
          { label: "512GB", priceDelta: 6000 },
        ],
      },
    ],
    emiTenuresAvailable: [3, 6, 9, 12],
  },
];

const seed = async () => {
  await connectDB();

  await Product.deleteMany({});
  console.log("[seed] Cleared existing products");

  const inserted = await Product.insertMany(products);
  console.log(`[seed] Inserted ${inserted.length} products`);

  await mongoose.disconnect();
  console.log("[seed] Done");
};

seed().catch((err) => {
  console.error("[seed] Failed:", err);
  process.exit(1);
});
