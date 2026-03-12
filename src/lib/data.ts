import type { Restaurant } from '@/types';
export type { MenuItem, MenuCategory, Restaurant } from '@/types';

export const restaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Pasta Palace',
    description: 'Authentic Italian pasta and pizza. We serve classic dishes like carbonara, bolognese, and margherita pizza, all made with fresh, imported ingredients from Italy. A true taste of Rome.',
    cuisine: 'Italian',
    rating: 4.5,
    deliveryTime: 30,
    image: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=600&h=400&fit=crop',
    imageHint: 'italian pasta',
    menu: [
      {
        name: 'Appetizers',
        items: [
          { id: '1-1', name: 'Bruschetta', description: 'Toasted bread with fresh tomatoes, garlic, and basil.', price: 8.99, image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=200&h=200&fit=crop', imageHint: 'bruschetta' },
          { id: '1-2', name: 'Garlic Bread', description: 'Warm bread with garlic butter and herbs.', price: 6.99, image: 'https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=200&h=200&fit=crop', imageHint: 'garlic bread' },
        ],
      },
      {
        name: 'Pasta',
        items: [
          { id: '1-3', name: 'Spaghetti Carbonara', description: 'Classic carbonara with pancetta, eggs, and cheese.', price: 15.99, image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=200&h=200&fit=crop', imageHint: 'spaghetti carbonara' },
          { id: '1-4', name: 'Fettuccine Alfredo', description: 'Creamy alfredo sauce with fettuccine pasta.', price: 14.99, image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=200&h=200&fit=crop', imageHint: 'fettuccine alfredo' },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'Sushi Spot',
    description: 'Fresh and delicious sushi rolls and sashimi. Our chefs are trained in the art of sushi making, providing a modern take on traditional Japanese seafood cuisine, including spicy tuna rolls and dragon rolls.',
    cuisine: 'Japanese',
    rating: 4.8,
    deliveryTime: 45,
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&h=400&fit=crop',
    imageHint: 'sushi platter',
    menu: [
      {
        name: 'Rolls',
        items: [
          { id: '2-1', name: 'California Roll', description: 'Crab, avocado, and cucumber.', price: 10.99, image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=200&h=200&fit=crop', imageHint: 'california roll' },
          { id: '2-2', name: 'Spicy Tuna Roll', description: 'Tuna with spicy mayo.', price: 12.99, image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=200&h=200&fit=crop', imageHint: 'tuna roll' },
        ],
      },
       {
        name: 'Sashimi',
        items: [
          { id: '2-3', name: 'Tuna Sashimi', description: '3 pieces of fresh tuna.', price: 9.99, image: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=200&h=200&fit=crop', imageHint: 'tuna sashimi' },
        ],
      },
    ],
  },
  {
    id: '3',
    name: 'Burger Barn',
    description: 'Juicy American-style burgers and crispy fries. Our specialty is gourmet burgers made with 100% Angus beef, fresh toppings, and our secret sauce. A classic American diner experience.',
    cuisine: 'American',
    rating: 4.2,
    deliveryTime: 25,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop',
    imageHint: 'burger fries',
    menu: [
      {
        name: 'Burgers',
        items: [
          { id: '3-1', name: 'Classic Cheeseburger', description: 'Beef patty, cheese, lettuce, tomato, and onion.', price: 12.99, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop', imageHint: 'cheeseburger' },
          { id: '3-2', name: 'Bacon Burger', description: 'Beef patty, bacon, cheese, and BBQ sauce.', price: 14.99, image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=200&h=200&fit=crop', imageHint: 'bacon burger' },
        ],
      },
    ],
  },
  {
    id: '4',
    name: 'Curry House',
    description: 'Flavorful and spicy Indian curries. Explore the rich flavors of India with our wide range of dishes, from creamy Tikka Masala to spicy Vindaloo. All served with fluffy basmati rice.',
    cuisine: 'Indian',
    rating: 4.6,
    deliveryTime: 40,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=400&fit=crop',
    imageHint: 'indian curry',
    menu: [
      {
        name: 'Curries',
        items: [
          { id: '4-1', name: 'Chicken Tikka Masala', description: 'Creamy tomato-based curry with grilled chicken.', price: 16.99, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200&h=200&fit=crop', imageHint: 'tikka masala' },
          { id: '4-2', name: 'Lamb Vindaloo', description: 'Spicy and tangy curry with tender lamb.', price: 17.99, image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=200&h=200&fit=crop', imageHint: 'lamb vindaloo' },
        ],
      },
    ],
  },
  {
    id: '5',
    name: 'Taco Town',
    description: 'Authentic Mexican street tacos and burritos. Our tacos are filled with spicy meats and fresh toppings like cilantro, onions, and salsa. Experience the vibrant street food culture of Mexico.',
    cuisine: 'Mexican',
    rating: 4.7,
    deliveryTime: 30,
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&h=400&fit=crop',
    imageHint: 'mexican taco',
    menu: [
      {
        name: 'Tacos',
        items: [
          { id: '5-1', name: 'Carne Asada Tacos', description: 'Grilled steak tacos with cilantro and onions.', price: 4.50, image: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=200&h=200&fit=crop', imageHint: 'steak tacos' },
          { id: '5-2', name: 'Al Pastor Tacos', description: 'Marinated pork tacos with pineapple.', price: 4.00, image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=200&h=200&fit=crop', imageHint: 'pork tacos' },
        ],
      },
    ],
  },
  {
    id: '6',
    name: 'The Green Leaf',
    description: 'Healthy and refreshing salads and grain bowls. We focus on fresh, locally-sourced ingredients to create nutritious and delicious meals. Perfect for a light and healthy lunch.',
    cuisine: 'Healthy',
    rating: 4.9,
    deliveryTime: 20,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop',
    imageHint: 'mediterranean salad',
    menu: [
      {
        name: 'Salads',
        items: [
          { id: '6-1', name: 'Greek Salad', description: 'Feta, olives, tomatoes, and cucumber with a lemon vinaigrette.', price: 11.99, image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=200&h=200&fit=crop', imageHint: 'greek salad' },
          { id: '6-2', name: 'Quinoa Bowl', description: 'Quinoa with roasted vegetables and a tahini dressing.', price: 13.99, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop', imageHint: 'quinoa bowl' },
        ],
      },
    ],
  },
];
