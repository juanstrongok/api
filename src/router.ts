import { Router, Request, Response } from "express";
import { uploadFileController } from "./controllers/uploadFileController";

export const router = Router();

// Portrait : resize 1080, 720, 640, 480, 320, 240 (Instagram)
// 1350/1080 --> 1.25
// 900/720 --> 1.25
// 800/640 --> 1.25
// 600/480 --> 1.25
// 400/320 --> 1.25
// 300/240 --> 1.25

// landscape : resize 1080, 720, 640, 480, 320, 240 (Instagram)
// 1080/810 --> 1.33
// 720/540 --> 1.33
// 640/480 --> 1.33
// 480/360 --> 1.33
// 320/240 --> 1.33
// 240/180 --> 1.33

// resize 1080, 720, 640, 480, 320, 240 (Instagram)

router.post("/upload", uploadFileController);
