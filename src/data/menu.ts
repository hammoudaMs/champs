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
  description?: string;
  allergens?: string[];
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
    description: "Matcha onctueux et lait chaud, notre classique du matin.",
    allergens: ["lait"],
    badge: "signature",
    featured: true,
    image: "/menu/matcha-latte.jpg",
  },
  {
    id: "matcha-fraise",
    name: "Matcha fraise",
    price: 12.5,
    category: "incontournables",
    description: "Matcha léger relevé par une touche de fraise bien fraîche.",
    allergens: ["lait"],
    badge: "signature",
    featured: true,
    image: "/menu/matcha-fraise.jpg",
  },
  {
    id: "matcha-mangue",
    name: "Matcha mangue",
    price: 12.5,
    category: "incontournables",
    description: "Douceur tropicale de mangue sur fond de matcha équilibré.",
    allergens: ["lait"],
    badge: "signature",
    featured: true,
  },
  {
    id: "ice-matcha",
    name: "Ice matcha",
    price: 13,
    category: "incontournables",
    description: "Matcha glacé, rafraîchissant et parfait pour l'après-midi.",
    allergens: ["lait"],
    badge: "signature",
    featured: true,
    image: "/menu/ice-matcha.jpg",
  },
  {
    id: "champs-jus",
    name: "Champ's jus",
    price: 13.5,
    category: "incontournables",
    description: "Notre mélange maison de fruits pressés, la signature du bar.",
    allergens: [],
    badge: "signature",
    featured: true,
    image: "/menu/champs-jus.jpg",
  },
  {
    id: "matcha-blueberry",
    name: "Matcha blueberry",
    price: 13,
    category: "incontournables",
    description: "Myrtilles et matcha pour un duo fruité et légèrement acidulé.",
    allergens: ["lait"],
    badge: "signature",
    featured: true,
    image: "/menu/matcha-blueberry.jpg",
  },
  {
    id: "spanish-matcha",
    name: "Spanish matcha",
    price: 13,
    category: "incontournables",
    description: "Inspiré du latte espagnol, matcha crémeux et légèrement sucré.",
    allergens: ["lait"],
    badge: "signature",
    featured: true,
    image: "/menu/spanish-matcha.jpg",
  },
  {
    id: "espresso",
    name: "Espresso",
    price: 3.3,
    category: "hot-coffee",
    description: "Shot serré, torréfaction intense, servi court et chaud.",
    allergens: [],
  },
  {
    id: "americano",
    name: "Americano",
    price: 3.6,
    category: "hot-coffee",
    description: "Espresso allongé à l'eau chaude, long en bouche sans lourdeur.",
    allergens: [],
  },
  {
    id: "capucin",
    name: "Capucin",
    price: 3.8,
    category: "hot-coffee",
    description: "Petit café crémeux, juste ce qu'il faut de mousse de lait.",
    allergens: ["lait"],
  },
  {
    id: "macchiato",
    name: "Macchiato",
    price: 3.8,
    category: "hot-coffee",
    description: "Espresso marqué d'une noisette de lait chaud.",
    allergens: ["lait"],
  },
  {
    id: "latte",
    name: "Latte",
    price: 4.3,
    category: "hot-coffee",
    description: "Lait velouté et espresso doux, idéal à savourer lentement.",
    allergens: ["lait"],
  },
  {
    id: "nescafe-special",
    name: "Nescafé spécial",
    price: 4.5,
    category: "hot-coffee",
    description: "Café soluble préparé maison, réconfortant et bien dosé.",
    allergens: ["lait"],
  },
  {
    id: "chocolat-au-lait",
    name: "Chocolat au lait",
    price: 4.3,
    category: "hot-coffee",
    description: "Chocolat chaud fondant au lait, douceur garantie.",
    allergens: ["lait"],
  },
  {
    id: "caramel-latte",
    name: "Caramel latte",
    price: 5.3,
    category: "hot-coffee",
    description: "Latte gourmand nappé d'un caramel fondant.",
    allergens: ["lait"],
  },
  {
    id: "vanilla-latte",
    name: "Vanilla latte",
    price: 5.3,
    category: "hot-coffee",
    description: "Vanille douce et café chaud pour une pause réconfortante.",
    allergens: ["lait"],
  },
  {
    id: "spanish-latte",
    name: "Spanish latte",
    price: 7,
    category: "hot-coffee",
    description: "Lait condensé et espresso, crémeux à la manière ibérique.",
    allergens: ["lait"],
  },
  {
    id: "cappuccino",
    name: "Cappuccino",
    price: 7,
    category: "hot-coffee",
    description: "Mousse généreuse, espresso équilibré, le rituel du matin.",
    allergens: ["lait"],
  },
  {
    id: "pistachio-latte",
    name: "Pistachio latte",
    price: 9,
    category: "hot-coffee",
    description: "Pistache parfumée et lait chaud, une gourmandise parfumée.",
    allergens: ["lait", "fruits à coque"],
  },
  {
    id: "ice-americano",
    name: "Ice americano",
    price: 4.5,
    category: "iced-coffee",
    description: "Espresso sur glace, net et désaltérant.",
    allergens: [],
  },
  {
    id: "ice-latte",
    name: "Ice latte",
    price: 4.8,
    category: "iced-coffee",
    description: "Lait froid et espresso, simple et toujours efficace.",
    allergens: ["lait"],
  },
  {
    id: "ice-spanish-latte",
    name: "Ice spanish latte",
    price: 8,
    category: "iced-coffee",
    description: "Version glacée du spanish latte, sucré et onctueux.",
    allergens: ["lait"],
  },
  {
    id: "iced-cappuccino",
    name: "Iced cappuccino",
    price: 6.5,
    category: "iced-coffee",
    description: "Cappuccino froid, mousse légère et café bien présent.",
    allergens: ["lait"],
  },
  {
    id: "arome-iced",
    name: "Arôme iced",
    price: 6.5,
    category: "iced-coffee",
    description: "Café glacé parfumé vanille ou noisette, au choix.",
    allergens: ["lait", "fruits à coque"],
    flavors: ["Vanille", "Noisette"],
  },
  {
    id: "frapp-classique",
    name: "Frappuccino",
    price: 11.5,
    category: "frappuccino",
    description: "Frappé mixé façon café, chocolat, moka ou coffee selon l'envie.",
    allergens: ["lait"],
    flavors: ["Chocolate", "Moka", "Coffee"],
  },
  {
    id: "frapp-fruit",
    name: "Frappuccino",
    price: 12.5,
    category: "frappuccino",
    description: "Frappé gourmand aux saveurs fraise, caramel ou cookies.",
    allergens: ["lait", "gluten"],
    flavors: ["Strawberry", "Caramel", "Cookies"],
  },
  {
    id: "frapp-gourmand",
    name: "Frappuccino",
    price: 14.5,
    category: "frappuccino",
    description: "Le frappé le plus indulgent : speculoos, Nutella, Snickers ou praliné.",
    allergens: ["lait", "fruits à coque", "gluten"],
    flavors: ["Speculoos", "Nutella", "Snickers", "Praliné noisette"],
  },
  {
    id: "banaboom",
    name: "Banaboom",
    price: 14.8,
    category: "frappuccino",
    description: "Banane mixée en frappé énergique, texture crémeuse.",
    allergens: ["lait"],
  },
  {
    id: "praline-pistachio",
    name: "Praliné pistachio",
    price: 16.5,
    category: "frappuccino",
    description: "Praliné et pistache en frappé, riche et parfumé.",
    allergens: ["lait", "fruits à coque"],
  },
  {
    id: "the-vert",
    name: "Thé vert",
    price: 3.5,
    category: "the",
    description: "Thé vert infusé à la demande, léger et aromatique.",
    allergens: [],
  },
  {
    id: "infusion",
    name: "Infusion",
    price: 4,
    category: "the",
    description: "Tisane chaude au parfum du moment, sans théine.",
    allergens: [],
  },
  {
    id: "the-amande",
    name: "Thé amande",
    price: 7,
    category: "the",
    description: "Thé parfumé amande, doux et réconfortant.",
    allergens: ["fruits à coque"],
  },
  {
    id: "ice-tea-citron",
    name: "Ice tea citron",
    price: 6,
    category: "the",
    description: "Thé glacé au citron, frais et pétillant de légèreté.",
    allergens: [],
  },
  {
    id: "ice-tea-peche",
    name: "Ice tea pêche",
    price: 6.5,
    category: "the",
    description: "Thé froid à la pêche, suave et désaltérant.",
    allergens: [],
  },
  {
    id: "choco-classique",
    name: "Classique",
    price: 7.5,
    category: "chocolat-chaud",
    description: "Chocolat chaud onctueux, la recette classique bien épaisse.",
    allergens: ["lait"],
  },
  {
    id: "choco-nutella",
    name: "Nutella / praliné",
    price: 9.5,
    category: "chocolat-chaud",
    description: "Chocolat chaud enrichi de Nutella ou praliné, ultra gourmand.",
    allergens: ["lait", "fruits à coque"],
    flavors: ["Nutella", "Praliné"],
  },
  {
    id: "choco-noisette",
    name: "Noisette",
    price: 8.5,
    category: "chocolat-chaud",
    description: "Chocolat chaud à la noisette, parfum grillé et fondant.",
    allergens: ["lait", "fruits à coque"],
  },
  {
    id: "jus-orange",
    name: "Orange",
    price: 5.5,
    category: "jus",
    description: "Jus d'orange pressé, vitaminé et soleil en verre.",
    allergens: [],
  },
  {
    id: "citronnade",
    name: "Citronnade",
    price: 5.5,
    category: "jus",
    description: "Citron fraîchement pressé, légèrement sucré, bien acidulé.",
    allergens: [],
  },
  {
    id: "jus-pomme",
    name: "Pomme",
    price: 7,
    category: "jus",
    description: "Pomme juteuse extractée à froid, douceur naturelle.",
    allergens: [],
  },
  {
    id: "jus-fraise",
    name: "Fraise",
    price: 7,
    category: "jus",
    description: "Fraises mixées minute, parfum estival garanti.",
    allergens: [],
  },
  {
    id: "jus-banane",
    name: "Banane",
    price: 8.5,
    category: "jus",
    description: "Banane onctueuse, texture smoothie légère sans lait.",
    allergens: [],
  },
  {
    id: "citron-menthe",
    name: "Citron-menthe",
    price: 8,
    category: "jus",
    description: "Citron et menthe fraîche, la boisson la plus rafraîchissante du menu.",
    allergens: [],
  },
  {
    id: "citronnade-glacee",
    name: "Citronnade glacée",
    price: 9,
    category: "jus",
    description: "Citronnade servie bien froide, parfaite quand il fait chaud.",
    allergens: [],
  },
  {
    id: "mint-lemonade-virgin",
    name: "Mint lemonade virgin",
    price: 9,
    category: "jus",
    description: "Limonade à la menthe sans alcool, pétillante et verte.",
    allergens: [],
  },
  {
    id: "tropical-mix",
    name: "Tropical mix (mangue / ananas)",
    price: 9.5,
    category: "jus",
    description: "Mangue et ananas en duo exotique, pur jus de vacances.",
    allergens: [],
  },
  {
    id: "cocktail-fruits",
    name: "Cocktail fruits",
    price: 11,
    category: "jus",
    description: "Assortiment de fruits du moment, mixé maison et généreux.",
    allergens: [],
  },
  {
    id: "virgin-mojito",
    name: "Virgin mojito",
    price: 8.5,
    category: "virgin-cocktails",
    description: "Menthe, citron vert et glace, le mojito sans alcool qu'on adore.",
    allergens: [],
  },
  {
    id: "color-mojito",
    name: "Mojito",
    price: 9.5,
    category: "virgin-cocktails",
    description: "Mojito virgin aux couleurs red ou blue, frais et festif.",
    allergens: [],
    flavors: ["Red", "Blue"],
  },
  {
    id: "energetic-mojito",
    name: "Energetic mojito",
    price: 13.5,
    category: "virgin-cocktails",
    description: "Mojito boosté pour celles et ceux qui veulent un coup de pep's.",
    allergens: [],
  },
  {
    id: "passion-mojito",
    name: "Passion mojito",
    price: 10.5,
    category: "virgin-cocktails",
    description: "Fruit de la passion et menthe, acidulé et très parfumé.",
    allergens: [],
    badge: "nouveau",
  },
  {
    id: "pina-colada",
    name: "Piña colada",
    price: 8.5,
    category: "cocktails-smooth",
    description: "Ananas et coco en version smooth, sans alcool, tout en douceur.",
    allergens: [],
  },
  {
    id: "fraise-banane-colada",
    name: "Fraise banane colada",
    price: 9.5,
    category: "cocktails-smooth",
    description: "Fraise, banane et touche coco, crémeux et ensoleillé.",
    allergens: ["lait"],
  },
  {
    id: "tropical-smooth",
    name: "Tropical (mangue / ananas / pêche)",
    price: 10.5,
    category: "cocktails-smooth",
    description: "Trio tropical mixé onctueux, comme un coucher de soleil en verre.",
    allergens: ["lait"],
  },
  {
    id: "crushed-berry",
    name: "Crushed",
    price: 7,
    category: "crushed",
    description: "Glaçons écrasés aux fruits : myrtille, curaçao ou fraise.",
    allergens: [],
    flavors: ["Blueberry", "Curaçao", "Fraise"],
  },
  {
    id: "watermelon-crush",
    name: "Watermelon",
    price: 7,
    category: "crushed",
    description: "Pastèque écrasée sur glace, ultra fraîche et légère.",
    allergens: [],
  },
  {
    id: "peach-ice-crush",
    name: "Peach ice crush",
    price: 7.5,
    category: "crushed",
    description: "Pêche glacée concassée, parfum doux et texture granita.",
    allergens: [],
  },
  {
    id: "smoothie-oreo",
    name: "Smoothie",
    price: 12.5,
    category: "smoothies",
    description: "Smoothie mixé myrtille, vanille ou Oreo, épais et gourmand.",
    allergens: ["lait", "gluten"],
    flavors: ["Blueberry", "Vanille", "Oreo"],
  },
  {
    id: "fraise-banane",
    name: "Fraise-banane",
    price: 13.5,
    category: "smoothies",
    description: "Le duo classique fraise-banane, onctueux et familier.",
    allergens: ["lait"],
  },
  {
    id: "chocolat-banane",
    name: "Chocolat-banane",
    price: 13.5,
    category: "smoothies",
    description: "Banane et chocolat mixés, indulgence sans alcool.",
    allergens: ["lait"],
  },
  {
    id: "nutella-banane",
    name: "Nutella-banane",
    price: 14.5,
    category: "smoothies",
    description: "Nutella et banane, le smoothie le plus réconfortant de la carte.",
    allergens: ["lait", "fruits à coque"],
  },
  {
    id: "mangue-ananas",
    name: "Mangue-ananas",
    price: 13.5,
    category: "smoothies",
    description: "Mangue et ananas en smoothie tropical bien crémeux.",
    allergens: ["lait"],
  },
  {
    id: "ice-duo",
    name: "Duo",
    price: 6.5,
    category: "ice-cream",
    description: "Deux parfums de glace au choix, simple et efficace.",
    allergens: ["lait"],
  },
  {
    id: "ice-trio",
    name: "Trio",
    price: 8.5,
    category: "ice-cream",
    description: "Trois boules pour varier les plaisirs en une seule coupe.",
    allergens: ["lait"],
  },
  {
    id: "glace-chocolat",
    name: "Chocolat",
    price: 8.5,
    category: "ice-cream",
    description: "Glace chocolat intense, fondante et bien cacao.",
    allergens: ["lait"],
  },
  {
    id: "glace-fraise",
    name: "Fraise",
    price: 8.5,
    category: "ice-cream",
    description: "Glace fraise parfumée, fruitée et légère.",
    allergens: ["lait"],
  },
  {
    id: "ice-cup",
    name: "Ice cup",
    price: 25,
    category: "ice-cream",
    description: "Grande coupe glacée à partager, le spectacle sucré de la maison.",
    allergens: ["lait", "fruits à coque", "gluten"],
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

export function getItemById(id: string): MenuItem | undefined {
  return MENU.find((item) => item.id === id);
}

export function categoryItemCount(id: CategoryId): number {
  return MENU.filter((item) => item.category === id).length;
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
