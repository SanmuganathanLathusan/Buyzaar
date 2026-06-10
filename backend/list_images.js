const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const Product = require('./models/Product');

const listProd = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    const prods = await Product.find({}, 'title image');
    console.log(JSON.stringify(prods, null, 2));
    process.exit();
};
listProd();
