import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"})) 
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


// Route import
import authRouter from "./routes/auth.routes.js"
// import productRouter from "./routes/product.routes.js"
import cartRouter from "./routes/cart.routes.js"
// import paymentRouter from "./routes/payment.routes.js"

// Router Declaration
app.use("/api/v1/auth", authRouter);
// app.use("/api/v1/products", productRouter);
app.use("/api/v1/cart", cartRouter);
// app.use("/api/v1/payment", paymentRouter);





export { app }