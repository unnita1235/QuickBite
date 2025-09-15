export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  imageHint: string;
}

export interface MenuCategory {
  name: string;
  items: MenuItem[];
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  cuisine: string;
  rating: number;
  deliveryTime: number;
  image: string;
  imageHint: string;
  menu: MenuCategory[];
}

export const restaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Pasta Palace',
    description: 'Authentic Italian pasta and pizza. We serve classic dishes like carbonara, bolognese, and margherita pizza, all made with fresh, imported ingredients from Italy. A true taste of Rome.',
    cuisine: 'Italian',
    rating: 4.5,
    deliveryTime: 30,
    image: 'https://picsum.photos/seed/101/600/400',
    imageHint: 'italian pasta',
    menu: [
      {
        name: 'Appetizers',
        items: [
          { id: '1-1', name: 'Bruschetta', description: 'Toasted bread with fresh tomatoes, garlic, and basil.', price: 8.99, image: 'https://picsum.photos/seed/a1/200/200', imageHint: 'bruschetta' },
          { id: '1-2', name: 'Garlic Bread', description: 'Warm bread with garlic butter and herbs.', price: 6.99, image: 'https://picsum.photos/seed/a2/200/200', imageHint: 'garlic bread' },
        ],
      },
      {
        name: 'Pasta',
        items: [
          { id: '1-3', name: 'Spaghetti Carbonara', description: 'Classic carbonara with pancetta, eggs, and cheese.', price: 15.99, image: 'https://picsum.photos/seed/a3/200/200', imageHint: 'spaghetti carbonara' },
          { id: '1-4', name: 'Fettuccine Alfredo', description: 'Creamy alfredo sauce with fettuccine pasta.', price: 14.99, image: 'https://picsum.photos/seed/a4/200/200', imageHint: 'fettuccine alfredo' },
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
    image: 'https://picsum.photos/seed/102/600/400',
    imageHint: 'sushi platter',
    menu: [
      {
        name: 'Rolls',
        items: [
          { id: '2-1', name: 'California Roll', description: 'Crab, avocado, and cucumber.', price: 10.99, image: 'https://picsum.photos/seed/b1/200/200', imageHint: 'california roll' },
          { id: '2-2', name: 'Spicy Tuna Roll', description: 'Tuna with spicy mayo.', price: 12.99, image: 'https://picsum.photos/seed/b2/200/200', imageHint: 'tuna roll' },
        ],
      },
       {
        name: 'Sashimi',
        items: [
          { id: '2-3', name: 'Tuna Sashimi', description: '3 pieces of fresh tuna.', price: 9.99, image: 'https://picsum.photos/seed/b3/200/200', imageHint: 'tuna sashimi' },
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
    image: 'https://picsum.photos/seed/103/600/400',
    imageHint: 'burger fries',
    menu: [
      {
        name: 'Burgers',
        items: [
          { id: '3-1', name: 'Classic Cheeseburger', description: 'Beef patty, cheese, lettuce, tomato, and onion.', price: 12.99, image: 'https://picsum.photos/seed/c1/200/200', imageHint: 'cheeseburger' },
          { id: '3-2', name: 'Bacon Burger', description: 'Beef patty, bacon, cheese, and BBQ sauce.', price: 14.99, image: 'https://picsum.photos/seed/c2/200/200', imageHint: 'bacon burger' },
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
    image: 'https://picsum.photos/seed/104/600/400',
    imageHint: 'indian curry',
    menu: [
      {
        name: 'Curries',
        items: [
          { id: '4-1', name: 'Chicken Tikka Masala', description: 'Creamy tomato-based curry with grilled chicken.', price: 16.99, image: 'https://picsum.photos/seed/d1/200/200', imageHint: 'tikka masala' },
          { id: '4-2', name: 'Lamb Vindaloo', description: 'Spicy and tangy curry with tender lamb.', price: 17.99, image: 'https://picsum.photos/seed/d2/200/200', imageHint: 'lamb vindaloo' },
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
    image: 'https://picsum.photos/seed/105/600/400',
    imageHint: 'mexican taco',
    menu: [
      {
        name: 'Tacos',
        items: [
          { id: '5-1', name: 'Carne Asada Tacos', description: 'Grilled steak tacos with cilantro and onions.', price: 4.50, image: 'https://picsum.photos/seed/e1/200/200', imageHint: 'steak tacos' },
          { id: '5-2', name: 'Al Pastor Tacos', description: 'Marinated pork tacos with pineapple.', price: 4.00, image: 'https://picsum.photos/seed/e2/200/200', imageHint: 'pork tacos' },
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
    image: 'https://picsum.photos/seed/106/600/400',
    imageHint: 'mediterranean salad',
    menu: [
      {
        name: 'Salads',
        items: [
          { id: '6-1', name: 'Greek Salad', description: 'Feta, olives, tomatoes, and cucumber with a lemon vinaigrette.', price: 11.99, image: 'https://picsum.photos/seed/f1/200/200', imageHint: 'greek salad' },
          { id: '6-2', name: 'Quinoa Bowl', description: 'Quinoa with roasted vegetables and a tahini dressing.', price: 13.99, image: 'https://picsum.photos/seed/f2/200/200', imageHint: 'quinoa bowl' },
        ],
      },
    ],
  },
];
