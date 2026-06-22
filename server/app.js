import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.js";
import contentRoutes from "./routes/content.js";
import eventsRouter from "./routes/events.js";
import blogsRouter from "./routes/blogs.js";
import contactRouter from "./routes/contact.js";
import uploadRouter from "./routes/upload.js";
import paymentsRouter from "./routes/payments.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "Shree Krishna Devasthana API" });
});

app.use("/api/auth", authRouter);
app.use("/api/content", contentRoutes);
app.use("/api/upload", uploadRouter);
app.use("/api/events", eventsRouter);
app.use("/api/blogs", blogsRouter);
app.use("/api/contact", contactRouter);
app.use("/api/payments", paymentsRouter);

export default app;
