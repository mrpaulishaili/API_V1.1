import dotenv from "dotenv";
dotenv.config();
import "express-async-errors";
// express

import express from "express";
const app = express();

// rest of the packages
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimiter from "express-rate-limit";
import helmet from "helmet";
import xss from "xss-clean";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";
import mongoose from "mongoose";
//  routers
import authRouter from "./routes/authRoutes";
import userRouter from "./routes/userRoutes";
import productRouter from "./routes/productRoutes";
import reviewRouter from "./routes/reviewRoutes";
import orderRouter from "./routes/orderRoutes";

// middleware
import notFoundMiddleware from "./middleware/not-found";
import errorHandlerMiddleware from "./middleware/error-handler";

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);
//--------------third party middleware------------------------//
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(morgan("combined"));
app.use(mongoSanitize());
app.use(cookieParser(process.env.JWT_SECRET));
//--------------third party middleware------------------------//

//--------------express middleware------------------------//
app.use(express.json());
app.use(express.static("./public"));
//--------------express middleware------------------------//

//--------------routes------------------------//
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/orders", orderRouter);
//--------------routes------------------------//

//--------------error middlewares------------------------//
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
//--------------error middlewares------------------------//

const PORT = process.env.PORT || 5000;
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    app.listen(PORT, () =>
      console.log(
        `Server is started in ${process.env.NODE_ENV} on http://localhost:${PORT}...`
      )
    );
  } catch (error) {
    console.log(error);
  }
})();
