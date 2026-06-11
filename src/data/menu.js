export const menuCategories = [
  {
    id: 'appetizers',
    name: 'Appetizers',
    chinese: '开胃菜',
    items: [
      { name: 'Spring Rolls', chinese: '春卷', description: 'Crispy vegetable rolls with sweet chilli dipping sauce', price: 6.50, spicy: false, vegetarian: true },
      { name: 'Pork Dumplings', chinese: '猪肉饺子', description: 'Hand-folded dumplings, steamed or pan-fried (6 pcs)', price: 8.95, spicy: false, vegetarian: false },
      { name: 'Scallion Pancakes', chinese: '葱油饼', description: 'Flaky layered pancakes with fresh scallions', price: 7.50, spicy: false, vegetarian: true },
      { name: 'Spicy Wontons', chinese: '红油抄手', description: 'Pork wontons in chilli oil and black vinegar', price: 9.50, spicy: true, vegetarian: false },
      { name: 'Edamame', chinese: '毛豆', description: 'Steamed soybeans with sea salt', price: 5.95, spicy: false, vegetarian: true },
    ],
  },
  {
    id: 'soups',
    name: 'Soups',
    chinese: '汤类',
    items: [
      { name: 'Hot & Sour Soup', chinese: '酸辣汤', description: 'Tofu, mushrooms, bamboo shoots in a tangy broth', price: 6.95, spicy: true, vegetarian: true },
      { name: 'Wonton Soup', chinese: '馄饨汤', description: 'Delicate pork wontons in clear chicken broth', price: 7.95, spicy: false, vegetarian: false },
      { name: 'Egg Drop Soup', chinese: '蛋花汤', description: 'Silky egg ribbons in savoury chicken stock', price: 5.95, spicy: false, vegetarian: false },
      { name: 'Seafood Tofu Soup', chinese: '海鲜豆腐汤', description: 'Prawns, scallops, and silken tofu', price: 10.95, spicy: false, vegetarian: false },
    ],
  },
  {
    id: 'noodles',
    name: 'Noodles & Rice',
    chinese: '面食与米饭',
    items: [
      { name: 'Beef Chow Fun', chinese: '干炒牛河', description: 'Wide rice noodles wok-tossed with tender beef', price: 14.95, spicy: false, vegetarian: false },
      { name: 'Dan Dan Noodles', chinese: '担担面', description: 'Sichuan noodles with minced pork and peanut sauce', price: 13.95, spicy: true, vegetarian: false },
      { name: 'Vegetable Fried Rice', chinese: '素炒饭', description: 'Wok-fried jasmine rice with seasonal vegetables', price: 11.95, spicy: false, vegetarian: true },
      { name: 'Yangzhou Fried Rice', chinese: '扬州炒饭', description: 'Classic fried rice with prawns, ham, and egg', price: 13.50, spicy: false, vegetarian: false },
      { name: 'Singapore Noodles', chinese: '星洲炒米粉', description: 'Curry-spiced rice vermicelli with char siu and prawns', price: 14.50, spicy: true, vegetarian: false },
    ],
  },
  {
    id: 'mains',
    name: 'Chef\'s Specials',
    chinese: '招牌菜',
    items: [
      { name: 'Kung Pao Chicken', chinese: '宫保鸡丁', description: 'Diced chicken with peanuts, dried chillies, and Sichuan pepper', price: 15.95, spicy: true, vegetarian: false },
      { name: 'Mapo Tofu', chinese: '麻婆豆腐', description: 'Silken tofu in a fiery bean paste sauce with minced pork', price: 14.50, spicy: true, vegetarian: false },
      { name: 'Sweet & Sour Pork', chinese: '咕噜肉', description: 'Crispy pork with bell peppers in tangy glaze', price: 15.50, spicy: false, vegetarian: false },
      { name: 'Peking Duck', chinese: '北京烤鸭', description: 'Half duck with pancakes, hoisin, cucumber & scallion (serves 2)', price: 38.00, spicy: false, vegetarian: false },
      { name: 'General Tso\'s Chicken', chinese: '左宗棠鸡', description: 'Crispy chicken in a sweet-spicy glaze', price: 15.95, spicy: true, vegetarian: false },
      { name: 'Twice-Cooked Pork', chinese: '回锅肉', description: 'Sichuan-style pork belly with leeks and chilli bean paste', price: 16.50, spicy: true, vegetarian: false },
    ],
  },
  {
    id: 'seafood',
    name: 'Seafood',
    chinese: '海鲜',
    items: [
      { name: 'Steamed Sea Bass', chinese: '清蒸鲈鱼', description: 'Whole bass with ginger, scallion, and soy', price: 28.00, spicy: false, vegetarian: false },
      { name: 'Salt & Pepper Prawns', chinese: '椒盐大虾', description: 'Crispy shell-on prawns with garlic and chilli', price: 18.95, spicy: true, vegetarian: false },
      { name: 'Kung Pao Prawns', chinese: '宫保虾仁', description: 'Jumbo prawns in classic kung pao sauce', price: 19.50, spicy: true, vegetarian: false },
      { name: 'Scallops with Black Bean', chinese: '豆豉扇贝', description: 'Pan-seared scallops in fermented black bean sauce', price: 22.00, spicy: false, vegetarian: false },
    ],
  },
  {
    id: 'vegetarian',
    name: 'Vegetarian',
    chinese: '素菜',
    items: [
      { name: 'Buddha\'s Delight', chinese: '罗汉斋', description: 'Assorted vegetables, tofu, and fungi in light sauce', price: 13.95, spicy: false, vegetarian: true },
      { name: 'Ma Po Eggplant', chinese: '鱼香茄子', description: 'Silky eggplant in garlic-yu xiang sauce', price: 12.95, spicy: true, vegetarian: true },
      { name: 'Dry-Fried Green Beans', chinese: '干煸四季豆', description: 'Wok-charred beans with minced garlic and chilli', price: 11.50, spicy: true, vegetarian: true },
      { name: 'Mapo Tofu (V)', chinese: '素麻婆豆腐', description: 'Silken tofu in spicy sauce — no pork', price: 13.50, spicy: true, vegetarian: true },
    ],
  },
  {
    id: 'desserts',
    name: 'Desserts',
    chinese: '甜品',
    items: [
      { name: 'Mango Pudding', chinese: '芒果布丁', description: 'Silky tropical pudding with fresh mango', price: 6.50, spicy: false, vegetarian: true },
      { name: 'Sesame Balls', chinese: '芝麻球', description: 'Crispy glutinous rice balls with red bean filling (3 pcs)', price: 5.95, spicy: false, vegetarian: true },
      { name: 'Almond Tofu', chinese: '杏仁豆腐', description: 'Chilled almond jelly with lychee', price: 5.50, spicy: false, vegetarian: true },
    ],
  },
  {
    id: 'drinks',
    name: 'Drinks',
    chinese: '饮品',
    items: [
      { name: 'Jasmine Tea', chinese: '茉莉花茶', description: 'Pot for two', price: 4.50, spicy: false, vegetarian: true },
      { name: 'Oolong Tea', chinese: '乌龙茶', description: 'Iron Goddess of Mercy — pot for two', price: 5.50, spicy: false, vegetarian: true },
      { name: 'Tsingtao Beer', chinese: '青岛啤酒', description: '330ml bottle', price: 5.00, spicy: false, vegetarian: true },
      { name: 'Plum Wine', chinese: '梅子酒', description: 'Sweet Chinese plum wine, 50ml', price: 6.50, spicy: false, vegetarian: true },
    ],
  },
];

