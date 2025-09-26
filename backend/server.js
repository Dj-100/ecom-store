const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const sgMail = require('@sendgrid/mail');
const nodemailer = require('nodemailer'); 
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());




const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number, required: false }, 
  imageUrl: { type: String, required: false },
  stock: { type: Number, required: true, default: 0 },
  category: { type: [String], required: true }, 
  isFeatured: { type: Boolean, default: false },
  popularity: { type: Number, enum: [1, 2, 3], default: 3 },
  ageFrom: { type: Number },
  ageTo: { type: Number },
}, { timestamps: true });
const Product = mongoose.model('Product', productSchema);


const requestSchema = new mongoose.Schema({
  requestedProductName: { type: String, required: true },
}, { timestamps: true });
const ProductRequest = mongoose.model('ProductRequest', requestSchema);


const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerAddress: { type: String, required: true },
  orderItems: [ {
    name: { type: String, required: true },
    qty: { type: Number, required: true },
    price: { type: Number, required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }
  } ],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'Pending' }
}, { timestamps: true });
const Order = mongoose.model('Order', orderSchema);



const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


sgMail.setApiKey(process.env.SENDGRID_API_KEY);



const adminCheck = (req, res, next) => {
    const { userId } = req.body;

  
    const adminUidsString = process.env.ADMIN_UIDS || '';
    const adminUids = adminUidsString.split(',');

  
    if (!adminUids.includes(userId)) {
        return res.status(403).json({ message: 'Forbidden: Admin access only.' });
    }

  
    next();
};






app.get('/api/products', async (req, res) => {
  try {
    const { category, search, isFeatured, age, sortBy, price_max } = req.query;
    const filter = {};
    let sort = {};

    if (isFeatured) {
      filter.isFeatured = true;
    }
    if (category) {
      filter.category = { $in: [category] };
    }
    if (search) {

      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (price_max) {
      filter.price = { $lte: parseInt(price_max) };
    }
    if (age) {
      const numericAge = parseInt(age);
      filter.ageFrom = { $exists: true, $ne: null, $lte: numericAge };
      filter.ageTo = { $exists: true, $ne: null, $gte: numericAge };
    }

   
    if (sortBy === 'price-asc') {
      sort = { price: 1 };
    } else if (sortBy === 'price-desc') {
      sort = { price: -1 };
    } else if (sortBy === 'popularity') {
      sort = { popularity: 1 };
    }

    const products = await Product.find(filter).sort(sort);
    res.json(products);
    
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});


app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if(product) { res.json(product); }
    else { res.status(404).json({ message: 'Product not found' }); }
  } catch (error) { res.status(500).json({ message: 'Error fetching product' }); }
});

app.post('/api/product-requests', async (req, res) => {
    try {
        const { productName } = req.body;
        if (!productName) return res.status(400).json({ message: "Product name is required." });
        const newRequest = new ProductRequest({ requestedProductName: productName });
        await newRequest.save();

        if (process.env.ADMIN_EMAIL) {
            const msg = {
                to: process.env.ADMIN_EMAIL,
                from: process.env.EMAIL_USER, // Use the verified email from SendGrid
                subject: `New Product Request: ${productName}`,
                text: `A customer requested: "${productName}"`
            };
            sgMail.send(msg).catch(error => console.error("SendGrid Error:", error.response.body));
        }
        res.status(201).json({ message: "Request received!" });
    } catch (error) { res.status(500).json({ message: "Failed to save request." }); }
});


app.post('/api/orders', async (req, res) => {
    try {
        const { userId, customerEmail, customerInfo, orderItems, totalAmount } = req.body;
        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }


        const order = new Order({
            userId, customerEmail,
            customerName: customerInfo.name,
            customerPhone: customerInfo.phone,
            customerAddress: customerInfo.address,
            orderItems: orderItems.map(item => ({ ...item, product: item._id })),
            totalAmount,
        });
        
       
        const createdOrder = await order.save();
        
     
        if (process.env.ADMIN_EMAIL) {
            const msg = {
                to: process.env.ADMIN_EMAIL,
                from: process.env.EMAIL_USER, // Use the verified email from SendGrid
                subject: `New Order Received! - #${createdOrder._id.toString().slice(-6)}`,
                text: `A new order has been placed by ${createdOrder.customerName}.`
            };
            sgMail.send(msg).catch(error => console.error("SendGrid Error:", error.response.body));
        }
        res.status(201).json({ message: 'Order created!', order: createdOrder });
    } catch (error) { res.status(500).json({ message: 'Failed to create order.' }); }
});































app.post('/api/admin/orders', adminCheck, async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) { res.status(500).json({ message: 'Failed to fetch orders.' }); }
});











app.post('/api/products', adminCheck, async (req, res) => {
  try {
    const { productData } = req.body;
    const product = new Product(productData);
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) { res.status(500).json({ message: 'Error creating product' }); }
});








app.put('/api/products/:id', adminCheck, async (req, res) => {
  try {
    const { productData } = req.body;
    const product = await Product.findById(req.params.id);
    if (product) {
      Object.assign(product, productData);
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else { res.status(404).json({ message: 'Product not found' }); }
  } catch (error) { res.status(500).json({ message: 'Error updating product' }); }
});










app.post('/api/products/delete/:id', adminCheck, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
              await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: 'Error deleting product' });
    }
});







app.post('/api/admin/requests', adminCheck, async (req, res) => {
    try {
    
        const requests = await ProductRequest.find({}).sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        console.error("Error fetching product requests:", error);
        res.status(500).json({ message: 'Failed to fetch product requests.' });
    }
});











mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB!');
    app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
  })
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
  });