-- Amazon Sidekick recipe MVP seed data.
-- Run this after schema.sql in Supabase Dashboard -> SQL Editor.

insert into public.product_catalog (
  title,
  brand,
  category,
  aliases,
  pack_size,
  unit,
  price,
  rating,
  available,
  delivery_eta_minutes,
  image_url
)
select
  'Amul Paneer 200g',
  'Amul',
  'dairy',
  array['paneer', 'cottage cheese'],
  '200g',
  'g',
  90,
  4.6,
  true,
  7,
  'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=320&q=80'
where not exists (select 1 from public.product_catalog where title = 'Amul Paneer 200g');

insert into public.product_catalog (
  title,
  brand,
  category,
  aliases,
  pack_size,
  unit,
  price,
  rating,
  available,
  delivery_eta_minutes,
  image_url
)
select
  'Amul Butter 100g',
  'Amul',
  'dairy',
  array['butter', 'makhan'],
  '100g',
  'g',
  58,
  4.7,
  true,
  7,
  'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=320&q=80'
where not exists (select 1 from public.product_catalog where title = 'Amul Butter 100g');

insert into public.product_catalog (
  title,
  brand,
  category,
  aliases,
  pack_size,
  unit,
  price,
  rating,
  available,
  delivery_eta_minutes,
  image_url
)
select
  'Fresh Tomato 500g',
  'Amazon Fresh',
  'vegetables',
  array['tomato', 'tomatoes'],
  '500g',
  'g',
  30,
  4.3,
  true,
  7,
  'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=320&q=80'
where not exists (select 1 from public.product_catalog where title = 'Fresh Tomato 500g');

insert into public.product_catalog (
  title,
  brand,
  category,
  aliases,
  pack_size,
  unit,
  price,
  rating,
  available,
  delivery_eta_minutes,
  image_url
)
select
  'Fresh Onion 500g',
  'Amazon Fresh',
  'vegetables',
  array['onion', 'onions', 'pyaz'],
  '500g',
  'g',
  35,
  4.2,
  true,
  7,
  'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=320&q=80'
where not exists (select 1 from public.product_catalog where title = 'Fresh Onion 500g');

insert into public.product_catalog (
  title,
  brand,
  category,
  aliases,
  pack_size,
  unit,
  price,
  rating,
  available,
  delivery_eta_minutes,
  image_url
)
select
  'Amul Fresh Cream 250ml',
  'Amul',
  'dairy',
  array['fresh cream', 'cream', 'malai'],
  '250ml',
  'ml',
  75,
  4.5,
  true,
  7,
  'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=320&q=80'
where not exists (select 1 from public.product_catalog where title = 'Amul Fresh Cream 250ml');

insert into public.product_catalog (
  title,
  brand,
  category,
  aliases,
  pack_size,
  unit,
  price,
  rating,
  available,
  delivery_eta_minutes,
  image_url
)
select
  'Cashew 100g',
  'Solimo',
  'dry_fruits',
  array['cashew', 'cashews', 'kaju'],
  '100g',
  'g',
  110,
  4.4,
  true,
  7,
  'https://images.unsplash.com/photo-1563412885-139e4045ebc3?auto=format&fit=crop&w=320&q=80'
where not exists (select 1 from public.product_catalog where title = 'Cashew 100g');

insert into public.product_catalog (
  title,
  brand,
  category,
  aliases,
  pack_size,
  unit,
  price,
  rating,
  available,
  delivery_eta_minutes,
  image_url
)
select
  'Ginger Garlic Paste 200g',
  'Smith & Jones',
  'condiments',
  array['ginger garlic paste', 'adrak lasun paste'],
  '200g',
  'g',
  52,
  4.1,
  true,
  7,
  'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=320&q=80'
where not exists (select 1 from public.product_catalog where title = 'Ginger Garlic Paste 200g');

insert into public.product_catalog (
  title,
  brand,
  category,
  aliases,
  pack_size,
  unit,
  price,
  rating,
  available,
  delivery_eta_minutes,
  image_url
)
select
  'Everest Garam Masala 100g',
  'Everest',
  'spices',
  array['garam masala', 'masala'],
  '100g',
  'g',
  42,
  4.6,
  true,
  7,
  'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=320&q=80'
where not exists (select 1 from public.product_catalog where title = 'Everest Garam Masala 100g');

insert into public.product_catalog (
  title,
  brand,
  category,
  aliases,
  pack_size,
  unit,
  price,
  rating,
  available,
  delivery_eta_minutes,
  image_url
)
select
  'Everest Kashmiri Red Chilli Powder 100g',
  'Everest',
  'spices',
  array['red chilli powder', 'kashmiri chilli powder', 'chilli powder'],
  '100g',
  'g',
  55,
  4.5,
  true,
  7,
  'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=320&q=80'
where not exists (select 1 from public.product_catalog where title = 'Everest Kashmiri Red Chilli Powder 100g');

