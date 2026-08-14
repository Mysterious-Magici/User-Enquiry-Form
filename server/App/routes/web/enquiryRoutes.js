let express = require("express");
const {
  enquiryInsert,
  enquiryRead,
  enquiryShow,
  enquiryUpdate,
  enquiryDelete,
} = require("../../controllers/web/enquiryController");

let enquiryRouter = express.Router();

enquiryRouter.post("/insert", enquiryInsert);      
enquiryRouter.get("/read", enquiryRead);           
enquiryRouter.get("/view/:id", enquiryShow);       
enquiryRouter.put("/update/:id", enquiryUpdate);   
enquiryRouter.delete("/delete/:id", enquiryDelete);

module.exports = enquiryRouter;
