import { Router } from "express";
import { getProduct, getProducts, updateProduct, deleteProduct, getProductsOnDiscount } from "../controllers/productController";

export const productRouter = Router();

productRouter.get('/products/:id', getProduct);
productRouter.get('/products', getProducts);
productRouter.put('/products/:id', updateProduct);
productRouter.delete('/products/:id', deleteProduct);
productRouter.get('/products/discount/:id_oferta', getProductsOnDiscount);