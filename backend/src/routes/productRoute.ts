import { Router } from "express";
import { getProduct, getProducts, updateProduct, deleteProduct, getProductsOnDiscount, addProduct } from "../controllers/productController";

export const productRouter = Router();

productRouter.post('/products/add', addProduct);
productRouter.get('/products/activeDiscount', getProductsOnDiscount);
productRouter.get('/products/:id', getProduct);
productRouter.get('/products', getProducts);
productRouter.put('/products/:id', updateProduct);
productRouter.delete('/products/:id', deleteProduct);