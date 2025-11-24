// backend/seeder.js
const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('./config/db');
const Product = require('./models/Product');
const seedProducts = async () => {
  try {
    await Product.insertMany(products);
    console.log("Products added successfully!");
  } catch (err) {
    console.error("Error adding products:", err);
  }
};

module.exports = seedProducts;

const products = [
  { name:"Margherita Pizza", 
    description:"Classic cheese pizza",
     price:199,
      rating:4.3,
       image:"/images/pizza.jpg",
        category:"Italian" 
      },

  { name:"Paneer Butter Masala",
     description:"Creamy paneer gravy",
      price:179,
      rating:4.5,
       image:"/images/paneer.jpg", 
       category:"Indian" 
      },
  { name:"Veg Biryani", 
    description:"Aromatic long-grain rice",
     price:149, 
     rating:4.2, 
     image:"/images/biryani.jpg",
      category:"Indian" 
    },
  { name:"Fried Rice",
     description:"Veg fried rice",
      price:129, 
      rating:4.1, 
      image:"/images/friedrice.jpg",
       category:"Chinese" },
  { name:"Chocolate Brownie", 
    description:"Gooey chocolate delight",
     price:99, 
     rating:4.6,
      image:"/images/brownie.jpg",
       category:"Dessert" 
      },
  {
    name: "Fries",
    price: 80,
    category: "Snacks",
    image: "/images/fries.jpg",
    description: "Crispy golden fries"
  },
  {
    name: "Sushi",
    price: 250,
    category: "Japanese",
    image: "/images/sushi.jpg",
    description: "Fresh sushi rolls"
  },
  {
    name: "Ramen",
    price: 200,
    category: "Japanese",
    image: "/images/ramen.jpg",
    description: "Hot and delicious ramen"
  },
  {
    name: "Cake",
    price: 150,
    category: "Desserts",
    image: "/images/cake.jpg",
    description: "Chocolate cake"
  }
  
];

const importData = async () => {
  try {
    await connectDB();
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log('Sample products with categories added');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

importData();
