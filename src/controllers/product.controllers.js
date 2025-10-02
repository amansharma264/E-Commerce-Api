import {Product} from '../models/product.model.js'
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import {asyncHandler} from '../utils/asyncHandler.js'

// create product
const createProduct = asyncHandler(async(req, res)=>{
    const body = req.body;
    const product = await Product.create(body);
    return res
    .status(201)
    .json(new ApiResponse (201, product, 'Product created'));
});

// update product
const updateProduct = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, {new: true});
    if(!product) throw new ApiError(404, 'product not found');
    return res
    .status(201)
    .json(new ApiResponse(201, product, 'product update'));
});

// delete product
const deleteProduct = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    const product = await Product.findByIdAndDelete(id);
    if(!product) throw new ApiError(404, 'product not found');
    return res
    .status(201)
    .json(new ApiResponse(201, null, 'Product deleted'));
})

// list all the products 
const listProducts = asyncHandler(async(req, res)=>{
    const {q, page=1, limit=20} = req.query;
    const filter = {};
    if(q) filter.$or = [{name: new RegExp(q, 'i')}, {description: new RegExp(q, 'i')}];
    const products = await Product.find(filter)
        .skip((page-1)*limit)
        .limit(Number(limit));
    return res
        .json(
            new ApiResponse(200, products, 'products fetched')
        );
});

// getting products

const getProducts = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    const product = await Product.findById(id);
    if(!product) throw new ApiError(404, 'Product not found');
    return res
    .json(new ApiResponse(200, product, 'Product fetched'));
})

export {createProduct,
    updateProduct,
    deleteProduct,
    listProducts,
    getProducts
};