insert into public.product_catalog (
  title,
  brand,
  category,
  aliases,
  pack_size,
  unit,
  price,
  rating,
  available,
  delivery_eta_minutes,
  image_url
)
select *
from (
  values
    (
      'Mother Dairy Paneer 200g',
      'Mother Dairy',
      'dairy',
      array['paneer', 'cottage cheese']::text[],
      '200g',
      'g',
      88::numeric,
      4.4::numeric,
      true,
      7,
      'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=320&q=80'
    ),
    (
      'Gowardhan Paneer 200g',
      'Gowardhan',
      'dairy',
      array['paneer', 'cottage cheese']::text[],
      '200g',
      'g',
      92::numeric,
      4.3::numeric,
      true,
      7,
      'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=320&q=80'
    ),
    (
      'Britannia Butter 100g',
      'Britannia',
      'dairy',
      array['butter', 'makhan']::text[],
      '100g',
      'g',
      56::numeric,
      4.4::numeric,
      true,
      7,
      'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=320&q=80'
    ),
    (
      'Mother Dairy Fresh Cream 200ml',
      'Mother Dairy',
      'dairy',
      array['fresh cream', 'cream', 'malai']::text[],
      '200ml',
      'ml',
      68::numeric,
      4.2::numeric,
      true,
      7,
      'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=320&q=80'
    ),
    (
      'Vedaka Cashew 100g',
      'Vedaka',
      'dry_fruits',
      array['cashew', 'cashews', 'kaju']::text[],
      '100g',
      'g',
      115::numeric,
      4.3::numeric,
      true,
      7,
      'https://images.unsplash.com/photo-1563412885-139e4045ebc3?auto=format&fit=crop&w=320&q=80'
    ),
    (
      'Tata Sampann Garam Masala 100g',
      'Tata Sampann',
      'spices',
      array['garam masala', 'masala']::text[],
      '100g',
      'g',
      48::numeric,
      4.4::numeric,
      true,
      7,
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=320&q=80'
    ),
    (
      'Catch Kashmiri Red Chilli Powder 100g',
      'Catch',
      'spices',
      array['red chilli powder', 'kashmiri chilli powder', 'chilli powder']::text[],
      '100g',
      'g',
      52::numeric,
      4.2::numeric,
      true,
      7,
      'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=320&q=80'
    ),
    (
      'Fresh Baby Corn 200g',
      'Amazon Fresh',
      'vegetables',
      array['baby corn', 'babycorn']::text[],
      '200g',
      'g',
      48::numeric,
      4.3::numeric,
      true,
      7,
      'https://images.unsplash.com/photo-1601593768790-dad065b97b8e?auto=format&fit=crop&w=320&q=80'
    ),
    (
      'Fresh Capsicum 500g',
      'Amazon Fresh',
      'vegetables',
      array['capsicum', 'bell pepper', 'green capsicum']::text[],
      '500g',
      'g',
      52::numeric,
      4.2::numeric,
      true,
      7,
      'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=320&q=80'
    ),
    (
      'Ching''s Secret Soy Sauce 200g',
      'Ching''s Secret',
      'condiments',
      array['soy sauce', 'soya sauce']::text[],
      '200g',
      'g',
      55::numeric,
      4.4::numeric,
      true,
      7,
      'https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?auto=format&fit=crop&w=320&q=80'
    ),
    (
      'Ching''s Secret Green Chilli Sauce 190g',
      'Ching''s Secret',
      'condiments',
      array['chilli sauce', 'green chilli sauce']::text[],
      '190g',
      'g',
      60::numeric,
      4.3::numeric,
      true,
      7,
      'https://images.unsplash.com/photo-1598514982888-9ac6f8ae7e52?auto=format&fit=crop&w=320&q=80'
    ),
    (
      'Weikfield Corn Flour 500g',
      'Weikfield',
      'staples',
      array['corn flour', 'cornflour', 'corn starch']::text[],
      '500g',
      'g',
      82::numeric,
      4.5::numeric,
      true,
      7,
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=320&q=80'
    ),
    (
      'Fresh Garlic 250g',
      'Amazon Fresh',
      'vegetables',
      array['garlic', 'lahsun']::text[],
      '250g',
      'g',
      45::numeric,
      4.2::numeric,
      true,
      7,
      'https://images.unsplash.com/photo-1615477550927-6ecb2c26a844?auto=format&fit=crop&w=320&q=80'
    ),
    (
      'Fresh Green Chilli 100g',
      'Amazon Fresh',
      'vegetables',
      array['green chilli', 'green chili', 'chilli']::text[],
      '100g',
      'g',
      18::numeric,
      4.1::numeric,
      true,
      7,
      'https://images.unsplash.com/photo-1526346698789-22fd84314424?auto=format&fit=crop&w=320&q=80'
    ),
    (
      'Fortune Sunflower Oil 1L',
      'Fortune',
      'staples',
      array['oil', 'cooking oil', 'sunflower oil']::text[],
      '1L',
      'l',
      145::numeric,
      4.5::numeric,
      true,
      7,
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=320&q=80'
    ),
    (
      'Tata Salt 1kg',
      'Tata',
      'staples',
      array['salt', 'namak']::text[],
      '1kg',
      'kg',
      28::numeric,
      4.6::numeric,
      true,
      7,
      'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?auto=format&fit=crop&w=320&q=80'
    ),
    (
      'Catch Black Pepper Powder 100g',
      'Catch',
      'spices',
      array['pepper', 'black pepper', 'pepper powder']::text[],
      '100g',
      'g',
      120::numeric,
      4.4::numeric,
      true,
      7,
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=320&q=80'
    ),
    (
      'Lay''s Classic Salted Chips 52g',
      'Lay''s',
      'snacks',
      array['chips', 'potato chips', 'wafers']::text[],
      '52g',
      'g',
      20::numeric,
      4.4::numeric,
      true,
      7,
      'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=320&q=80'
    ),
    (
      'Kurkure Masala Munch 75g',
      'Kurkure',
      'snacks',
      array['kurkure', 'masala munch', 'chips', 'namkeen']::text[],
      '75g',
      'g',
      20::numeric,
      4.3::numeric,
      true,
      7,
      'https://images.unsplash.com/photo-1613919113640-25732ec5e61f?auto=format&fit=crop&w=320&q=80'
    ),
    (
      'Haldiram''s Aloo Bhujia 200g',
      'Haldiram''s',
      'snacks',
      array['namkeen', 'bhujia', 'aloo bhujia', 'snacks']::text[],
      '200g',
      'g',
      55::numeric,
      4.5::numeric,
      true,
      7,
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=320&q=80'
    ),
    (
      'Coca-Cola 750ml',
      'Coca-Cola',
      'beverages',
      array['cold drink', 'soft drink', 'cola', 'coke']::text[],
      '750ml',
      'ml',
      40::numeric,
      4.4::numeric,
      true,
      7,
      'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=320&q=80'
    ),
    (
      'Real Mixed Fruit Juice 1L',
      'Real',
      'beverages',
      array['juice', 'fruit juice', 'mixed fruit juice']::text[],
      '1L',
      'l',
      115::numeric,
      4.3::numeric,
      true,
      7,
      'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=320&q=80'
    ),
    (
      'Monginis Chocolate Cake 500g',
      'Monginis',
      'bakery',
      array['cake', 'birthday cake', 'chocolate cake']::text[],
      '500g',
      'g',
      399::numeric,
      4.2::numeric,
      true,
      7,
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=320&q=80'
    ),
    (
      'Britannia Treat Choco Cookies 120g',
      'Britannia',
      'snacks',
      array['cookies', 'biscuits', 'choco cookies']::text[],
      '120g',
      'g',
      35::numeric,
      4.2::numeric,
      true,
      7,
      'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=320&q=80'
    ),
    (
      'Cadbury Celebrations 186g',
      'Cadbury',
      'sweets',
      array['chocolate', 'chocolates', 'celebrations', 'gift chocolate']::text[],
      '186g',
      'g',
      190::numeric,
      4.6::numeric,
      true,
      7,
      'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=320&q=80'
    ),
    (
      'Disposable Paper Plates 25 pieces',
      'Solimo',
      'disposables',
      array['paper plates', 'plates', 'disposable plates']::text[],
      '25 pieces',
      'piece',
      75::numeric,
      4.2::numeric,
      true,
      7,
      'https://images.unsplash.com/photo-1603199506016-b9a594b593c0?auto=format&fit=crop&w=320&q=80'
    ),
    (
      'Disposable Paper Cups 50 pieces',
      'Solimo',
      'disposables',
      array['paper cups', 'cups', 'disposable cups']::text[],
      '50 pieces',
      'piece',
      85::numeric,
      4.1::numeric,
      true,
      7,
      'https://images.unsplash.com/photo-1522992319-0365e5f11656?auto=format&fit=crop&w=320&q=80'
    ),
    (
      'Tissue Napkins 100 pieces',
      'Presto',
      'disposables',
      array['tissue', 'napkins', 'tissue napkins']::text[],
      '100 pieces',
      'piece',
      70::numeric,
      4.3::numeric,
      true,
      7,
      'https://images.unsplash.com/photo-1583947581924-a31a2d2b563f?auto=format&fit=crop&w=320&q=80'
    ),
    (
      'Birthday Candles 24 pieces',
      'Party Propz',
      'party_supplies',
      array['candles', 'birthday candles', 'cake candles']::text[],
      '24 pieces',
      'piece',
      49::numeric,
      4.1::numeric,
      true,
      7,
      'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=320&q=80'
    ),
    (
      'Balloon Pack 30 pieces',
      'Party Propz',
      'party_supplies',
      array['balloons', 'balloon', 'party balloons']::text[],
      '30 pieces',
      'piece',
      99::numeric,
      4.0::numeric,
      true,
      7,
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=320&q=80'
    ),
    (
      'Dr Morepen Digital Thermometer',
      'Dr Morepen',
      'healthcare',
      array['digital thermometer', 'thermometer']::text[],
      '1 piece',
      'piece',
      199::numeric,
      4.3::numeric,
      true,
      7,
      'https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&w=320&q=80'
    ),
    (
      'Electral ORS 21.8g Sachet',
      'Electral',
      'healthcare',
      array['ors', 'oral rehydration salts', 'rehydration sachet']::text[],
      '21.8g',
      'g',
      24::numeric,
      4.5::numeric,
      true,
      7,
      'https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&w=320&q=80'
    ),
    (
      'Dettol Antiseptic Liquid 250ml',
      'Dettol',
      'healthcare',
      array['antiseptic liquid', 'antiseptic', 'wound cleaning liquid']::text[],
      '250ml',
      'ml',
      118::numeric,
      4.6::numeric,
      true,
      7,
      'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=320&q=80'
    ),
    (
      'Band-Aid Adhesive Bandages 20 pieces',
      'Band-Aid',
      'healthcare',
      array['bandages', 'adhesive bandage', 'band aid', 'plaster']::text[],
      '20 pieces',
      'piece',
      60::numeric,
      4.4::numeric,
      true,
      7,
      'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=320&q=80'
    ),
    (
      'Sterile Cotton Roll 100g',
      'Hansaplast',
      'healthcare',
      array['cotton', 'cotton roll', 'sterile cotton']::text[],
      '100g',
      'g',
      75::numeric,
      4.2::numeric,
      true,
      7,
      'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=320&q=80'
    ),
    (
      'Vicks Vaporub 25ml',
      'Vicks',
      'healthcare',
      array['vapor rub', 'vapour rub', 'vicks', 'chest rub']::text[],
      '25ml',
      'ml',
      95::numeric,
      4.5::numeric,
      true,
      7,
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=320&q=80'
    ),
    (
      'Strepsils Cough Drops 8 pieces',
      'Strepsils',
      'healthcare',
      array['cough drops', 'lozenges', 'throat lozenges']::text[],
      '8 pieces',
      'piece',
      45::numeric,
      4.3::numeric,
      true,
      7,
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=320&q=80'
    ),
    (
      'Savlon Hand Sanitizer 500ml',
      'Savlon',
      'hygiene',
      array['hand sanitizer', 'sanitizer']::text[],
      '500ml',
      'ml',
      125::numeric,
      4.4::numeric,
      true,
      7,
      'https://images.unsplash.com/photo-1584744982491-665216d95f8b?auto=format&fit=crop&w=320&q=80'
    ),
    (
      '3 Ply Face Masks 50 pieces',
      'Solimo',
      'hygiene',
      array['face masks', 'mask', 'masks', 'surgical mask']::text[],
      '50 pieces',
      'piece',
      180::numeric,
      4.2::numeric,
      true,
      7,
      'https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&w=320&q=80'
    ),
    (
      'Kleenex Facial Tissues 100 pulls',
      'Kleenex',
      'personal_care',
      array['tissues', 'facial tissues', 'tissue box']::text[],
      '100 pieces',
      'piece',
      85::numeric,
      4.3::numeric,
      true,
      7,
      'https://images.unsplash.com/photo-1583947581924-a31a2d2b563f?auto=format&fit=crop&w=320&q=80'
    ),
    (
      'Whisper Choice Sanitary Pads 20 pieces',
      'Whisper',
      'personal_care',
      array['sanitary pads', 'pads', 'period pads']::text[],
      '20 pieces',
      'piece',
      110::numeric,
      4.4::numeric,
      true,
      7,
      'https://images.unsplash.com/photo-1583947581924-a31a2d2b563f?auto=format&fit=crop&w=320&q=80'
    ),
    (
      'Eveready LED Torch',
      'Eveready',
      'emergency',
      array['torch', 'flashlight', 'led torch']::text[],
      '1 piece',
      'piece',
      249::numeric,
      4.3::numeric,
      true,
      7,
      'https://images.unsplash.com/photo-1518066000714-58c45f1a2c0a?auto=format&fit=crop&w=320&q=80'
    ),
    (
      'Duracell AA Batteries 4 pieces',
      'Duracell',
      'emergency',
      array['batteries', 'aa batteries', 'battery']::text[],
      '4 pieces',
      'piece',
      160::numeric,
      4.5::numeric,
      true,
      7,
      'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=320&q=80'
    ),
    (
      'Ambrane 10000mAh Power Bank',
      'Ambrane',
      'electronics',
      array['power bank', 'mobile charger', 'battery backup']::text[],
      '1 piece',
      'piece',
      799::numeric,
      4.2::numeric,
      true,
      7,
      'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=320&q=80'
    ),
    (
      'Wax Candles 12 pieces',
      'Home Mate',
      'household',
      array['candles', 'wax candles', 'emergency candles']::text[],
      '12 pieces',
      'piece',
      65::numeric,
      4.1::numeric,
      true,
      7,
      'https://images.unsplash.com/photo-1603006905393-cda766b7f015?auto=format&fit=crop&w=320&q=80'
    ),
    (
      'Ship Safety Matchbox 10 pieces',
      'Ship',
      'household',
      array['matches', 'matchbox', 'safety matches']::text[],
      '10 pieces',
      'piece',
      20::numeric,
      4.0::numeric,
      true,
      7,
      'https://images.unsplash.com/photo-1603006905393-cda766b7f015?auto=format&fit=crop&w=320&q=80'
    ),
    (
      'Bisleri Water 1L',
      'Bisleri',
      'beverages',
      array['bottled water', 'water bottle', 'drinking water', 'water']::text[],
      '1L',
      'l',
      20::numeric,
      4.4::numeric,
      true,
      7,
      'https://images.unsplash.com/photo-1564419320461-6870880221ad?auto=format&fit=crop&w=320&q=80'
    ),
    (
      'MTR Ready to Eat Upma 180g',
      'MTR',
      'ready_to_eat',
      array['ready to eat snacks', 'ready to eat food', 'instant food', 'upma']::text[],
      '180g',
      'g',
      65::numeric,
      4.2::numeric,
      true,
      7,
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=320&q=80'
    ),
    (
      'Johnson''s Wet Wipes 80 pieces',
      'Johnson''s',
      'hygiene',
      array['wet wipes', 'wipes', 'cleaning wipes']::text[],
      '80 pieces',
      'piece',
      190::numeric,
      4.3::numeric,
      true,
      7,
      'https://images.unsplash.com/photo-1583947581924-a31a2d2b563f?auto=format&fit=crop&w=320&q=80'
    ),
    (
      'Good Knight Mosquito Repellent Roll-On 8ml',
      'Good Knight',
      'household',
      array['mosquito repellent', 'repellent', 'mosquito roll on']::text[],
      '8ml',
      'ml',
      75::numeric,
      4.2::numeric,
      true,
      7,
      'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=320&q=80'
    ),
    (
      'Garbage Bags 30 pieces',
      'Presto',
      'household',
      array['garbage bags', 'trash bags', 'waste bags']::text[],
      '30 pieces',
      'piece',
      110::numeric,
      4.3::numeric,
      true,
      7,
      'https://images.unsplash.com/photo-1583947581924-a31a2d2b563f?auto=format&fit=crop&w=320&q=80'
    )
) as seed(title, brand, category, aliases, pack_size, unit, price, rating, available, delivery_eta_minutes, image_url)
where not exists (
  select 1 from public.product_catalog
  where product_catalog.title = seed.title
);

