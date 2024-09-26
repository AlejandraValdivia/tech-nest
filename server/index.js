import dotenv from 'dotenv';
dotenv.config();
import connectToDatabase from './db.js';
import express from 'express';
import cors from 'cors';

// Routes
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import emailTestRoutes from './routes/emailTestRoutes.js';


connectToDatabase();
const app = express();
app.use(express.json());
app.use(cors({
	origin: 'http://localhost:3001',
}));

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);

// test route
app.use('/api', emailTestRoutes); 


const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
	res.send('Api is running...');
});

app.listen(port, () => {
	console.log(`Server runs on port ${port}`);
});