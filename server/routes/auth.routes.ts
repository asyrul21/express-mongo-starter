import express from "express";
const router = express.Router();
import { SignIn, Register } from "../controllers/auth.controllers";
// import { requireLogin, mustBeAdmin } from "../middlewares/auth.middlewares";

router.post("/signin", SignIn);
router.post("/signup", Register);

export default router;
