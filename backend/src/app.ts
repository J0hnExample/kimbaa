// app.ts
import express from 'express';
import "express-async-errors"; // needs to be imported before routers and other stuff!
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import { loginRouter } from './routes/loginRoute';
import { modulRouter } from './routes/modulRoute';
import { userRouter } from './routes/userRoute';
import { antragZulassungRouter } from './routes/antragZulassungRoute';
import { healthRouter } from './routes/healthRoute';
import { antragAnlage2Router } from './routes/antragAnlage2Route';
import { userDetailsRouter } from './routes/detailsRoute';
import { pdfAntragRouter } from './routes/pdfAntragRoute';
import { pdfAnlageRouter } from './routes/pdfAnlageRoute';
import { logger } from './logger/serviceLogger';
dotenv.config();
import { configureCORS } from './configCORS';

// Laden der Umgebungsvariablen aus der .env Datei
const app = express();

configureCORS(app);


// Middleware:
app.use('*', express.json());
app.use(cookieParser());

// Testroute zum Setzen und Lesen von Cookies
app.get('/test', (req, res) => {
    res.cookie('test_cookie', 'cookie_value', { httpOnly: true, secure: process.env.USE_SSL === 'true' });
    const cookie = req.cookies['test_cookie'];
    res.json({ message: 'Test route working', cookie: cookie });
});
app.get('/', (req, res) => {
    res.send('Root path is working!');
});
app.use('*', express.json())
app.use(cookieParser())

// Routes
app.use("/api/login", loginRouter);
app.use("/api/user", userRouter);
app.use("/api/modul", modulRouter);

app.use("/api/antragZulassung", antragZulassungRouter);
app.use("/api/health", healthRouter);
app.use("/api/antragAnlage2", antragAnlage2Router)
app.use("/api/pdfAntrag", pdfAntragRouter);
app.use("/api/pdfAnlage", pdfAnlageRouter);
app.use("/api/userdetails", userDetailsRouter);
export default app;
