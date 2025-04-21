const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const exceljs = require("exceljs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("uploads"));

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/goeasyweb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schemas
const User = require("./models/user");
const Upload = require("./models/upload");
const Report = require("./models/report");

// Login
app.post("/api/login/:role", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password, role: req.params.role });
  res.json(user ? { success: true, user } : { success: false });
});

// User APIs
app.post("/api/users", async (req, res) => {
  const { username, password, role } = req.body;
  await User.create({ username, password, role });
  res.json({ success: true });
});

app.get("/api/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.delete("/api/users/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

app.put("/api/users/:id/password", async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { password: req.body.password });
  res.json({ success: true });
});

// Multer setup
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage });

// Upload APIs
app.post("/api/upload/excel", upload.single("file"), async (req, res) => {
  const { category } = req.body;
  await Upload.create({ type: "excel", filename: req.file.filename, category });
  res.json({ success: true });
});

app.post("/api/upload/image", upload.single("file"), async (req, res) => {
  await Upload.create({ type: "image", filename: req.file.filename });
  res.json({ success: true });
});

app.get("/api/view/image", async (req, res) => {
  const img = await Upload.findOne({ type: "image" }).sort({ _id: -1 });
  if (!img) return res.json({});
  res.json({ image: `/uploads/${img.filename}` });
});

app.get("/api/excel/:category", async (req, res) => {
  const file = await Upload.findOne({ type: "excel", category: req.params.category }).sort({ _id: -1 });
  if (!file) return res.json({ data: [] });

  const workbook = new exceljs.Workbook();
  await workbook.xlsx.readFile(`uploads/${file.filename}`);
  const worksheet = workbook.worksheets[0];

  const data = [];
  worksheet.eachRow((row) => {
    data.push(row.values.slice(1));
  });

  res.json({ data });
});

// Reports
app.post("/api/report/:type", async (req, res) => {
  const { type } = req.params;
  await Report.create({ type, ...req.body });
  res.json({ success: true });
});

app.get("/api/report/:type", async (req, res) => {
  const { type } = req.params;
  const query = { type };
  if (req.query.plant) query.plant = req.query.plant;
  if (req.query.shift) query.shift = req.query.shift;

  if (req.query.startDate && req.query.endDate) {
    query.date = {
      $gte: req.query.startDate,
      $lte: req.query.endDate,
    };
  }

  const reports = await Report.find(query).sort({ createdAt: -1 });
  res.json(reports);
});

// Export to Excel
app.get("/api/report/:type/export", async (req, res) => {
  const { type } = req.params;
  const reports = await Report.find({ type });

  const workbook = new exceljs.Workbook();
  const worksheet = workbook.addWorksheet("Reports");

  if (reports.length > 0) {
    worksheet.addRow(Object.keys(reports[0]._doc));
    reports.forEach((r) => worksheet.addRow(Object.values(r._doc)));
  }

  const filename = `${type}-export.xlsx`;
  const filePath = path.join(__dirname, "uploads", filename);
  await workbook.xlsx.writeFile(filePath);

  res.download(filePath, filename);
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
