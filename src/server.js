import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/connectDB';
import initRoutes from './routes';
import { engine } from 'express-handlebars';
import handlebarsSection from 'express-handlebars-sections';
import expressSession from 'express-session';
import { verifyToken } from './middleware/auth';
import handlebarsHelpers from './config/handlebarsHelpers';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('src/public'));

// express session
app.use(expressSession({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true }
}))

// handlebars
app.engine('.hbs', engine({
    extname: '.hbs',
    helpers: {
        ...handlebarsHelpers,
        section: handlebarsSection()
    }
}));
app.set('view engine', '.hbs');
app.set('views', './src/views');

connectDB();
// app.use(verifyToken);
app.use(verifyToken);
initRoutes(app)

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
})
