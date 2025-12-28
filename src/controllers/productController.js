const { db } = require('../config/firebase');

exports.createProduct = async (req, res) => {
  try {
    const { name, price, stock, description } = req.body;

    const newDoc = await db.collection('products').add({
      name,
      price: parseInt(price),
      stock: parseInt(stock),
      description,
      createdAt: new Date().toISOString()
    });

    res.status(201).json({
      status: 'success',
      message: 'Product created successfully',
      data: { id: newDoc.id, ...req.body }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const productsRef = db.collection('products');
    const snapshot = await productsRef.get();

    if (snapshot.empty) {
      return res.status(200).json({ status: 'success', data: [] });
    }

    const products = [];
    snapshot.forEach(doc => {
      products.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json({
      status: 'success',
      data: products
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};