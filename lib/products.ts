export type WearableId = "puffer" | "trench";

export type Product = {
  id: string;
  name: string;
  price: string;
  oldPrice?: string;
  rating: string;
  image: string;
  /** Only these products have a dressed-model photo in the design. */
  wearableId?: WearableId;
};

export const PRODUCTS: Product[] = [
  {
    id: "trench",
    name: "Camel Wool Trench Coat",
    price: "$449",
    rating: "3.9",
    image: "product-trench.jpg",
    wearableId: "trench",
  },
  {
    id: "puffer",
    name: "Army Green Puffer Jacket",
    price: "$189",
    oldPrice: "$229",
    rating: "4.3",
    image: "product-puffer.jpg",
    wearableId: "puffer",
  },
  {
    id: "denim",
    name: "Indigo Denim Trucker Jacket",
    price: "$119",
    rating: "3.6",
    image: "product-denim.jpg",
  },
  {
    id: "bomber",
    name: "Olive Bomber Jacket",
    price: "$159",
    rating: "4.4",
    image: "product-bomber.jpg",
  },
  {
    id: "leather",
    name: "Dark Brown Leather Biker Jacket",
    price: "$349",
    oldPrice: "$429",
    rating: "3.8",
    image: "product-leather.jpg",
  },
];

export const CATEGORIES = [
  { name: "All Categories", image: "category-all.png" },
  { name: "T-Shirts", image: "category-tshirts.png" },
  { name: "Hoodies & Sweatshirts", image: "category-hoodies.png" },
  { name: "Jackets & Outerwear", image: "category-jackets.png", active: true },
  { name: "Pants & Trousers", image: "category-pants.png" },
  { name: "Shirts", image: "category-shirts.png" },
  { name: "Shoes & Sneakers", image: "category-shoes.png" },
  { name: "Hats", image: "category-hats.png" },
];
