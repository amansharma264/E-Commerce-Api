import {Cart} from '../models/cart.model.js';
import {Product} from '../models/product.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  res.json(new ApiResponse(200, cart || { items: [] }, 'Cart fetched'));
});

const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, 'Product not found');

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [{ product: product._id, quantity }] });
    return res.json(new ApiResponse(201, cart, 'Item added'));
  }

  const idx = cart.items.findIndex((it) => it.product.toString() === product._id.toString());
  if (idx === -1) cart.items.push({ product: product._id, quantity });
  else cart.items[idx].quantity += Number(quantity);

  await cart.save();
  res.json(new ApiResponse(200, cart, 'Cart updated'));
});

const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) throw new ApiError(404, 'Cart not found');

  cart.items = cart.items.filter((it) => it.product.toString() !== productId);
  await cart.save();
  res.json(new ApiResponse(200, cart, 'Item removed'));
});

const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (cart) {
    cart.items = [];
    await cart.save();
  }
  res.json(new ApiResponse(200, {}, 'Cart cleared'));
});

export { getCart, addToCart, removeFromCart, clearCart };