insert into public.product_catalog (
  title,
  brand,
  category,
  aliases,
  pack_size,
  unit,
  price,
  rating,
  available,
  delivery_eta_minutes,
  image_url
)
select *
from (
  values
    (
      'Amul Taaza Milk 1L',
      'Amul',
      'dairy',
      array['milk', 'taaza milk', 'doodh']::text[],
      '1L',
      'l',
      72::numeric,
      4.6::numeric,
      true,
      7,
      'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=320&q=80'
    ),
    (
      'Fresh Eggs 6 pieces',
      'Amazon Fresh',
      'eggs',
      array['eggs', 'egg', 'anda']::text[],
      '6 pieces',
      'piece',
      65::numeric,
      4.4::numeric,
      true,
      7,
      'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=320&q=80'
    ),
    (
      'Britannia White Bread 400g',
      'Britannia',
      'bakery',
      array['bread', 'white bread', 'sandwich bread']::text[],
      '400g',
      'g',
      45::numeric,
      4.3::numeric,
      true,
      7,
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=320&q=80'
    ),
    (
      'India Gate Basmati Rice 1kg',
      'India Gate',
      'staples',
      array['rice', 'basmati rice', 'chawal']::text[],
      '1kg',
      'kg',
      145::numeric,
      4.5::numeric,
      true,
      7,
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=320&q=80'
    ),
    (
      'Aashirvaad Atta 1kg',
      'Aashirvaad',
      'staples',
      array['atta', 'wheat flour', 'flour']::text[],
      '1kg',
      'kg',
      68::numeric,
      4.6::numeric,
      true,
      7,
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=320&q=80'
    ),
    (
      'Madhur Sugar 1kg',
      'Madhur',
      'staples',
      array['sugar', 'chini']::text[],
      '1kg',
      'kg',
      55::numeric,
      4.4::numeric,
      true,
      7,
      'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?auto=format&fit=crop&w=320&q=80'
    ),
    (
      'Tata Tea Gold 250g',
      'Tata Tea',
      'beverages',
      array['tea', 'chai', 'tea powder']::text[],
      '250g',
      'g',
      165::numeric,
      4.5::numeric,
      true,
      7,
      'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=320&q=80'
    ),
    (
      'Bru Instant Coffee 100g',
      'Bru',
      'beverages',
      array['coffee', 'instant coffee']::text[],
      '100g',
      'g',
      180::numeric,
      4.4::numeric,
      true,
      7,
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=320&q=80'
    ),
    (
      'Fresh Banana 1kg',
      'Amazon Fresh',
      'fruits',
      array['banana', 'bananas', 'kela']::text[],
      '1kg',
      'kg',
      60::numeric,
      4.2::numeric,
      true,
      7,
      'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=320&q=80'
    ),
    (
      'Fresh Apple 1kg',
      'Amazon Fresh',
      'fruits',
      array['apple', 'apples', 'seb']::text[],
      '1kg',
      'kg',
      180::numeric,
      4.3::numeric,
      true,
      7,
      'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=320&q=80'
    ),
    (
      'Colgate Toothpaste 150g',
      'Colgate',
      'personal_care',
      array['toothpaste', 'paste']::text[],
      '150g',
      'g',
      99::numeric,
      4.5::numeric,
      true,
      7,
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=320&q=80'
    ),
    (
      'Surf Excel Detergent 1kg',
      'Surf Excel',
      'household',
      array['detergent', 'washing powder', 'laundry detergent']::text[],
      '1kg',
      'kg',
      199::numeric,
      4.5::numeric,
      true,
      7,
      'https://images.unsplash.com/photo-1583947581924-a31a2d2b563f?auto=format&fit=crop&w=320&q=80'
    )
) as seed(title, brand, category, aliases, pack_size, unit, price, rating, available, delivery_eta_minutes, image_url)
where not exists (
  select 1 from public.product_catalog
  where product_catalog.title = seed.title
);

