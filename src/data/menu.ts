export type CategoryId =
  | "incontournables"
  | "hot-coffee"
  | "iced-coffee"
  | "frappuccino"
  | "the"
  | "chocolat-chaud"
  | "jus"
  | "virgin-cocktails"
  | "cocktails-smooth"
  | "crushed"
  | "smoothies"
  | "ice-cream";

export type MenuItem = {
  id: string;
  name: string;
  price: number;
  category: CategoryId;
  flavors?: string[];
  badge?: "nouveau" | "signature";
  featured?: boolean;
  image?: string;
};

export type Category = {
  id: CategoryId;
  label: string;
  icon: "star" | "cup" | "iced" | "frappe" | "tea" | "chocolate" | "juice" | "cocktail" | "smooth" | "crush" | "smoothie" | "ice";
};

export const CATEGORIES: Category[] = [
  { id: "incontournables", label: "Incontournables", icon: "star" },
  { id: "hot-coffee", label: "Hot coffee", icon: "cup" },
  { id: "iced-coffee", label: "Iced coffee", icon: "iced" },
  { id: "frappuccino", label: "Frappuccino", icon: "frappe" },
  { id: "the", label: "Thé", icon: "tea" },
  { id: "chocolat-chaud", label: "Chocolat chaud", icon: "chocolate" },
  { id: "jus", label: "Jus", icon: "juice" },
  { id: "virgin-cocktails", label: "Virgin cocktails", icon: "cocktail" },
  { id: "cocktails-smooth", label: "Cocktails smooth", icon: "smooth" },
  { id: "crushed", label: "Crushed", icon: "crush" },
  { id: "smoothies", label: "Smoothies", icon: "smoothie" },
  { id: "ice-cream", label: "Ice cream", icon: "ice" },
];

