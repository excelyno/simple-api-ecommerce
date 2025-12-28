const { db, admin } = require('../config/firebase');

exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { productId, quantity } = req.body;

    const cartRef = db.collection('carts').doc(userId);
    const cartDoc = await cartRef.get();

    const newItem = {
      productId,
      quantity: parseInt(quantity),
      addedAt: new Date().toISOString()
    };

    if (!cartDoc.exists) {
      await cartRef.set({
        userId,
        items: [newItem],
        updatedAt: new Date().toISOString()
      });
    } else {
      await cartRef.update({
        items: admin.firestore.FieldValue.arrayUnion(newItem),
        updatedAt: new Date().toISOString()
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Item added to cart'
    });

  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    const userId = req.user.uid;
    const cartRef = db.collection('carts').doc(userId);
    const cartDoc = await cartRef.get();

    if (!cartDoc.exists) {
      return res.status(200).json({ status: 'success', data: { items: [] } });
    }

    res.status(200).json({
      status: 'success',
      data: cartDoc.data()
    });

  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};