insert into public.recipe_documents (
  name,
  aliases,
  cuisine,
  base_servings,
  ingredients,
  instructions,
  source
)
select
  'paneer butter masala',
  array['paneer makhani', 'butter paneer', 'paneer butter masala recipe'],
  'Indian',
  4,
  '[
    { "name": "paneer", "quantity": 400, "unit": "g", "category": "dairy" },
    { "name": "butter", "quantity": 100, "unit": "g", "category": "dairy" },
    { "name": "tomato", "quantity": 500, "unit": "g", "category": "vegetables" },
    { "name": "onion", "quantity": 300, "unit": "g", "category": "vegetables" },
    { "name": "fresh cream", "quantity": 200, "unit": "ml", "category": "dairy" },
    { "name": "cashew", "quantity": 50, "unit": "g", "category": "dry_fruits" },
    { "name": "ginger garlic paste", "quantity": 50, "unit": "g", "category": "condiments" },
    { "name": "garam masala", "quantity": 20, "unit": "g", "category": "spices" },
    { "name": "red chilli powder", "quantity": 20, "unit": "g", "category": "spices" }
  ]'::jsonb,
  'Classic North Indian paneer curry with tomato, butter, cream, and spices.',
  'mvp_seed'
where not exists (select 1 from public.recipe_documents where name = 'paneer butter masala');

