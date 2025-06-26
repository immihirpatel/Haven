const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");
const User = require("./models/User");
const Cart = require("./models/Cart");
const products = require("./data/products");

dotenv.config();


//connect to mongodb
mongoose.connect(process.env.MONGO_URI)

//function to seed the data
const seedData = async() =>{
    try{
        //clear existing data
        await Product.deleteMany();
        await User.deleteMany();
        await Cart.deleteMany();
        //create a default admin user
        const createdUser = await User.create({
            name:"Admin User",
            email:"admin@example.com",
            password:123456,
            role:"admin"
        });
        const userID = createdUser._id;
        //Assign a default user id to each product
        const sampleProducts = products.map((product)=>{
            return{...product, user:userID};
        })

        //Insert the products into the database
        await Product.insertMany(sampleProducts);
        console.log("Product seeded successfully!");
        process.exit();
    }catch(error){
        console.error("Error in seeding the data",error);
        process.exit();
    }
}

seedData();