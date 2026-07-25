export interface NavSubItem {
  label: string;
  href: string;
}

export interface NavItem {
  label: string;
  href: string;
  submenu: NavSubItem[];
}

export const navigationItems: NavItem[] = [
  {
    label: "Home",
    href: "/",
    submenu: [],
  },
  {
    label: "World",
    href: "/world",
    submenu: [
      { label: "Asia", href: "/world/asia" },
      { label: "Europe", href: "/world/europe" },
      { label: "Middle East", href: "/world/middle-east" },
      { label: "Africa", href: "/world/africa" },
      { label: "Americas", href: "/world/americas" },
    ],
  },
  {
    label: "Politics",
    href: "/politics",
    submenu: [
      { label: "U.S. Politics", href: "/politics/us-politics" },
      { label: "Elections", href: "/politics/elections" },
      { label: "Policy", href: "/politics/policy" },
      { label: "Opinion", href: "/politics/opinion" },
    ],
  },
  {
    label: "Business",
    href: "/business",
    submenu: [
      { label: "Markets", href: "/business/markets" },
      { label: "Economy", href: "/business/economy" },
      { label: "Technology", href: "/business/technology" },
      { label: "Finance", href: "/business/finance" },
    ],
  },
  {
    label: "Tech",
    href: "/tech",
    submenu: [
      { label: "AI & Machine Learning", href: "/tech/ai-machine-learning" },
      { label: "Software", href: "/tech/software" },
      { label: "Hardware", href: "/tech/hardware" },
      { label: "Startups", href: "/tech/startups" },
    ],
  },
  {
    label: "Sports",
    href: "/sports",
    submenu: [
      { label: "Football", href: "/sports/football" },
      { label: "Basketball", href: "/sports/basketball" },
      { label: "Soccer", href: "/sports/soccer" },
      { label: "Baseball", href: "/sports/baseball" },
    ],
  },
  {
    label: "Entertainment",
    href: "/entertainment",
    submenu: [
      { label: "Movies", href: "/entertainment/movies" },
      { label: "TV Shows", href: "/entertainment/tv-shows" },
      { label: "Music", href: "/entertainment/music" },
      { label: "Celebrity", href: "/entertainment/celebrity" },
    ],
  },
];

export const categories = [
  { name: "World", slug: "world" },
  { name: "Politics", slug: "politics" },
  { name: "Business", slug: "business" },
  { name: "Tech", slug: "tech" },
  { name: "Sports", slug: "sports" },
  { name: "Entertainment", slug: "entertainment" },
];

export const categoryMap: Record<string, string> = {
  world: "World",
  politics: "Politics",
  business: "Business",
  tech: "Tech",
  sports: "Sports",
  entertainment: "Entertainment",
};

export const subcategoryMap: Record<string, string> = {
  asia: "Asia",
  europe: "Europe",
  "middle-east": "Middle East",
  americas: "Americas",
  africa: "Africa",
  "us-politics": "U.S. Politics",
  elections: "Elections",
  policy: "Policy",
  opinion: "Opinion",
  economy: "Economy",
  finance: "Finance",
  markets: "Markets",
  technology: "Technology",
  "ai-machine-learning": "AI & Machine Learning",
  software: "Software",
  hardware: "Hardware",
  startups: "Startups",
  football: "Football",
  basketball: "Basketball",
  baseball: "Baseball",
  soccer: "Soccer",
  movies: "Movies",
  "tv-shows": "TV Shows",
  music: "Music",
  celebrity: "Celebrity",
};

export function formatName(slug: string): string {
  if (subcategoryMap[slug]) return subcategoryMap[slug];
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getSubcategorySlug(subcategory: string): string {
  const entry = Object.entries(subcategoryMap).find(
    ([, name]) => name.toLowerCase() === subcategory.toLowerCase()
  );
  return entry?.[0] || subcategory.toLowerCase().replace(/\s+/g, "-");
}
