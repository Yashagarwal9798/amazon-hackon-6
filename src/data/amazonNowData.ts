export type NowCategory = {
  name: string;
  image: string;
};

export type NowProduct = {
  name: string;
  size: string;
  price: number;
  mrp: number;
  discount: string;
  image: string;
  tag?: string;
};

export const nowCategories: NowCategory[] = [
  {
    name: "Beverages",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=220&q=80",
  },
  {
    name: "Snacks",
    image: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&w=220&q=80",
  },
  {
    name: "Ice cream",
    image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=220&q=80",
  },
  {
    name: "Bath & body",
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=220&q=80",
  },
  {
    name: "Cleaners",
    image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=220&q=80",
  },
  {
    name: "Vegetables",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=220&q=80",
  },
  {
    name: "Ready to cook",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=220&q=80",
  },
];

export const farmLootProducts: NowProduct[] = [
  {
    name: "Fresh Onion - Deal",
    size: "400 g",
    price: 8,
    mrp: 25,
    discount: "68% off",
    tag: "Steal Deal",
    image: "https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=320&q=80",
  },
  {
    name: "Fresh Local Tomato - Deal",
    size: "250 g",
    price: 8,
    mrp: 12,
    discount: "33% off",
    tag: "Steal Deal",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=320&q=80",
  },
  {
    name: "Fresh Green Chilli",
    size: "90 g",
    price: 8,
    mrp: 13,
    discount: "38% off",
    tag: "Steal Deal",
    image: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=320&q=80",
  },
  {
    name: "Fresh Coriander",
    size: "100 g",
    price: 8,
    mrp: 16,
    discount: "50% off",
    tag: "Steal Deal",
    image: "https://images.unsplash.com/photo-1600326145359-3a44909d1a39?auto=format&fit=crop&w=320&q=80",
  },
];

export const recommendedProducts: NowProduct[] = [
  {
    name: "Kwality Wall's Double Chocolate",
    size: "105 ml",
    price: 38,
    mrp: 40,
    discount: "5% off",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=320&q=80",
  },
  {
    name: "Amul Gold Tricone",
    size: "120 ml",
    price: 36,
    mrp: 40,
    discount: "10% off",
    image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=320&q=80",
  },
  {
    name: "Amul Coffee Bar Ice Cream",
    size: "60 ml",
    price: 17,
    mrp: 20,
    discount: "15% off",
    image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=320&q=80",
  },
  {
    name: "Cadbury Dairy Milk",
    size: "11 g",
    price: 10,
    mrp: 10,
    discount: "Everyday",
    image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=320&q=80",
  },
  {
    name: "Coca-Cola Can",
    size: "300 ml",
    price: 39,
    mrp: 40,
    discount: "2% off",
    image: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?auto=format&fit=crop&w=320&q=80",
  },
];
