import express from 'express';
import {router} from './routes/dbRoutes';
import { categoryRouter } from './routes/categoryRoute';
import { subcategoryRouter } from './routes/subcategoryRoute';
import { discountRouter } from './routes/discountRoute';
import { cafeRouter } from './routes/cafeRoute';
import { userRouter } from './routes/userRoute';
import { productRouter } from './routes/productRoute';

const app = express();

app.use(express.json());

app.use('/api', router);
app.use('/api', categoryRouter);
app.use('/api', subcategoryRouter);
app.use('/api', discountRouter);
app.use('/api', cafeRouter);
app.use('/api', userRouter);
app.use('/api', productRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