export const MENU: MenuItem[] = [
  {
    id: "matcha-latte",
    name: "Matcha latte",
    price: 9,
    category: "incontournables",
    badge: "signature",
    featured: true,
    image: "/menu/matcha-latte.jpg",
  },
  {
    id: "matcha-fraise",
    name: "Matcha fraise",
    price: 12.5,
    category: "incontournables",
    badge: "signature",
    featured: true,
    image: "/menu/matcha-fraise.jpg",
  },
  {
    id: "matcha-mangue",
    name: "Matcha mangue",
    price: 12.5,
    category: "incontournables",
    badge: "signature",
    featured: true,
  },
  {
    id: "ice-matcha",
    name: "Ice matcha",
    price: 13,
    category: "incontournables",
    badge: "signature",
    featured: true,
    image: "/menu/ice-matcha.jpg",
  },
  {
    id: "champs-jus",
    name: "Champ's jus",
    price: 13.5,
    category: "incontournables",
    badge: "signature",
    featured: true,
    image: "/menu/champs-jus.jpg",
  },
  {
    id: "matcha-blueberry",
    name: "Matcha blueberry",
    price: 13,
    category: "incontournables",
    badge: "signature",
    featured: true,
    image: "/menu/matcha-blueberry.jpg",
  },
  {
    id: "spanish-matcha",
    name: "Spanish matcha",
    price: 13,
    category: "incontournables",
    badge: "signature",
    featured: true,
    image: "/menu/spanish-matcha.jpg",
  },
  {
    id: "espresso",
    name: "Espresso",
    price: 3.3,
    category: "hot-coffee",
  },
  {
    id: "americano",
    name: "Americano",
    price: 3.6,
    category: "hot-coffee",
  },
  {
    id: "capucin",
    name: "Capucin",
    price: 3.8,
    category: "hot-coffee",
  },
  {
    id: "macchiato",
    name: "Macchiato",
    price: 3.8,
    category: "hot-coffee",
  },
  {
    id: "latte",
    name: "Latte",
    price: 4.3,
    category: "hot-coffee",
  },
  {
    id: "nescafe-special",
    name: "Nescafé spécial",
    price: 4.5,
    category: "hot-coffee",
  },
  {
    id: "chocolat-au-lait",
    name: "Chocolat au lait",
    price: 4.3,
    category: "hot-coffee",
  },
  {
    id: "caramel-latte",
    name: "Caramel latte",
    price: 5.3,
    category: "hot-coffee",
  },
  {
    id: "vanilla-latte",
    name: "Vanilla latte",
    price: 5.3,
    category: "hot-coffee",
  },
  {
    id: "spanish-latte",
    name: "Spanish latte",
    price: 7,
    category: "hot-coffee",
  },
  {
    id: "cappuccino",
    name: "Cappuccino",
    price: 7,
    category: "hot-coffee",
  },
  {
    id: "pistachio-latte",
    name: "Pistachio latte",
    price: 9,
    category: "hot-coffee",
  },
  {
    id: "ice-americano",
    name: "Ice americano",
    price: 4.5,
    category: "iced-coffee",
  },
  {
    id: "ice-latte",
    name: "Ice latte",
    price: 4.8,
    category: "iced-coffee",
  },
  {
    id: "ice-spanish-latte",
    name: "Ice spanish latte",
    price: 8,
    category: "iced-coffee",
  },
  {
    id: "iced-cappuccino",
    name: "Iced cappuccino",
    price: 6.5,
    category: "iced-coffee",
  },
  {
    id: "arome-iced",
    name: "Arôme iced",
    price: 6.5,
    category: "iced-coffee",
    flavors: ["Vanille", "Noisette"],
  },
  {
    id: "frapp-classique",
    name: "Frappuccino",
    price: 11.5,
    category: "frappuccino",
    flavors: ["Chocolate", "Moka", "Coffee"],
  },
  {
    id: "frapp-fruit",
    name: "Frappuccino",
    price: 12.5,
    category: "frappuccino",
    flavors: ["Strawberry", "Caramel", "Cookies"],
  },
  {
    id: "frapp-gourmand",
    name: "Frappuccino",
    price: 14.5,
    category: "frappuccino",
    flavors: ["Speculoos", "Nutella", "Snickers", "Praliné noisette"],
  },
  {
    id: "banaboom",
    name: "Banaboom",
    price: 14.8,
    category: "frappuccino",
  },
  {
    id: "praline-pistachio",
    name: "Praliné pistachio",
    price: 16.5,
    category: "frappuccino",
  },
  {
    id: "the-vert",
    name: "Thé vert",
    price: 3.5,
    category: "the",
  },
  {
    id: "infusion",
    name: "Infusion",
    price: 4,
    category: "the",
  },
  {
    id: "the-amande",
    name: "Thé amande",
    price: 7,
    category: "the",
  },
  {
    id: "ice-tea-citron",
    name: "Ice tea citron",
    price: 6,
    category: "the",
  },
  {
    id: "ice-tea-peche",
    name: "Ice tea pêche",
    price: 6.5,
    category: "the",
  },
  {
    id: "choco-classique",
    name: "Classique",
    price: 7.5,
    category: "chocolat-chaud",
  },
  {
    id: "choco-nutella",
    name: "Nutella / praliné",
    price: 9.5,
    category: "chocolat-chaud",
    flavors: ["Nutella", "Praliné"],
  },
  {
    id: "choco-noisette",
    name: "Noisette",
    price: 8.5,
    category: "chocolat-chaud",
  },
  {
    id: "jus-orange",
    name: "Orange",
    price: 5.5,
    category: "jus",
  },
  {
    id: "citronnade",
    name: "Citronnade",
    price: 5.5,
    category: "jus",
  },
  {
    id: "jus-pomme",
    name: "Pomme",
    price: 7,
    category: "jus",
  },
  {
    id: "jus-fraise",
    name: "Fraise",
    price: 7,
    category: "jus",
  },
  {
    id: "jus-banane",
    name: "Banane",
    price: 8.5,
    category: "jus",
  },
  {
    id: "citron-menthe",
    name: "Citron-menthe",
    price: 8,
    category: "jus",
  },
  {
    id: "citronnade-glacee",
    name: "Citronnade glacée",
    price: 9,
    category: "jus",
  },
  {
    id: "mint-lemonade-virgin",
    name: "Mint lemonade virgin",
    price: 9,
    category: "jus",
  },
  {
    id: "tropical-mix",
    name: "Tropical mix (mangue / ananas)",
    price: 9.5,
    category: "jus",
  },
  {
    id: "cocktail-fruits",
    name: "Cocktail fruits",
    price: 11,
    category: "jus",
  },
  {
    id: "virgin-mojito",
    name: "Virgin mojito",
    price: 8.5,
    category: "virgin-cocktails",
  },
  {
    id: "color-mojito",
    name: "Mojito",
    price: 9.5,
    category: "virgin-cocktails",
    flavors: ["Red", "Blue"],
  },
  {
    id: "energetic-mojito",
    name: "Energetic mojito",
    price: 13.5,
    category: "virgin-cocktails",
  },
  {
    id: "passion-mojito",
    name: "Passion mojito",
    price: 10.5,
    category: "virgin-cocktails",
    badge: "nouveau",
  },
  {
    id: "pina-colada",
    name: "Piña colada",
    price: 8.5,
    category: "cocktails-smooth",
  },
  {
    id: "fraise-banane-colada",
    name: "Fraise banane colada",
    price: 9.5,
    category: "cocktails-smooth",
  },
  {
    id: "tropical-smooth",
    name: "Tropical (mangue / ananas / pêche)",
    price: 10.5,
    category: "cocktails-smooth",
  },
  {
    id: "crushed-berry",
    name: "Crushed",
    price: 7,
    category: "crushed",
    flavors: ["Blueberry", "Curaçao", "Fraise"],
  },
  {
    id: "watermelon-crush",
    name: "Watermelon",
    price: 7,
    category: "crushed",
  },
  {
    id: "peach-ice-crush",
    name: "Peach ice crush",
    price: 7.5,
    category: "crushed",
  },
  {
    id: "smoothie-oreo",
    name: "Smoothie",
    price: 12.5,
    category: "smoothies",
    flavors: ["Blueberry", "Vanille", "Oreo"],
  },
  {
    id: "fraise-banane",
    name: "Fraise-banane",
    price: 13.5,
    category: "smoothies",
  },
  {
    id: "chocolat-banane",
    name: "Chocolat-banane",
    price: 13.5,
    category: "smoothies",
  },
  {
    id: "nutella-banane",
    name: "Nutella-banane",
    price: 14.5,
    category: "smoothies",
  },
  {
    id: "mangue-ananas",
    name: "Mangue-ananas",
    price: 13.5,
    category: "smoothies",
  },
  {
    id: "ice-duo",
    name: "Duo",
    price: 6.5,
    category: "ice-cream",
  },
  {
    id: "ice-trio",
    name: "Trio",
    price: 8.5,
    category: "ice-cream",
  },
  {
    id: "glace-chocolat",
    name: "Chocolat",
    price: 8.5,
    category: "ice-cream",
  },
  {
    id: "glace-fraise",
    name: "Fraise",
    price: 8.5,
    category: "ice-cream",
  },
  {
    id: "ice-cup",
    name: "Ice cup",
    price: 25,
    category: "ice-cream",
    featured: true,
    image: "/menu/ice-cup.jpg",
  },
];

export const PROMISES = [
  { id: "quality", label: "Ingrédients de qualité" },
  { id: "homemade", label: "Recettes faites maison" },
  { id: "unique", label: "Saveurs uniques" },
  { id: "service", label: "Service chaleureux" },
] as const;

export function itemsByCategory(category: CategoryId): MenuItem[] {
  return MENU.filter((item) => item.category === category);
}

export function featuredItems(): MenuItem[] {
  return MENU.filter((item) => item.featured);
}

export type FilterId = "all" | CategoryId;

export const QUICK_FILTERS: FilterId[] = ["all", "incontournables", "hot-coffee", "jus"];

export function itemsForFilter(filter: FilterId): MenuItem[] {
  if (filter === "all") {
    const featured = featuredItems();
    const seen = new Set(featured.map((item) => item.id));
    return [...featured, ...MENU.filter((item) => !seen.has(item.id))];
  }
  if (filter === "incontournables") {
    return featuredItems();
  }
  return itemsByCategory(filter);
}
