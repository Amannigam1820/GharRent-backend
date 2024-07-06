import express from "express";
const router = express.Router();

router.get("/test",(req,res)=>{
    res.send("Api worsks")
    console.log("Router works");
})

export default router;