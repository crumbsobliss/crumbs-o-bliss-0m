export interface BakeryItem {
  id: Number;
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
  {
    id: 1,
    slug: "classic-cake",
    name: {
      en: "Classic Cake",
      bn: "ক্লাসিক সাউরডু ব্রেড",
    },
    description: {
      en: "A rustic, crusty loaf with a tangy flavor and chewy crumb. Made with our signature sourdough starter and aged for 24 hours.",
      bn: "একটি আদিম, মচমচে রুটি যার স্বাদ কিছুটা টক এবং ভেতরটা নমনীয়। আমাদের বিশেষ সাউরডু স্টার্টার দিয়ে তৈরি এবং ২৪ ঘণ্টা ফারমেন্ট করা।",
    },
    price: 350,
    currency: "INR",
    ingredients: ["Bread flour", "Sourdough starter", "Water", "Salt"],
    calories: 365,
    image: "/assets/products/cake 14.png",
    tags: ["bread", "sourdough", "vegan", "whole-grain"],
  }
];