insert into public.occasion_templates (
  name,
  aliases,
  required_slots,
  item_requirements
)
select *
from (
  values
  (
    'birthday party',
    array['birthday', 'bday', 'kids birthday', 'birthday celebration'],
    '["guestCount"]'::jsonb,
    '[
      { "name": "cake", "quantity": 500, "unit": "g", "category": "bakery" },
      { "name": "chips", "quantity": 5, "unit": "pack", "category": "snacks" },
      { "name": "cold drink", "quantity": 3, "unit": "l", "category": "beverages" },
      { "name": "juice", "quantity": 2, "unit": "l", "category": "beverages" },
      { "name": "paper plates", "quantity": 15, "unit": "piece", "category": "disposables" },
      { "name": "paper cups", "quantity": 15, "unit": "piece", "category": "disposables" },
      { "name": "tissue napkins", "quantity": 30, "unit": "piece", "category": "disposables" },
      { "name": "birthday candles", "quantity": 1, "unit": "pack", "category": "party_supplies" },
      { "name": "balloons", "quantity": 1, "unit": "pack", "category": "party_supplies" },
      { "name": "chocolates", "quantity": 2, "unit": "pack", "category": "sweets" }
    ]'::jsonb
  ),
  (
    'movie night',
    array['movie party', 'movie screening', 'watch party'],
    '["guestCount"]'::jsonb,
    '[
      { "name": "chips", "quantity": 4, "unit": "pack", "category": "snacks" },
      { "name": "namkeen", "quantity": 2, "unit": "pack", "category": "snacks" },
      { "name": "cookies", "quantity": 2, "unit": "pack", "category": "snacks" },
      { "name": "cold drink", "quantity": 3, "unit": "l", "category": "beverages" },
      { "name": "paper cups", "quantity": 10, "unit": "piece", "category": "disposables" },
      { "name": "tissue napkins", "quantity": 20, "unit": "piece", "category": "disposables" }
    ]'::jsonb
  ),
  (
    'office meeting',
    array['team meeting', 'client meeting', 'office snacks'],
    '["guestCount"]'::jsonb,
    '[
      { "name": "cookies", "quantity": 3, "unit": "pack", "category": "snacks" },
      { "name": "juice", "quantity": 3, "unit": "l", "category": "beverages" },
      { "name": "paper cups", "quantity": 20, "unit": "piece", "category": "disposables" },
      { "name": "tissue napkins", "quantity": 30, "unit": "piece", "category": "disposables" },
      { "name": "chocolates", "quantity": 2, "unit": "pack", "category": "sweets" }
    ]'::jsonb
  )
) as seed(name, aliases, required_slots, item_requirements)
where not exists (
  select 1 from public.occasion_templates
  where occasion_templates.name = seed.name
);

