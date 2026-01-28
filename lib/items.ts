export interface BakeryItem {
  id: number;
  slug: string;
  name: { en: string; bn: string };
  description: { en: string; bn: string };
  price: number;
  currency: "INR";
  ingredients: string[];
  calories: number;
  image: string;
  tags: string[];
}

export const items: BakeryItem[] = [
  // --- Existing Item ---
  {
    id: 1,
    slug: "classic-cake",
    name: {
      en: "Classic Cake",
      bn: "ক্লাসিক কেক", // Corrected from Sourdough translation to Cake
    },
    description: {
      en: "A fluffy, buttery classic sponge cake perfect for tea time.",
      bn: "চায়ের আড্ডার জন্য উপযুক্ত একটি নরম, মাখনযুক্ত ক্লাসিক স্পঞ্জ কেক।",
    },
    price: 350,
    currency: "INR",
    ingredients: ["Flour", "Butter", "Eggs", "Sugar", "Vanilla"],
    calories: 365,
    image: "/assets/products/cake 14.png", // Kept your local path
    tags: ["cake", "sweet", "classic", "sponge"],
  },

  // --- PIZZAS ---
  {
    id: 2,
    slug: "margherita-pizza",
    name: {
      en: "Classic Margherita Pizza",
      bn: "ক্লাসিক মার্গারিটা পিৎজা",
    },
    description: {
      en: "Traditional Napoletana pizza with San Marzano tomato sauce, fresh buffalo mozzarella, and basil.",
      bn: "সান মারজানো টমেটো সস, তাজা মহিষের মোজারেল্লা এবং বেসিল দিয়ে তৈরি ঐতিহ্যবাহী নেপোলিটানা পিৎজা।",
    },
    price: 450,
    currency: "INR",
    ingredients: ["00 Flour", "San Marzano Tomatoes", "Buffalo Mozzarella", "Basil", "Olive Oil"],
    calories: 270,
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80",
    tags: ["pizza", "vegetarian", "italian", "savory"],
  },
  {
    id: 3,
    slug: "spicy-chicken-pizza",
    name: {
      en: "Spicy Chicken Fiesta",
      bn: "স্পাইসি চিকেন ফিয়েস্তা",
    },
    description: {
      en: "Wood-fired pizza topped with spicy grilled chicken, jalapeños, onions, and paprika.",
      bn: "মশলাদার গ্রিল করা চিকেন, হ্যালাপেনিও, পেঁয়াজ এবং প্যাপ্রিকা দিয়ে তৈরি কাঠের চুলায় সেঁকা পিৎজা।",
    },
    price: 550,
    currency: "INR",
    ingredients: ["Pizza Dough", "Spicy Chicken", "Jalapeños", "Mozzarella", "Onions"],
    calories: 320,
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&q=80",
    tags: ["pizza", "chicken", "spicy", "savory"],
  },
  {
    id: 4,
    slug: "farmhouse-veggie-pizza",
    name: {
      en: "Farmhouse Veggie Supreme",
      bn: "ফার্মহাউস ভেজি সুপ্রিম",
    },
    description: {
      en: "Loaded with fresh bell peppers, mushrooms, olives, corn, and cherry tomatoes.",
      bn: "তাজা ক্যাপসিকাম, মাশরুম, জলপাই, কর্ন এবং চেরি টমেটো দিয়ে পরিপূর্ণ।",
    },
    price: 480,
    currency: "INR",
    ingredients: ["Whole Wheat Dough", "Bell Peppers", "Mushrooms", "Olives", "Corn"],
    calories: 290,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80",
    tags: ["pizza", "vegetarian", "healthy", "savory"],
  },

  // --- CAKES ---
  {
    id: 5,
    slug: "chocolate-truffle-cake",
    name: {
      en: "Dark Chocolate Truffle",
      bn: "ডার্ক চকোলেট ট্রাফেল",
    },
    description: {
      en: "Decadent dark chocolate ganache layered between moist chocolate sponge cake.",
      bn: "নরম চকোলেট স্পঞ্জ কেকের স্তরে স্তরে ডার্ক চকোলেট গানাশ দিয়ে তৈরি।",
    },
    price: 650,
    currency: "INR",
    ingredients: ["Dark Chocolate (70%)", "Cocoa Powder", "Cream", "Butter", "Eggs"],
    calories: 450,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80",
    tags: ["cake", "chocolate", "dessert", "sweet"],
  },
  {
    id: 6,
    slug: "red-velvet-cake",
    name: {
      en: "Royal Red Velvet",
      bn: "রয়াল রেড ভেলভেট",
    },
    description: {
      en: "Classic velvety crimson sponge with a hint of cocoa, frosted with cream cheese icing.",
      bn: "সামান্য কোকো এবং ক্রিম চিজের প্রলেপ দেওয়া ক্লাসিক ভেলভেটি লাল রঙের স্পঞ্জ কেক।",
    },
    price: 600,
    currency: "INR",
    ingredients: ["Cake Flour", "Cocoa Powder", "Cream Cheese", "Buttermilk", "Vanilla"],
    calories: 410,
    image: "https://sahnibakery.com/cdn/shop/products/ROYALREDVELVETHEARTCAKE1KG15992KG_2999.progressive.jpg?v=1609479174",
    tags: ["cake", "red-velvet", "dessert", "party"],
  },
  {
    id: 7,
    slug: "blueberry-cheesecake",
    name: {
      en: "New York Blueberry Cheesecake",
      bn: "নিউ ইয়র্ক ব্লুবেরি চিজকেক",
    },
    description: {
      en: "Creamy baked cheesecake on a graham cracker crust, topped with fresh blueberry compote.",
      bn: "গ্রাহাম ক্র্যাকার ক্রাস্টের উপর ক্রিমি বেকড চিজকেক, উপরে তাজা ব্লুবেরি কমপোট।",
    },
    price: 750,
    currency: "INR",
    ingredients: ["Cream Cheese", "Blueberries", "Graham Crackers", "Sour Cream", "Sugar"],
    calories: 380,
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&q=80",
    tags: ["cake", "cheesecake", "fruit", "premium"],
  }
];