import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/connectDB';
import initRoutes from './routes';
import { engine } from 'express-handlebars';
import sections from 'express-handlebars-sections';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('src/public'));

app.engine('.hbs', engine({
    extname: '.hbs',
    helpers: {
        section: sections()
    }
}));
app.set('view engine', '.hbs');
app.set('views', './src/views');

connectDB();
initRoutes(app)

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
})