insert into public.healthcare_templates (
  name,
  aliases,
  safety_message,
  item_requirements
)
select *
from (
  values
  (
    'cold care essentials',
    array['cold care', 'cough cold', 'cold and cough', 'flu support', 'fever and cold'],
    'Basic care items only. This is not medical advice. Consult a qualified clinician for severe or persistent symptoms.',
    '[
      { "name": "digital thermometer", "quantity": 1, "unit": "piece", "category": "healthcare" },
      { "name": "ors", "quantity": 4, "unit": "pack", "category": "healthcare" },
      { "name": "hand sanitizer", "quantity": 1, "unit": "pack", "category": "hygiene" },
      { "name": "face masks", "quantity": 10, "unit": "piece", "category": "hygiene" },
      { "name": "tissues", "quantity": 2, "unit": "pack", "category": "personal_care" },
      { "name": "vapor rub", "quantity": 1, "unit": "pack", "category": "healthcare" },
      { "name": "cough drops", "quantity": 2, "unit": "pack", "category": "healthcare" }
    ]'::jsonb
  ),
  (
    'wound care essentials',
    array['wound care', 'cut care', 'first aid for cut', 'minor injury'],
    'Basic first-aid supplies only. This is not medical advice. Seek medical help for deep cuts, heavy bleeding, infection, or severe pain.',
    '[
      { "name": "antiseptic liquid", "quantity": 1, "unit": "pack", "category": "healthcare" },
      { "name": "bandages", "quantity": 1, "unit": "pack", "category": "healthcare" },
      { "name": "cotton", "quantity": 1, "unit": "pack", "category": "healthcare" },
      { "name": "hand sanitizer", "quantity": 1, "unit": "pack", "category": "hygiene" },
      { "name": "face masks", "quantity": 5, "unit": "piece", "category": "hygiene" }
    ]'::jsonb
  ),
  (
    'hygiene essentials',
    array['hygiene kit', 'wellness kit', 'basic care kit'],
    'Basic hygiene essentials only. This is not medical advice. Consult a qualified clinician for health concerns.',
    '[
      { "name": "hand sanitizer", "quantity": 1, "unit": "pack", "category": "hygiene" },
      { "name": "face masks", "quantity": 10, "unit": "piece", "category": "hygiene" },
      { "name": "tissues", "quantity": 2, "unit": "pack", "category": "personal_care" },
      { "name": "sanitary pads", "quantity": 1, "unit": "pack", "category": "personal_care" }
    ]'::jsonb
  )
) as seed(name, aliases, safety_message, item_requirements)
where not exists (
  select 1 from public.healthcare_templates
  where healthcare_templates.name = seed.name
);

