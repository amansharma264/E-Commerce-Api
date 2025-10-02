import Stripe from 'stripe';
import { Cart } from '../models/cart.model.js';
import { Order } from '../models/order.model.js';
import { Product } from '../models/product.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-08-16' });

const createCheckoutSession = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart || cart.items.length === 0) throw new ApiError(400, 'Cart is empty');

  const line_items = cart.items.map((it) => ({
    price_data: {
      currency: 'inr',
      product_data: { name: it.product.name, description: it.product.description },
      unit_amount: Math.round(it.product.price * 100)
    },
    quantity: it.quantity
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items,
    mode: 'payment',
    success_url: `${req.headers.origin || 'http://localhost:8080'}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${req.headers.origin || 'http://localhost:8080'}/cancel`
  });

  const items = cart.items.map((it) => ({
    product: it.product._id,
    quantity: it.quantity,
    priceAtPurchase: it.product.price
  }));
  const totalAmount = cart.items.reduce((s, it) => s + it.quantity * it.product.price, 0);
  await Order.create({
    user: req.user._id,
    items,
    totalAmount,
    paymentStatus: 'pending',
    stripeSessionId: session.id
  });

  res.json(new ApiResponse(200, { url: session.url, sessionId: session.id }, 'Checkout session created'));
});

const handleStripeWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature error', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const order = await Order.findOne({ stripeSessionId: session.id });
    if (order) {
      order.paymentStatus = 'paid';
      await order.save();
      for (const it of order.items) {
        await Product.findByIdAndUpdate(it.product, { $inc: { stock: -it.quantity } });
      }
      await Cart.findOneAndUpdate({ user: order.user }, { items: [] });
    }
  }

  res.json({ received: true });
});

export { createCheckoutSession, handleStripeWebhook };