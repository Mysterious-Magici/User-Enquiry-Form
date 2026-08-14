let express = require("express");
const {
  enquiryInsert,
  enquiryRead,
  enquiryShow,
  enquiryUpdate,
  enquiryDelete,
} = require("../../controllers/web/enquiryController");

let enquiryRouter = express.Router();

enquiryRouter.post("/insert", enquiryInsert);      // CREATE
enquiryRouter.get("/read", enquiryRead);           // READ (list)
enquiryRouter.get("/view/:id", enquiryShow);       // READ (single)
enquiryRouter.put("/update/:id", enquiryUpdate);   // UPDATE
enquiryRouter.delete("/delete/:id", enquiryDelete);// DELETE

module.exports = enquiryRouter;