insert into public.emergency_templates (
  name,
  aliases,
  item_requirements
)
select *
from (
  values
  (
    'power cut essentials',
    array['power cut', 'electricity outage', 'load shedding', 'power outage', 'light gone'],
    '[
      { "name": "torch", "quantity": 1, "unit": "piece", "category": "emergency" },
      { "name": "batteries", "quantity": 1, "unit": "pack", "category": "emergency" },
      { "name": "power bank", "quantity": 1, "unit": "piece", "category": "electronics" },
      { "name": "candles", "quantity": 1, "unit": "pack", "category": "household" },
      { "name": "matches", "quantity": 1, "unit": "pack", "category": "household" },
      { "name": "bottled water", "quantity": 4, "unit": "l", "category": "beverages" },
      { "name": "ready to eat snacks", "quantity": 4, "unit": "pack", "category": "ready_to_eat" },
      { "name": "mosquito repellent", "quantity": 1, "unit": "pack", "category": "household" }
    ]'::jsonb
  ),
  (
    'water shortage essentials',
    array['water shortage', 'no water', 'water cut', 'water supply issue'],
    '[
      { "name": "bottled water", "quantity": 8, "unit": "l", "category": "beverages" },
      { "name": "wet wipes", "quantity": 1, "unit": "pack", "category": "hygiene" },
      { "name": "hand sanitizer", "quantity": 1, "unit": "pack", "category": "hygiene" },
      { "name": "paper plates", "quantity": 1, "unit": "pack", "category": "disposables" },
      { "name": "paper cups", "quantity": 1, "unit": "pack", "category": "disposables" },
      { "name": "garbage bags", "quantity": 1, "unit": "pack", "category": "household" }
    ]'::jsonb
  ),
  (
    'heavy rain essentials',
    array['heavy rain', 'rain emergency', 'flood prep', 'storm prep', 'monsoon emergency'],
    '[
      { "name": "bottled water", "quantity": 6, "unit": "l", "category": "beverages" },
      { "name": "ready to eat snacks", "quantity": 4, "unit": "pack", "category": "ready_to_eat" },
      { "name": "torch", "quantity": 1, "unit": "piece", "category": "emergency" },
      { "name": "batteries", "quantity": 1, "unit": "pack", "category": "emergency" },
      { "name": "power bank", "quantity": 1, "unit": "piece", "category": "electronics" },
      { "name": "wet wipes", "quantity": 1, "unit": "pack", "category": "hygiene" },
      { "name": "garbage bags", "quantity": 1, "unit": "pack", "category": "household" }
    ]'::jsonb
  )
) as seed(name, aliases, item_requirements)
where not exists (
  select 1 from public.emergency_templates
  where emergency_templates.name = seed.name
);

