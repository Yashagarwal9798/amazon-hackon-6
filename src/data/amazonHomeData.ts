export type HomeProduct = {
  name: string;
  label?: string;
  image: string;
};

export type HomeSection = {
  title: string;
  products: HomeProduct[];
};

export const navItems = [
  "All",
  "Fresh",
  "MX Player",
  "Sell",
  "Amazon Pay",
  "Gift Cards",
  "Gift Ideas",
  "Subscribe & Save",
  "Buy Again",
  "Prime",
  "AmazonBasics",
  "Health, Household & Personal Care",
];

export const homeSections: HomeSection[] = [
  {
    title: "Pick up where you left off",
    products: [
      {
        name: "Boldfit PowerBase",
        label: "Fitness",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=420&q=80",
      },
      {
        name: "Resistance bands",
        label: "Workout",
        image: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=420&q=80",
      },
      {
        name: "Massage gun",
        label: "Recovery",
        image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=420&q=80",
      },
      {
        name: "Yoga mat",
        label: "Home gym",
        image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=420&q=80",
      },
    ],
  },
  {
    title: "Beauty picks for you",
    products: [
      {
        name: "Lip care set",
        label: "Saved",
        image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=420&q=80",
      },
      {
        name: "Face serum",
        label: "Deal",
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=420&q=80",
      },
      {
        name: "Hair mask",
        label: "Prime",
        image: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=420&q=80",
      },
      {
        name: "Body mist",
        label: "New",
        image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=420&q=80",
      },
    ],
  },
  {
    title: "Buy again",
    products: [
      {
        name: "Shampoo",
        label: "Repeat",
        image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=420&q=80",
      },
      {
        name: "Coffee pouch",
        label: "Grocery",
        image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=420&q=80",
      },
      {
        name: "Notebook pack",
        label: "School",
        image: "https://images.unsplash.com/photo-1516414447565-b14be0adf13e?auto=format&fit=crop&w=420&q=80",
      },
      {
        name: "Cleaning spray",
        label: "Home",
        image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=420&q=80",
      },
    ],
  },
  {
    title: "Deals related to saved items",
    products: [
      {
        name: "Summer jacket",
        label: "Fashion",
        image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=420&q=80",
      },
      {
        name: "Wireless headphones",
        label: "Tech",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=420&q=80",
      },
      {
        name: "Desk lamp",
        label: "Home",
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=420&q=80",
      },
      {
        name: "Backpack",
        label: "Travel",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=420&q=80",
      },
    ],
  },
];

export const dealRows = [
  {
    title: "Recommended tech deals",
    subtitle: "Smartchoice Days",
    products: ["Laptops", "Earbuds", "Tablets", "Smart watches", "Power banks"],
  },
  {
    title: "Kitchen refresh",
    subtitle: "Deals for daily use",
    products: ["Air fryers", "Mixers", "Storage boxes", "Steel bottles", "Cookware"],
  },
];
