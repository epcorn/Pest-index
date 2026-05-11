import express from "express";
import { getCity } from "../controller/datacontroller.js";

const router = express.Router();

router.get("/weather", getCity);


export default router;
