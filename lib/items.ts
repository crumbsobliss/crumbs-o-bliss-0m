export interface BakeryItem {
    id: number | string;
    slug: string;
    name: { en: string; bn: string };
    description: { en: string; bn: string };
    price: number;
    discounted_price?: number;
    currency: "INR";
    ingredients?: string[];
    weight?: number;
    image: string;
    tags: string[];
    calories?: number;
    prep_time?: string;
    is_veg?: boolean;
    stock?: number;
    color?: string;
}

// export const items: BakeryItem[] = [
//   {
//     id: 1,
//     slug: "butterscotch-cake-1lb",
//     name: {
//       en: "Butter scotch Cake (1 Pound)",
//       bn: "বাটারস্কচ কেক (১ পাউন্ড)",
//     },
//     description: {
//       en: "Rich and creamy butterscotch cake topped with crunchy praline and butterscotch sauce.",
//       bn: "ক্রাঞ্চি প্রালিন এবং বাটারস্কচ সস দিয়ে তৈরি রিচ এবং ক্রিমি বাটারস্কচ কেক।",
//     },
//     price: 0,
//     currency: "INR",
//     ingredients: ["Butterscotch", "Flour", "Butter", "Eggs", "Sugar", "Praline"],
//     weight: 450,
//     image: "/assets/products/1 pound butter scotch p310.png",
//     tags: ["cake", "butterscotch", "sweet"],
//   },
//   {
//     id: 2,
//     slug: "chocolate-cake-1lb",
//     name: {
//       en: "Chocolate Cake (1 Pound)",
//       bn: "চকোলেট কেক (১ পাউন্ড)",
//     },
//     description: {
//       en: "Decadent chocolate cake made with premium cocoa and layered with rich chocolate ganache.",
//       bn: "প্রিমিয়াম কোকো এবং রিচ চকোলেট গানাশ দিয়ে তৈরি জিভে জল আনা চকোলেট কেক।",
//     },
//     price: 0,
//     currency: "INR",
//     ingredients: ["Cocoa", "Dark Chocolate", "Flour", "Butter", "Eggs"],
//     weight: 450,
//     image: "/assets/products/1 pound chocolate p320.png",
//     tags: ["cake", "chocolate", "dessert"],
//   },
//   {
//     id: 3,
//     slug: "choco-vanilla-pastry",
//     name: {
//       en: "Choco Vanilla Pastry",
//       bn: "চকো ভ্যানিলা পেস্ট্রি",
//     },
//     description: {
//       en: "A perfect blend of chocolate and vanilla layers in a light, airy pastry.",
//       bn: "হালকা এবং বাতাসযুক্ত পেস্ট্রিতে চকোলেট এবং ভ্যানিলা স্তরের নিখুঁত সংমিশ্রণ।",
//     },
//     price: 0,
//     currency: "INR",
//     ingredients: ["Vanilla Extract", "Cocoa Powder", "Cream", "Flour"],
//     weight: 120,
//     image: "/assets/products/Choco Vanilla Pastry p29.png",
//     tags: ["pastry", "chocolate", "vanilla"],
//   },
//   {
//     id: 4,
//     slug: "strawberry-pastry",
//     name: {
//       en: "Straw berry Pastry",
//       bn: "স্ট্রবেরি পেস্ট্রি",
//     },
//     description: {
//       en: "Fresh strawberry-flavored pastry with cream and real fruit bits.",
//       bn: "ক্রিম এবং আসল ফলের টুকরো দিয়ে তৈরি তাজা স্ট্রবেরি স্বাদের পেস্ট্রি।",
//     },
//     price: 0,
//     currency: "INR",
//     ingredients: ["Strawberry", "Cream", "Flour", "Sugar"],
//     weight: 120,
//     image: "/assets/products/Strawberry Pastry p35.png",
//     tags: ["pastry", "strawberry", "fruit"],
//   }
// ];