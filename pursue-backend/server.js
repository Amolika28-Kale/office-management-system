const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://pursue-co-working-space.netlify.app"
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Admin Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin/auth", require("./routes/admin/authRoutes"));
app.use("/api/admin/users", require("./routes/user/adminUserRoutes"));

app.use("/api/admin/dashboard", require("./routes/admin/dashboardRoutes"));
app.use("/api/admin/spaces", require("./routes/admin/spaceRoutes"));
app.use("/api/admin/bookings", require("./routes/admin/bookingRoutes"));
app.use("/api/admin/leads", require("./routes/admin/leadRoutes"));
app.use("/api/admin/inventory", require("./routes/admin/inventoryRoutes"));

app.use("/api/admin/payments", require("./routes/admin/adminPaymentRoutes"));
app.use("/api/admin/invoices", require("./routes/admin/adminInvoiceRoutes"));
app.use("/api/admin/settings", require("./routes/admin/adminSettingsRoutes"));
app.use("/api/admin/branches", require("./routes/admin/branchRoutes"));


// User Routes
app.use("/api/user", require("./routes/user/userAuthRoutes"));
app.use("/api/user/bookings", require("./routes/user/bookingRoutes"));
app.use("/api/user/spaces", require("./routes/user/spaceRoutes"));

app.use("/api/user/payments", require("./routes/user/paymentRoutes"));
app.use("/api/user/invoices", require("./routes/user/userInvoiceRoutes"));
app.use("/api/user/dashboard", require("./routes/user/dashboardRoutes"));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
