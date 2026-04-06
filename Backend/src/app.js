import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import menuItemRoutes from './routes/menuItemsRoutes.js';
import specialRoutes from './routes/specialRoutes.js';
import preorderRoutes from './routes/preorderRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';



import notFoundMiddleware from './middleware/notFoundMiddleware.js';
import errorMiddleware from './middleware/errorMiddleware.js';

const app = express();

//Security Middleware

app.use(helmet()); //it helps to secure the app by setting various HTTP headers

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // limit each IP to 200 requests per windowMs
    standardHeaders: true, // Return rate limit info in the  RateLimit headers
    legacyHeaders: false, // Disable the  X-RateLimit headers
    message: {
        success: false,
        message: "Too many requests, Please try again after 15 minutes"
    },
});

app.use(generalLimiter);

// CORS Middleware

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));

// Body Parsing Middleware

app.use(express.json({ limit: '10mb' })); // limit the size of incoming JSON payloads to 10mb
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // yesle urlencoded data lai pani parse garna dincha, extended: true le nested objects lai pani support garcha. [urlencoded data vaneko form data ho, jasma key-value pairs huncha, jasto ki form submissions ma huncha] [nested objects vaneko chai, key-value pairs bhitra aru key-value pairs huncha, jasto ki { user: { name: 'John', age: 30 } }]
app.use(cookieParser());

//Health Route [yo route le server ko health check garna madat garcha, jaba client le request pathauncha /api/health ma, server le response ma "Server is healthy" message pathauncha, jasko status code 200 huncha, jasko matlab server thik cha bhanne ho]

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is healthy"
    });
});

//API routes

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/menu-items", menuItemRoutes);
app.use("/api/specials", specialRoutes);
app.use("/api/preorders", preorderRoutes);
app.use("/api/dashboard", dashboardRoutes);

//Error Handling Middleware

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
