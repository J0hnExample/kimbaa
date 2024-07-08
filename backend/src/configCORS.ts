import express from 'express';
import cors, { CorsOptions } from 'cors';

/**
 * In app.ts aufrufen:
 * ```
 * configureCORS(app);
 * ```
 * (am besten gleich nach dem Erzeugen der app).
 * Das Paket 'cors' ist bereits installiert.
 */
export function configureCORS(app: express.Express) {
    // Hier wird sichergestellt, dass CORS_ORIGINS immer ein string ist, falls es gesetzt ist
    const allowedOrigins = (process.env.CORS_ORIGINS || "https://localhost:3000,https://localhost:3443").split(',');

    const corsOptions: CorsOptions = {
        origin: function(origin, callback) {
            // erlaubt Anfragen ohne Ursprung (wie mobile Apps oder curl-Anfragen)
            if (!origin) return callback(null, true);
            if (allowedOrigins.indexOf(origin) === -1) {
                const msg = 'Die CORS-Richtlinie für diese Site erlaubt keinen Zugriff von der angegebenen Ursprung: ' + origin;
                return callback(new Error(msg), false);
            }
            return callback(null, true);
        },
        methods: "GET,PUT,POST,DELETE",
        allowedHeaders: "Origin,Content-Type",
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
        credentials: true
    };

    app.use(cors(corsOptions));
    app.options('*', cors()); // enable pre-flight (request method "options") everywhere, you may want to specify that in detail in production
}
