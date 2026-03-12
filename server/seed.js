import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const useSSL = process.env.DATABASE_URL?.includes('neon.tech') ||
  process.env.DATABASE_URL?.includes('sslmode=require') ||
  process.env.NODE_ENV === 'production';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: useSSL ? { rejectUnauthorized: false } : false,
});

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seed...');

    const restaurantsData = [
      {
        name: 'Bella Italia',
        description: 'Authentic Italian cuisine with traditional recipes passed down for generations',
        cuisine_type: 'Italian',
        rating: 4.8,
        delivery_time: 30,
        image_url: 'https://picsum.photos/seed/bella-italia/600/400',
        address: '123 Pizza Street, Downtown',
        menus: [
          { name: 'Main Menu', items: [
            { id: 1, name: 'Spaghetti Carbonara', price: 12.99, description: 'Creamy Italian pasta' },
            { id: 2, name: 'Lasagna Bolognese', price: 14.99, description: 'Layered pasta with meat sauce' },
            { id: 3, name: 'Risotto Milanese', price: 13.99, description: 'Creamy saffron rice' },
          ]},
        ],
      },
      {
        name: 'Spice Route',
        description: 'Traditional Indian food with aromatic spices and flavorful curries',
        cuisine_type: 'Indian',
        rating: 4.6,
        delivery_time: 40,
        image_url: 'https://picsum.photos/seed/spice-route/600/400',
        address: '456 Curry Avenue, Midtown',
        menus: [
          { name: 'Main Menu', items: [
            { id: 1, name: 'Butter Chicken', price: 11.99, description: 'Creamy tomato curry with chicken' },
            { id: 2, name: 'Biryani', price: 10.99, description: 'Fragrant rice dish' },
            { id: 3, name: 'Paneer Tikka', price: 9.99, description: 'Grilled cottage cheese' },
          ]},
        ],
      },
      {
        name: 'Dragon Wok',
        description: 'Fast and authentic Chinese cuisine with hand-pulled noodles',
        cuisine_type: 'Chinese',
        rating: 4.5,
        delivery_time: 25,
        image_url: 'https://picsum.photos/seed/dragon-wok/600/400',
        address: '789 Noodle Lane, East District',
        menus: [
          { name: 'Main Menu', items: [
            { id: 1, name: 'Kung Pao Chicken', price: 10.99, description: 'Spicy chicken with peanuts' },
            { id: 2, name: 'Fried Rice', price: 8.99, description: 'Egg fried rice' },
            { id: 3, name: 'Lo Mein', price: 9.99, description: 'Stir-fried noodles' },
          ]},
        ],
      },
      {
        name: 'Fresh Bites',
        description: 'Healthy salads, smoothies, and organic food options',
        cuisine_type: 'Healthy',
        rating: 4.7,
        delivery_time: 20,
        image_url: 'https://picsum.photos/seed/fresh-bites/600/400',
        address: '321 Green Road, Westside',
        menus: [
          { name: 'Main Menu', items: [
            { id: 1, name: 'Greek Salad', price: 8.99, description: 'Fresh vegetables with feta' },
            { id: 2, name: 'Smoothie Bowl', price: 7.99, description: 'Açai with granola' },
            { id: 3, name: 'Grilled Chicken Wrap', price: 9.99, description: 'Healthy protein wrap' },
          ]},
        ],
      },
      {
        name: 'Burger House',
        description: 'Premium American burgers with hand-cut fries and milkshakes',
        cuisine_type: 'American',
        rating: 4.4,
        delivery_time: 35,
        image_url: 'https://picsum.photos/seed/burger-house/600/400',
        address: '654 Beef Boulevard, North End',
        menus: [
          { name: 'Main Menu', items: [
            { id: 1, name: 'Classic Burger', price: 10.99, description: 'Beef patty with cheese' },
            { id: 2, name: 'Bacon Burger', price: 12.99, description: 'With crispy bacon' },
            { id: 3, name: 'French Fries', price: 3.99, description: 'Golden crispy fries' },
          ]},
        ],
      },
      {
        name: 'Sushi Master',
        description: 'Fresh Japanese sushi made with premium quality ingredients',
        cuisine_type: 'Japanese',
        rating: 4.9,
        delivery_time: 45,
        image_url: 'https://picsum.photos/seed/sushi-master/600/400',
        address: '987 Fish Way, Harbor District',
        menus: [
          { name: 'Main Menu', items: [
            { id: 1, name: 'California Roll', price: 8.99, description: 'Crab, avocado, cucumber' },
            { id: 2, name: 'Spicy Tuna Roll', price: 9.99, description: 'Spicy tuna and cucumber' },
            { id: 3, name: 'Salmon Nigiri', price: 10.99, description: 'Fresh salmon sushi' },
          ]},
        ],
      },
    ];

    console.log('📝 Inserting restaurants and menus...');
    for (const restaurant of restaurantsData) {
      const { menus, ...restData } = restaurant;
      const result = await pool.query(
        'INSERT INTO restaurants (name, description, cuisine_type, rating, delivery_time, image_url, address, is_active, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, true, NOW()) RETURNING id',
        [restData.name, restData.description, restData.cuisine_type, restData.rating, restData.delivery_time, restData.image_url, restData.address]
      );
      const restaurantId = result.rows[0].id;

      for (const menu of menus) {
        await pool.query(
          'INSERT INTO menus (restaurant_id, name, items, created_at) VALUES ($1, $2, $3, NOW())',
          [restaurantId, menu.name, JSON.stringify(menu.items)]
        );
      }
      console.log(`  ✅ ${restData.name} (id: ${restaurantId}) with ${menus.length} menu(s)`);
    }

    console.log('\n🌱 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

seedDatabase();
