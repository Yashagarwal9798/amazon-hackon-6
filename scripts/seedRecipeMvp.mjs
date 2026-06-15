import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const env = readEnvFile(".env.local");
const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey || supabaseAnonKey === "your_supabase_anon_public_key") {
  throw new Error("Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local before seeding.");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const products = [
  {
    title: "Amul Paneer 200g",
    brand: "Amul",
    category: "dairy",
    aliases: ["paneer", "cottage cheese"],
    pack_size: "200g",
    unit: "g",
    price: 90,
    rating: 4.6,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Mother Dairy Paneer 200g",
    brand: "Mother Dairy",
    category: "dairy",
    aliases: ["paneer", "cottage cheese"],
    pack_size: "200g",
    unit: "g",
    price: 88,
    rating: 4.4,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Gowardhan Paneer 200g",
    brand: "Gowardhan",
    category: "dairy",
    aliases: ["paneer", "cottage cheese"],
    pack_size: "200g",
    unit: "g",
    price: 92,
    rating: 4.3,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Amul Butter 100g",
    brand: "Amul",
    category: "dairy",
    aliases: ["butter", "makhan"],
    pack_size: "100g",
    unit: "g",
    price: 58,
    rating: 4.7,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Britannia Butter 100g",
    brand: "Britannia",
    category: "dairy",
    aliases: ["butter", "makhan"],
    pack_size: "100g",
    unit: "g",
    price: 56,
    rating: 4.4,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Fresh Tomato 500g",
    brand: "Amazon Fresh",
    category: "vegetables",
    aliases: ["tomato", "tomatoes"],
    pack_size: "500g",
    unit: "g",
    price: 30,
    rating: 4.3,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Fresh Onion 500g",
    brand: "Amazon Fresh",
    category: "vegetables",
    aliases: ["onion", "onions", "pyaz"],
    pack_size: "500g",
    unit: "g",
    price: 35,
    rating: 4.2,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Amul Fresh Cream 250ml",
    brand: "Amul",
    category: "dairy",
    aliases: ["fresh cream", "cream", "malai"],
    pack_size: "250ml",
    unit: "ml",
    price: 75,
    rating: 4.5,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Mother Dairy Fresh Cream 200ml",
    brand: "Mother Dairy",
    category: "dairy",
    aliases: ["fresh cream", "cream", "malai"],
    pack_size: "200ml",
    unit: "ml",
    price: 68,
    rating: 4.2,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Cashew 100g",
    brand: "Solimo",
    category: "dry_fruits",
    aliases: ["cashew", "cashews", "kaju"],
    pack_size: "100g",
    unit: "g",
    price: 110,
    rating: 4.4,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1563412885-139e4045ebc3?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Vedaka Cashew 100g",
    brand: "Vedaka",
    category: "dry_fruits",
    aliases: ["cashew", "cashews", "kaju"],
    pack_size: "100g",
    unit: "g",
    price: 115,
    rating: 4.3,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1563412885-139e4045ebc3?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Ginger Garlic Paste 200g",
    brand: "Smith & Jones",
    category: "condiments",
    aliases: ["ginger garlic paste", "adrak lasun paste"],
    pack_size: "200g",
    unit: "g",
    price: 52,
    rating: 4.1,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Everest Garam Masala 100g",
    brand: "Everest",
    category: "spices",
    aliases: ["garam masala", "masala"],
    pack_size: "100g",
    unit: "g",
    price: 42,
    rating: 4.6,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Tata Sampann Garam Masala 100g",
    brand: "Tata Sampann",
    category: "spices",
    aliases: ["garam masala", "masala"],
    pack_size: "100g",
    unit: "g",
    price: 48,
    rating: 4.4,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Everest Kashmiri Red Chilli Powder 100g",
    brand: "Everest",
    category: "spices",
    aliases: ["red chilli powder", "kashmiri chilli powder", "chilli powder"],
    pack_size: "100g",
    unit: "g",
    price: 55,
    rating: 4.5,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Catch Kashmiri Red Chilli Powder 100g",
    brand: "Catch",
    category: "spices",
    aliases: ["red chilli powder", "kashmiri chilli powder", "chilli powder"],
    pack_size: "100g",
    unit: "g",
    price: 52,
    rating: 4.2,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Fresh Baby Corn 200g",
    brand: "Amazon Fresh",
    category: "vegetables",
    aliases: ["baby corn", "babycorn"],
    pack_size: "200g",
    unit: "g",
    price: 48,
    rating: 4.3,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1601593768790-dad065b97b8e?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Fresh Capsicum 500g",
    brand: "Amazon Fresh",
    category: "vegetables",
    aliases: ["capsicum", "bell pepper", "green capsicum"],
    pack_size: "500g",
    unit: "g",
    price: 52,
    rating: 4.2,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Ching's Secret Soy Sauce 200g",
    brand: "Ching's Secret",
    category: "condiments",
    aliases: ["soy sauce", "soya sauce"],
    pack_size: "200g",
    unit: "g",
    price: 55,
    rating: 4.4,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Ching's Secret Green Chilli Sauce 190g",
    brand: "Ching's Secret",
    category: "condiments",
    aliases: ["chilli sauce", "green chilli sauce"],
    pack_size: "190g",
    unit: "g",
    price: 60,
    rating: 4.3,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1598514982888-9ac6f8ae7e52?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Weikfield Corn Flour 500g",
    brand: "Weikfield",
    category: "staples",
    aliases: ["corn flour", "cornflour", "corn starch"],
    pack_size: "500g",
    unit: "g",
    price: 82,
    rating: 4.5,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Fresh Garlic 250g",
    brand: "Amazon Fresh",
    category: "vegetables",
    aliases: ["garlic", "lahsun"],
    pack_size: "250g",
    unit: "g",
    price: 45,
    rating: 4.2,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1615477550927-6ecb2c26a844?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Fresh Green Chilli 100g",
    brand: "Amazon Fresh",
    category: "vegetables",
    aliases: ["green chilli", "green chili", "chilli"],
    pack_size: "100g",
    unit: "g",
    price: 18,
    rating: 4.1,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1526346698789-22fd84314424?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Fortune Sunflower Oil 1L",
    brand: "Fortune",
    category: "staples",
    aliases: ["oil", "cooking oil", "sunflower oil"],
    pack_size: "1L",
    unit: "l",
    price: 145,
    rating: 4.5,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Tata Salt 1kg",
    brand: "Tata",
    category: "staples",
    aliases: ["salt", "namak"],
    pack_size: "1kg",
    unit: "kg",
    price: 28,
    rating: 4.6,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Amul Taaza Milk 1L",
    brand: "Amul",
    category: "dairy",
    aliases: ["milk", "taaza milk", "doodh"],
    pack_size: "1L",
    unit: "l",
    price: 72,
    rating: 4.6,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Fresh Eggs 6 pieces",
    brand: "Amazon Fresh",
    category: "eggs",
    aliases: ["eggs", "egg", "anda"],
    pack_size: "6 pieces",
    unit: "piece",
    price: 65,
    rating: 4.4,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Britannia White Bread 400g",
    brand: "Britannia",
    category: "bakery",
    aliases: ["bread", "white bread", "sandwich bread"],
    pack_size: "400g",
    unit: "g",
    price: 45,
    rating: 4.3,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "India Gate Basmati Rice 1kg",
    brand: "India Gate",
    category: "staples",
    aliases: ["rice", "basmati rice", "chawal"],
    pack_size: "1kg",
    unit: "kg",
    price: 145,
    rating: 4.5,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Aashirvaad Atta 1kg",
    brand: "Aashirvaad",
    category: "staples",
    aliases: ["atta", "wheat flour", "flour"],
    pack_size: "1kg",
    unit: "kg",
    price: 68,
    rating: 4.6,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Madhur Sugar 1kg",
    brand: "Madhur",
    category: "staples",
    aliases: ["sugar", "chini"],
    pack_size: "1kg",
    unit: "kg",
    price: 55,
    rating: 4.4,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1581441363689-1f3c3c414635?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Tata Tea Gold 250g",
    brand: "Tata Tea",
    category: "beverages",
    aliases: ["tea", "chai", "tea powder"],
    pack_size: "250g",
    unit: "g",
    price: 165,
    rating: 4.5,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Bru Instant Coffee 100g",
    brand: "Bru",
    category: "beverages",
    aliases: ["coffee", "instant coffee"],
    pack_size: "100g",
    unit: "g",
    price: 180,
    rating: 4.4,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Fresh Banana 1kg",
    brand: "Amazon Fresh",
    category: "fruits",
    aliases: ["banana", "bananas", "kela"],
    pack_size: "1kg",
    unit: "kg",
    price: 60,
    rating: 4.2,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Fresh Apple 1kg",
    brand: "Amazon Fresh",
    category: "fruits",
    aliases: ["apple", "apples", "seb"],
    pack_size: "1kg",
    unit: "kg",
    price: 180,
    rating: 4.3,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Colgate Toothpaste 150g",
    brand: "Colgate",
    category: "personal_care",
    aliases: ["toothpaste", "paste"],
    pack_size: "150g",
    unit: "g",
    price: 99,
    rating: 4.5,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Surf Excel Detergent 1kg",
    brand: "Surf Excel",
    category: "household",
    aliases: ["detergent", "washing powder", "laundry detergent"],
    pack_size: "1kg",
    unit: "kg",
    price: 199,
    rating: 4.5,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1583947581924-a31a2d2b563f?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Catch Black Pepper Powder 100g",
    brand: "Catch",
    category: "spices",
    aliases: ["pepper", "black pepper", "pepper powder"],
    pack_size: "100g",
    unit: "g",
    price: 120,
    rating: 4.4,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Lay's Classic Salted Chips 52g",
    brand: "Lay's",
    category: "snacks",
    aliases: ["chips", "potato chips", "wafers"],
    pack_size: "52g",
    unit: "g",
    price: 20,
    rating: 4.4,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Kurkure Masala Munch 75g",
    brand: "Kurkure",
    category: "snacks",
    aliases: ["kurkure", "masala munch", "chips", "namkeen"],
    pack_size: "75g",
    unit: "g",
    price: 20,
    rating: 4.3,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1613919113640-25732ec5e61f?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Haldiram's Aloo Bhujia 200g",
    brand: "Haldiram's",
    category: "snacks",
    aliases: ["namkeen", "bhujia", "aloo bhujia", "snacks"],
    pack_size: "200g",
    unit: "g",
    price: 55,
    rating: 4.5,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Coca-Cola 750ml",
    brand: "Coca-Cola",
    category: "beverages",
    aliases: ["cold drink", "soft drink", "cola", "coke"],
    pack_size: "750ml",
    unit: "ml",
    price: 40,
    rating: 4.4,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Real Mixed Fruit Juice 1L",
    brand: "Real",
    category: "beverages",
    aliases: ["juice", "fruit juice", "mixed fruit juice"],
    pack_size: "1L",
    unit: "l",
    price: 115,
    rating: 4.3,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Monginis Chocolate Cake 500g",
    brand: "Monginis",
    category: "bakery",
    aliases: ["cake", "birthday cake", "chocolate cake"],
    pack_size: "500g",
    unit: "g",
    price: 399,
    rating: 4.2,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Britannia Treat Choco Cookies 120g",
    brand: "Britannia",
    category: "snacks",
    aliases: ["cookies", "biscuits", "choco cookies"],
    pack_size: "120g",
    unit: "g",
    price: 35,
    rating: 4.2,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Cadbury Celebrations 186g",
    brand: "Cadbury",
    category: "sweets",
    aliases: ["chocolate", "chocolates", "celebrations", "gift chocolate"],
    pack_size: "186g",
    unit: "g",
    price: 190,
    rating: 4.6,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Disposable Paper Plates 25 pieces",
    brand: "Solimo",
    category: "disposables",
    aliases: ["paper plates", "plates", "disposable plates"],
    pack_size: "25 pieces",
    unit: "piece",
    price: 75,
    rating: 4.2,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1603199506016-b9a594b593c0?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Disposable Paper Cups 50 pieces",
    brand: "Solimo",
    category: "disposables",
    aliases: ["paper cups", "cups", "disposable cups"],
    pack_size: "50 pieces",
    unit: "piece",
    price: 85,
    rating: 4.1,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1522992319-0365e5f11656?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Tissue Napkins 100 pieces",
    brand: "Presto",
    category: "disposables",
    aliases: ["tissue", "napkins", "tissue napkins"],
    pack_size: "100 pieces",
    unit: "piece",
    price: 70,
    rating: 4.3,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1583947581924-a31a2d2b563f?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Birthday Candles 24 pieces",
    brand: "Party Propz",
    category: "party_supplies",
    aliases: ["candles", "birthday candles", "cake candles"],
    pack_size: "24 pieces",
    unit: "piece",
    price: 49,
    rating: 4.1,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Balloon Pack 30 pieces",
    brand: "Party Propz",
    category: "party_supplies",
    aliases: ["balloons", "balloon", "party balloons"],
    pack_size: "30 pieces",
    unit: "piece",
    price: 99,
    rating: 4.0,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Dr Morepen Digital Thermometer",
    brand: "Dr Morepen",
    category: "healthcare",
    aliases: ["digital thermometer", "thermometer"],
    pack_size: "1 piece",
    unit: "piece",
    price: 199,
    rating: 4.3,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Electral ORS 21.8g Sachet",
    brand: "Electral",
    category: "healthcare",
    aliases: ["ors", "oral rehydration salts", "rehydration sachet"],
    pack_size: "21.8g",
    unit: "g",
    price: 24,
    rating: 4.5,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Dettol Antiseptic Liquid 250ml",
    brand: "Dettol",
    category: "healthcare",
    aliases: ["antiseptic liquid", "antiseptic", "wound cleaning liquid"],
    pack_size: "250ml",
    unit: "ml",
    price: 118,
    rating: 4.6,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Band-Aid Adhesive Bandages 20 pieces",
    brand: "Band-Aid",
    category: "healthcare",
    aliases: ["bandages", "adhesive bandage", "band aid", "plaster"],
    pack_size: "20 pieces",
    unit: "piece",
    price: 60,
    rating: 4.4,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Sterile Cotton Roll 100g",
    brand: "Hansaplast",
    category: "healthcare",
    aliases: ["cotton", "cotton roll", "sterile cotton"],
    pack_size: "100g",
    unit: "g",
    price: 75,
    rating: 4.2,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Vicks Vaporub 25ml",
    brand: "Vicks",
    category: "healthcare",
    aliases: ["vapor rub", "vapour rub", "vicks", "chest rub"],
    pack_size: "25ml",
    unit: "ml",
    price: 95,
    rating: 4.5,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Strepsils Cough Drops 8 pieces",
    brand: "Strepsils",
    category: "healthcare",
    aliases: ["cough drops", "lozenges", "throat lozenges"],
    pack_size: "8 pieces",
    unit: "piece",
    price: 45,
    rating: 4.3,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Savlon Hand Sanitizer 500ml",
    brand: "Savlon",
    category: "hygiene",
    aliases: ["hand sanitizer", "sanitizer"],
    pack_size: "500ml",
    unit: "ml",
    price: 125,
    rating: 4.4,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1584744982491-665216d95f8b?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "3 Ply Face Masks 50 pieces",
    brand: "Solimo",
    category: "hygiene",
    aliases: ["face masks", "mask", "masks", "surgical mask"],
    pack_size: "50 pieces",
    unit: "piece",
    price: 180,
    rating: 4.2,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Kleenex Facial Tissues 100 pulls",
    brand: "Kleenex",
    category: "personal_care",
    aliases: ["tissues", "facial tissues", "tissue box"],
    pack_size: "100 pieces",
    unit: "piece",
    price: 85,
    rating: 4.3,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1583947581924-a31a2d2b563f?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Whisper Choice Sanitary Pads 20 pieces",
    brand: "Whisper",
    category: "personal_care",
    aliases: ["sanitary pads", "pads", "period pads"],
    pack_size: "20 pieces",
    unit: "piece",
    price: 110,
    rating: 4.4,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1583947581924-a31a2d2b563f?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Eveready LED Torch",
    brand: "Eveready",
    category: "emergency",
    aliases: ["torch", "flashlight", "led torch"],
    pack_size: "1 piece",
    unit: "piece",
    price: 249,
    rating: 4.3,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1518066000714-58c45f1a2c0a?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Duracell AA Batteries 4 pieces",
    brand: "Duracell",
    category: "emergency",
    aliases: ["batteries", "aa batteries", "battery"],
    pack_size: "4 pieces",
    unit: "piece",
    price: 160,
    rating: 4.5,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Ambrane 10000mAh Power Bank",
    brand: "Ambrane",
    category: "electronics",
    aliases: ["power bank", "mobile charger", "battery backup"],
    pack_size: "1 piece",
    unit: "piece",
    price: 799,
    rating: 4.2,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Wax Candles 12 pieces",
    brand: "Home Mate",
    category: "household",
    aliases: ["candles", "wax candles", "emergency candles"],
    pack_size: "12 pieces",
    unit: "piece",
    price: 65,
    rating: 4.1,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1603006905393-cda766b7f015?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Ship Safety Matchbox 10 pieces",
    brand: "Ship",
    category: "household",
    aliases: ["matches", "matchbox", "safety matches"],
    pack_size: "10 pieces",
    unit: "piece",
    price: 20,
    rating: 4.0,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1603006905393-cda766b7f015?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Bisleri Water 1L",
    brand: "Bisleri",
    category: "beverages",
    aliases: ["bottled water", "water bottle", "drinking water", "water"],
    pack_size: "1L",
    unit: "l",
    price: 20,
    rating: 4.4,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1564419320461-6870880221ad?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "MTR Ready to Eat Upma 180g",
    brand: "MTR",
    category: "ready_to_eat",
    aliases: ["ready to eat snacks", "ready to eat food", "instant food", "upma"],
    pack_size: "180g",
    unit: "g",
    price: 65,
    rating: 4.2,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Johnson's Wet Wipes 80 pieces",
    brand: "Johnson's",
    category: "hygiene",
    aliases: ["wet wipes", "wipes", "cleaning wipes"],
    pack_size: "80 pieces",
    unit: "piece",
    price: 190,
    rating: 4.3,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1583947581924-a31a2d2b563f?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Good Knight Mosquito Repellent Roll-On 8ml",
    brand: "Good Knight",
    category: "household",
    aliases: ["mosquito repellent", "repellent", "mosquito roll on"],
    pack_size: "8ml",
    unit: "ml",
    price: 75,
    rating: 4.2,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=320&q=80",
  },
  {
    title: "Garbage Bags 30 pieces",
    brand: "Presto",
    category: "household",
    aliases: ["garbage bags", "trash bags", "waste bags"],
    pack_size: "30 pieces",
    unit: "piece",
    price: 110,
    rating: 4.3,
    available: true,
    delivery_eta_minutes: 7,
    image_url: "https://images.unsplash.com/photo-1583947581924-a31a2d2b563f?auto=format&fit=crop&w=320&q=80",
  },
];

const recipe = {
  name: "paneer butter masala",
  aliases: ["paneer makhani", "butter paneer", "paneer butter masala recipe"],
  cuisine: "Indian",
  base_servings: 4,
  ingredients: [
    { name: "paneer", quantity: 400, unit: "g", category: "dairy" },
    { name: "butter", quantity: 100, unit: "g", category: "dairy" },
    { name: "tomato", quantity: 500, unit: "g", category: "vegetables" },
    { name: "onion", quantity: 300, unit: "g", category: "vegetables" },
    { name: "fresh cream", quantity: 200, unit: "ml", category: "dairy" },
    { name: "cashew", quantity: 50, unit: "g", category: "dry_fruits" },
    { name: "ginger garlic paste", quantity: 50, unit: "g", category: "condiments" },
    { name: "garam masala", quantity: 20, unit: "g", category: "spices" },
    { name: "red chilli powder", quantity: 20, unit: "g", category: "spices" },
  ],
  instructions: "Classic North Indian paneer curry with tomato, butter, cream, and spices.",
  source: "mvp_seed",
};

const occasionTemplates = [
  {
    name: "birthday party",
    aliases: ["birthday", "bday", "kids birthday", "birthday celebration"],
    required_slots: ["guestCount"],
    item_requirements: [
      { name: "cake", quantity: 500, unit: "g", category: "bakery" },
      { name: "chips", quantity: 5, unit: "pack", category: "snacks" },
      { name: "cold drink", quantity: 3, unit: "l", category: "beverages" },
      { name: "juice", quantity: 2, unit: "l", category: "beverages" },
      { name: "paper plates", quantity: 15, unit: "piece", category: "disposables" },
      { name: "paper cups", quantity: 15, unit: "piece", category: "disposables" },
      { name: "tissue napkins", quantity: 30, unit: "piece", category: "disposables" },
      { name: "birthday candles", quantity: 1, unit: "pack", category: "party_supplies" },
      { name: "balloons", quantity: 1, unit: "pack", category: "party_supplies" },
      { name: "chocolates", quantity: 2, unit: "pack", category: "sweets" },
    ],
  },
  {
    name: "movie night",
    aliases: ["movie party", "movie screening", "watch party"],
    required_slots: ["guestCount"],
    item_requirements: [
      { name: "chips", quantity: 4, unit: "pack", category: "snacks" },
      { name: "namkeen", quantity: 2, unit: "pack", category: "snacks" },
      { name: "cookies", quantity: 2, unit: "pack", category: "snacks" },
      { name: "cold drink", quantity: 3, unit: "l", category: "beverages" },
      { name: "paper cups", quantity: 10, unit: "piece", category: "disposables" },
      { name: "tissue napkins", quantity: 20, unit: "piece", category: "disposables" },
    ],
  },
  {
    name: "office meeting",
    aliases: ["team meeting", "client meeting", "office snacks"],
    required_slots: ["guestCount"],
    item_requirements: [
      { name: "cookies", quantity: 3, unit: "pack", category: "snacks" },
      { name: "juice", quantity: 3, unit: "l", category: "beverages" },
      { name: "paper cups", quantity: 20, unit: "piece", category: "disposables" },
      { name: "tissue napkins", quantity: 30, unit: "piece", category: "disposables" },
      { name: "chocolates", quantity: 2, unit: "pack", category: "sweets" },
    ],
  },
];

const healthcareTemplates = [
  {
    name: "cold care essentials",
    aliases: ["cold care", "cough cold", "cold and cough", "flu support", "fever and cold"],
    safety_message:
      "Basic care items only. This is not medical advice. Consult a qualified clinician for severe or persistent symptoms.",
    item_requirements: [
      { name: "digital thermometer", quantity: 1, unit: "piece", category: "healthcare" },
      { name: "ors", quantity: 4, unit: "pack", category: "healthcare" },
      { name: "hand sanitizer", quantity: 1, unit: "pack", category: "hygiene" },
      { name: "face masks", quantity: 10, unit: "piece", category: "hygiene" },
      { name: "tissues", quantity: 2, unit: "pack", category: "personal_care" },
      { name: "vapor rub", quantity: 1, unit: "pack", category: "healthcare" },
      { name: "cough drops", quantity: 2, unit: "pack", category: "healthcare" },
    ],
  },
  {
    name: "wound care essentials",
    aliases: ["wound care", "cut care", "first aid for cut", "minor injury"],
    safety_message:
      "Basic first-aid supplies only. This is not medical advice. Seek medical help for deep cuts, heavy bleeding, infection, or severe pain.",
    item_requirements: [
      { name: "antiseptic liquid", quantity: 1, unit: "pack", category: "healthcare" },
      { name: "bandages", quantity: 1, unit: "pack", category: "healthcare" },
      { name: "cotton", quantity: 1, unit: "pack", category: "healthcare" },
      { name: "hand sanitizer", quantity: 1, unit: "pack", category: "hygiene" },
      { name: "face masks", quantity: 5, unit: "piece", category: "hygiene" },
    ],
  },
  {
    name: "hygiene essentials",
    aliases: ["hygiene kit", "wellness kit", "basic care kit"],
    safety_message:
      "Basic hygiene essentials only. This is not medical advice. Consult a qualified clinician for health concerns.",
    item_requirements: [
      { name: "hand sanitizer", quantity: 1, unit: "pack", category: "hygiene" },
      { name: "face masks", quantity: 10, unit: "piece", category: "hygiene" },
      { name: "tissues", quantity: 2, unit: "pack", category: "personal_care" },
      { name: "sanitary pads", quantity: 1, unit: "pack", category: "personal_care" },
    ],
  },
];

const emergencyTemplates = [
  {
    name: "power cut essentials",
    aliases: ["power cut", "electricity outage", "load shedding", "power outage", "light gone"],
    item_requirements: [
      { name: "torch", quantity: 1, unit: "piece", category: "emergency" },
      { name: "batteries", quantity: 1, unit: "pack", category: "emergency" },
      { name: "power bank", quantity: 1, unit: "piece", category: "electronics" },
      { name: "candles", quantity: 1, unit: "pack", category: "household" },
      { name: "matches", quantity: 1, unit: "pack", category: "household" },
      { name: "bottled water", quantity: 4, unit: "l", category: "beverages" },
      { name: "ready to eat snacks", quantity: 4, unit: "pack", category: "ready_to_eat" },
      { name: "mosquito repellent", quantity: 1, unit: "pack", category: "household" },
    ],
  },
  {
    name: "water shortage essentials",
    aliases: ["water shortage", "no water", "water cut", "water supply issue"],
    item_requirements: [
      { name: "bottled water", quantity: 8, unit: "l", category: "beverages" },
      { name: "wet wipes", quantity: 1, unit: "pack", category: "hygiene" },
      { name: "hand sanitizer", quantity: 1, unit: "pack", category: "hygiene" },
      { name: "paper plates", quantity: 1, unit: "pack", category: "disposables" },
      { name: "paper cups", quantity: 1, unit: "pack", category: "disposables" },
      { name: "garbage bags", quantity: 1, unit: "pack", category: "household" },
    ],
  },
  {
    name: "heavy rain essentials",
    aliases: ["heavy rain", "rain emergency", "flood prep", "storm prep", "monsoon emergency"],
    item_requirements: [
      { name: "bottled water", quantity: 6, unit: "l", category: "beverages" },
      { name: "ready to eat snacks", quantity: 4, unit: "pack", category: "ready_to_eat" },
      { name: "torch", quantity: 1, unit: "piece", category: "emergency" },
      { name: "batteries", quantity: 1, unit: "pack", category: "emergency" },
      { name: "power bank", quantity: 1, unit: "piece", category: "electronics" },
      { name: "wet wipes", quantity: 1, unit: "pack", category: "hygiene" },
      { name: "garbage bags", quantity: 1, unit: "pack", category: "household" },
    ],
  },
];

await seedProducts();
await seedRecipe();
await seedOccasionTemplates();
await seedHealthcareTemplates();
await seedEmergencyTemplates();
await seedPreferenceProfile();
await seedPurchaseHistory();
await printCounts();

function readEnvFile(path) {
  const values = {};
  const lines = readFileSync(path, "utf8").split(/\r?\n/);

  for (const line of lines) {
    if (!line || line.trim().startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();
    values[key] = value;
  }

  return values;
}

async function seedProducts() {
  for (const product of products) {
    const exists = await findOne("product_catalog", "title", product.title);
    if (exists) {
      continue;
    }

    const { error } = await supabase.from("product_catalog").insert(product);
    if (error) {
      throw error;
    }
  }
}

async function seedRecipe() {
  const exists = await findOne("recipe_documents", "name", recipe.name);
  if (exists) {
    return;
  }

  const { error } = await supabase.from("recipe_documents").insert(recipe);
  if (error) {
    throw error;
  }
}

async function seedOccasionTemplates() {
  for (const template of occasionTemplates) {
    const exists = await findOne("occasion_templates", "name", template.name);
    if (exists) {
      continue;
    }

    const { error } = await supabase.from("occasion_templates").insert(template);
    if (error) {
      throw error;
    }
  }
}

async function seedHealthcareTemplates() {
  for (const template of healthcareTemplates) {
    const exists = await findOne("healthcare_templates", "name", template.name);
    if (exists) {
      continue;
    }

    const { error } = await supabase.from("healthcare_templates").insert(template);
    if (error) {
      throw error;
    }
  }
}

async function seedEmergencyTemplates() {
  for (const template of emergencyTemplates) {
    const exists = await findOne("emergency_templates", "name", template.name);
    if (exists) {
      continue;
    }

    const { error } = await supabase.from("emergency_templates").insert(template);
    if (error) {
      throw error;
    }
  }
}

async function seedPreferenceProfile() {
  const { error } = await supabase.from("user_preference_profiles").upsert(
    {
      user_id: "demo-user",
      preferred_brands_by_category: {
        dairy: ["Amul"],
        spices: ["Everest"],
        vegetables: ["Amazon Fresh"],
        fruits: ["Amazon Fresh"],
        eggs: ["Amazon Fresh"],
        dry_fruits: ["Solimo"],
        condiments: ["Smith & Jones"],
        snacks: ["Haldiram's", "Lay's"],
        beverages: ["Coca-Cola", "Real", "Tata Tea", "Bru"],
        bakery: ["Monginis", "Britannia"],
        staples: ["Tata", "Aashirvaad", "India Gate"],
        sweets: ["Cadbury"],
        disposables: ["Solimo"],
        party_supplies: ["Party Propz"],
        healthcare: ["Dettol", "Dr Morepen"],
        hygiene: ["Savlon", "Solimo"],
        personal_care: ["Colgate", "Kleenex", "Whisper"],
        emergency: ["Eveready", "Duracell"],
        electronics: ["Ambrane"],
        household: ["Surf Excel", "Presto", "Good Knight"],
        ready_to_eat: ["MTR"],
      },
    },
    { onConflict: "user_id" },
  );

  if (error) {
    throw error;
  }
}

async function seedPurchaseHistory() {
  const purchases = [
    { product_title: "Amul Paneer 200g", brand: "Amul", category: "dairy", quantity: 2 },
    { product_title: "Amul Butter 100g", brand: "Amul", category: "dairy", quantity: 1 },
    { product_title: "Everest Garam Masala 100g", brand: "Everest", category: "spices", quantity: 1 },
    { product_title: "Amul Taaza Milk 1L", brand: "Amul", category: "dairy", quantity: 2 },
    { product_title: "Britannia White Bread 400g", brand: "Britannia", category: "bakery", quantity: 1 },
  ];

  for (const purchase of purchases) {
    const exists = await findPurchase(purchase.product_title);
    if (exists) {
      continue;
    }

    const { error } = await supabase.from("user_purchase_history").insert({
      user_id: "demo-user",
      ...purchase,
    });

    if (error) {
      throw error;
    }
  }
}

async function printCounts() {
  const productCount = await countRows("product_catalog");
  const recipeCount = await countRows("recipe_documents");
  const occasionCount = await countRows("occasion_templates");
  const healthcareCount = await countRows("healthcare_templates");
  const emergencyCount = await countRows("emergency_templates");
  const preferenceCount = await countRows("user_preference_profiles");

  console.log(
    `Seed complete: ${productCount} products, ${recipeCount} recipes, ${occasionCount} occasion templates, ${healthcareCount} healthcare templates, ${emergencyCount} emergency templates, ${preferenceCount} preference profile(s).`,
  );
}

async function findOne(table, column, value) {
  const { data, error } = await supabase.from(table).select("id").eq(column, value).maybeSingle();
  if (error) {
    throw error;
  }
  return data;
}

async function findPurchase(productTitle) {
  const { data, error } = await supabase
    .from("user_purchase_history")
    .select("id")
    .eq("user_id", "demo-user")
    .eq("product_title", productTitle)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

async function countRows(table) {
  const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true });
  if (error) {
    throw error;
  }
  return count ?? 0;
}
