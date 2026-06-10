const mongoose = require('mongoose');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const Product = require('./models/Product');

const checkImages = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const products = await Product.find({});
        console.log(`Checking ${products.length} products...`);
        
        const toDelete = [];
        
        for (const p of products) {
            if (!p.image || p.image.includes('placeholder') || p.image.includes('placehold.co')) {
                toDelete.push(p._id);
                continue;
            }
            
            if (p.image.startsWith('http')) {
                try {
                    await axios.get(p.image, { timeout: 3000 });
                } catch (err) {
                    console.log(`Broken link for "${p.title}": ${p.image}`);
                    toDelete.push(p._id);
                }
            }
        }
        
        if (toDelete.length > 0) {
            console.log(`Deleting ${toDelete.length} products with broken images.`);
            await Product.deleteMany({ _id: { $in: toDelete } });
        } else {
            console.log('No broken products found.');
        }
        
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkImages();
