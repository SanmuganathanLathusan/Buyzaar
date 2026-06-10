const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const Product = require('./models/Product');

const findBroken = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    const all = await Product.find({});
    const broken = all.filter(p => {
        if (p.image.length < 12) return true; // Most URLs are longer than 12 chars
        if (p.image.includes('placeholder')) return true;
        if (p.image.includes('placehold')) return true;
        if (p.image.includes('no-image')) return true;
        if (p.image.includes('noimage')) return true;
        if (p.image.includes('failed')) return true;
        if (p.image.includes('error')) return true;
        if (p.image.toLowerCase().includes('null')) return true;
        if (p.image.toLowerCase().includes('undefined')) return true;
        return false;
    });
    console.log('Broken products found:', broken.length);
    broken.forEach(p => console.log(`- ${p.title} (${p.image})` ));
    
    if (broken.length > 0) {
        const ids = broken.map(p => p._id);
        await Product.deleteMany({ _id: { $in: ids } });
        console.log('Deleted broken products.');
    }
    
    process.exit();
};
findBroken();
