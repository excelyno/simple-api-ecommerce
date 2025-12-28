const { db } = require('../config/firebase');

exports.checkout = async (req, res) => {
  try {
    const userId = req.user.uid;
    
    const cartRef = db.collection('carts').doc(userId);
    const cartDoc = await cartRef.get();

    if (!cartDoc.exists || !cartDoc.data().items || cartDoc.data().items.length === 0) {
      return res.status(400).json({ status: 'error', message: 'Cart is empty' });
    }

    const cartData = cartDoc.data();
    let totalAmount = 0;
    const newOrder = {
      userId: userId,
      items: cartData.items,
      totalAmount: 1500000,
      status: 'pending', 
      createdAt: new Date().toISOString(),
      shippingAddress: req.body.address || 'Alamat Default'
    };

    const orderRef = await db.collection('orders').add(newOrder);

    await cartRef.update({
      items: [] 
    });

    res.status(201).json({
      status: 'success',
      message: 'Order placed successfully',
      data: {
        orderId: orderRef.id,
        ...newOrder
      }
    });

  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user.uid;
    const ordersSnapshot = await db.collection('orders')
      .where('userId', '==', userId)
      .get();

    const orders = [];
    ordersSnapshot.forEach(doc => {
      orders.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json({ status: 'success', data: orders });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.payOrder = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { orderId } = req.params; 

    const orderRef = db.collection('orders').doc(orderId);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      return res.status(404).json({ status: 'error', message: 'Order not found' });
    }

    const orderData = orderDoc.data();

    if (orderData.userId !== userId) {
      return res.status(403).json({ status: 'error', message: 'Access denied' });
    }

    if (orderData.status === 'paid') {
      return res.status(400).json({ status: 'error', message: 'Order already paid' });
    }

    await orderRef.update({
      status: 'paid',
      paidAt: new Date().toISOString(),
      paymentMethod: 'bank_transfer_simulation'
    });

    res.status(200).json({
      status: 'success',
      message: 'Payment successful',
      data: {
        orderId: orderId,
        status: 'paid'
      }
    });

  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};