insert into public.user_preference_profiles (
  user_id,
  preferred_brands_by_category
)
values (
  'demo-user',
  '{
    "dairy": ["Amul"],
    "spices": ["Everest"],
    "vegetables": ["Amazon Fresh"],
    "fruits": ["Amazon Fresh"],
    "eggs": ["Amazon Fresh"],
    "dry_fruits": ["Solimo"],
    "condiments": ["Smith & Jones"],
    "snacks": ["Haldiram''s", "Lay''s"],
    "beverages": ["Coca-Cola", "Real", "Tata Tea", "Bru"],
    "bakery": ["Monginis", "Britannia"],
    "staples": ["Tata", "Aashirvaad", "India Gate"],
    "sweets": ["Cadbury"],
    "disposables": ["Solimo"],
    "party_supplies": ["Party Propz"],
    "healthcare": ["Dettol", "Dr Morepen"],
    "hygiene": ["Savlon", "Solimo"],
    "personal_care": ["Colgate", "Kleenex", "Whisper"],
    "emergency": ["Eveready", "Duracell"],
    "electronics": ["Ambrane"],
    "household": ["Surf Excel", "Presto", "Good Knight"],
    "ready_to_eat": ["MTR"]
  }'::jsonb
)
on conflict (user_id) do update
set
  preferred_brands_by_category = excluded.preferred_brands_by_category,
  updated_at = now();

insert into public.user_purchase_history (
  user_id,
  product_title,
  brand,
  category,
  quantity,
  purchased_at
)
select 'demo-user', 'Amul Paneer 200g', 'Amul', 'dairy', 2, now() - interval '10 days'
where not exists (
  select 1 from public.user_purchase_history
  where user_id = 'demo-user' and product_title = 'Amul Paneer 200g'
);

insert into public.user_purchase_history (
  user_id,
  product_title,
  brand,
  category,
  quantity,
  purchased_at
)
select 'demo-user', 'Amul Butter 100g', 'Amul', 'dairy', 1, now() - interval '7 days'
where not exists (
  select 1 from public.user_purchase_history
  where user_id = 'demo-user' and product_title = 'Amul Butter 100g'
);

insert into public.user_purchase_history (
  user_id,
  product_title,
  brand,
  category,
  quantity,
  purchased_at
)
select 'demo-user', 'Everest Garam Masala 100g', 'Everest', 'spices', 1, now() - interval '20 days'
where not exists (
  select 1 from public.user_purchase_history
  where user_id = 'demo-user' and product_title = 'Everest Garam Masala 100g'
);

insert into public.user_purchase_history (
  user_id,
  product_title,
  brand,
  category,
  quantity,
  purchased_at
)
select 'demo-user', 'Amul Taaza Milk 1L', 'Amul', 'dairy', 2, now() - interval '4 days'
where not exists (
  select 1 from public.user_purchase_history
  where user_id = 'demo-user' and product_title = 'Amul Taaza Milk 1L'
);

insert into public.user_purchase_history (
  user_id,
  product_title,
  brand,
  category,
  quantity,
  purchased_at
)
select 'demo-user', 'Britannia White Bread 400g', 'Britannia', 'bakery', 1, now() - interval '5 days'
where not exists (
  select 1 from public.user_purchase_history
  where user_id = 'demo-user' and product_title = 'Britannia White Bread 400g'
);
