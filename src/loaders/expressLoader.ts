require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
import config from "config";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import bodyParser from 'body-parser';
//import { errors } from 'celebrate';
import { AppDataSource } from "../utils/data-source";
// import validateEnv from "../utils/validateEnv";
import os from "os";
import {MicroframeworkLoader,MicroframeworkSettings} from "microframework-w3tec";
import {createExpressServer,useContainer as routingUseContainer} from "routing-controllers";
import { UserController } from "../controllers/UserController";
import Container from "typedi";
// import swaggerUi from "swagger-ui-express";
// import YAML from "yamljs";
import path from "path";


export const expressLoader: MicroframeworkLoader = (
  settings: MicroframeworkSettings | undefined
) => {
  if (settings) {
    // Set the container for both routing-controllers and typeorm
    routingUseContainer(Container);
    const connection = settings.getData("connection");
    const numCpus = os.cpus().length;
    const nodeEnv = config.get<any>('nodeEnv');
    AppDataSource.initialize()
      .then(async () => {
        // VALIDATE ENV
        // validateEnv();

        const app = express();

        // TEMPLATE ENGINE
        app.set("view engine", "pug");
        app.set("views", `${__dirname}/views`);

        // MIDDLEWARE

        // 1. body-parser to parse request bodies
        //app.use(express.json({ limit: "50mb" }));
        app.use(bodyParser.json({ limit: '50mb' }));
        app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

        // 2. Logger
        if (nodeEnv === "development") app.use(morgan("dev"));

        // 3. Cookie Parser
        app.use(cookieParser());
        // 4. Cors
        let allowedOrigins = config.get<string[]>("origins");
        const corsOptions = {
          origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
            if (!origin || allowedOrigins.indexOf(origin) !== -1) {
              callback(null, true);
            } else {
              callback(new Error('Not allowed by CORS'));
            }
          },
          methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
          allowedHeaders: ['Content-Type', 'Authorization', 'Authenticate','cpAuthorisation'],
          exposedHeaders: ['x-new-token'], 
          credentials: true
        };
        
        app.use(cors(corsOptions));
        //5. helmet
        app.use(helmet({
            contentSecurityPolicy: {
              directives: {
                  defaultSrc: ["'self'"],
                  scriptSrc: ["'self'", "'unsafe-inline'"],
                  styleSrc: ["'self'","'unsafe-inline'"],
                  imgSrc: ["'self'", "data:"],
                  connectSrc: [
                      "'self'",
                    //   "https://flexiuat.avanse.com/pff-api/",
                    //   "https://uatapigateway.avanse.com"
                  ],
                  objectSrc: ["'none'"],
                  upgradeInsecureRequests: []
              }
            },
            xContentTypeOptions: true,
            frameguard: { action: 'sameorigin' },
            hidePoweredBy: true,
            referrerPolicy: { policy: 'no-referrer' },
            strictTransportSecurity: {
              maxAge: 15552000,
              includeSubDomains: true,
              preload: true
            }
        }));
        // 6. Rate Limiter
        const limiter = rateLimit({
            windowMs: 1 * 60 * 1000,
            limit: config.get<number>('rateLimit'),
            standardHeaders: 'draft-7',
            statusCode: 429,
            message: 'Too many requests from this IP, please try again after 15 minutes.',
            handler: (req, res, next) => {
                res.status(429).json({
                    status: 'fail',
                    message: 'Too many requests from this IP, please try again after 15 minutes.'
                });
            }
        });
        
        app.use(limiter);
        // 7. Middleware to disable caching (applies to all responses)
        app.use((req: Request, res: Response, next: NextFunction) => {
          res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
          res.setHeader('Pragma', 'no-cache');
          res.setHeader('Expires', '0');
          next();
        });

        app.use((req, res, next) => {
          res.set('X-XSS-Protection', '1; mode=block');
          next();
        });

        app.get('/api/healthChecker', async (_, res: Response) => {
            //const message = await redisClient.get('try');

            res.status(200).json({
                status: 'success',
                message: 'Welcome to Node.js, we are happy to see you'
                //redis: message
            });
        });
        // Adjust the path as needed
        // const swaggerDocument = YAML.load(
        //   path.join(__dirname, "../loaders/swagger.yaml")
        // );

        // Serve the Swagger UI
        // const serverUrl = config.get<string>('swaggerServerUrl') || 'http://localhost:8080/api/v1/';
        // swaggerDocument.servers[0].url = serverUrl;
        // app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
        const app1 = createExpressServer({
          controllers: [
            UserController
          ],
          middlewares: [
            // LoggingMiddleware
          ],
        });
        app.use("/api/v1", app1);

        const port = config.get<number>("port");
        AppDataSource.runMigrations();

        app.listen(port);
        console.log(`Server started with pid: ${process.pid} on port: ${port}`);
      })
      .catch((error) => console.log(error));
  }
};
