require("dotenv").config();
let express = require("express");
let mongoose = require("mongoose");
let cors = require("cors");
const enquiryRouter = require("./App/routes/web/enquiryRoutes");

let app = express();

app.use(express.json());
app.use(cors());

app.get("/", (_req, res) => {
  res.json({ status: 1, message: "User Enquiry API is running" });
});

app.use("/api/website/enquiry", enquiryRouter);

app.use((_req, res) => {
  res.status(404).json({ status: 0, message: "Route not found" });
});

const PORT = process.env.PORT || 5000;
const DB_URL = process.env.DB_URL;

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(
      "There is an error while connecting to the database:",
      err.message
    );
  });

app.listen(PORT, () => {
  console.log(`Server runs successfully on port ${PORT}`);
});