export const orderConfig = {
  takeaway: {
    readyTime: '20–30 minutes',
    payment: 'Pay on collection (cash or card)',
  },
  delivery: {
    radius: '3 miles',
    fee: 3.5,
    freeDeliveryMinimum: 30,
    readyTime: '45–60 minutes',
    payment: 'Pay on delivery (cash or card)',
  },
};

export function getOrderableItems() {
  return menuCategories.flatMap((category) =>
    category.items.map((item, index) => ({
      id: `${category.id}-${index}`,
      category: category.name,
      ...item,
    })),
  );
}

export const featuredDishes = [
  {
    name: 'Peking Duck',
    chinese: '北京烤鸭',
    description: 'Our signature dish — carved tableside with all the traditional accompaniments.',
    image: 'https://images.unsplash.com/photo-1765743691388-6a5608004b9c?w=600&h=400&fit=crop',
  },
  {
    name: 'Kung Pao Chicken',
    chinese: '宫保鸡丁',
    description: 'A Sichuan classic balancing heat, crunch, and umami.',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&h=400&fit=crop',
  },
  {
    name: 'Dim Sum Platter',
    chinese: '点心拼盘',
    description: 'A curated selection of steamed and fried favourites.',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&h=400&fit=crop',
  },
];

export const galleryImages = [
  { src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', alt: 'Elegant dining room' },
  { src: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&h=600&fit=crop', alt: 'Dim sum selection' },
  { src: 'https://images.unsplash.com/photo-1765743691388-6a5608004b9c?w=800&h=600&fit=crop', alt: 'Roast duck' },
  { src: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&h=600&fit=crop', alt: 'Noodle dish' },
  { src: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop', alt: 'Wok cooking' },
  { src: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&h=600&fit=crop', alt: 'Table setting' },
];

export const restaurantInfo = {
  name: 'Yun Hai',
  chineseName: '云海',
  tagline: 'Where tradition meets the table',
  address: '42 Lantern Lane, Chinatown',
  city: 'London EC1A 1BB',
  phone: '020 7946 0958',
  email: 'hello@yunhai.co.uk',
  hours: {
    weekday: { days: 'Mon – Thu', time: '12:00 – 22:00' },
    weekend: { days: 'Fri – Sun', time: '12:00 – 23:00' },
    lunch: { days: 'Lunch Set Menu', time: '12:00 – 14:30' },
  },
};
