import { Request, Response } from "express";
import busboy from "busboy";
import sharp from "sharp";

export const uploadFileController = async (req: Request, res: Response) => {
  try {
    const sizes = [
      { width: 1080, height: 1080, ratio: 1 / 1, type: "square" }, // Square size
      { width: 1080, height: 1350, ratio: 4 / 5, type: "portrait" }, // Vertical size
      { width: 1080, height: 566, ratio: 1.91 / 1, type: "landscape" }, // Horizontal size
    ];

    const bb = busboy({ headers: req.headers });
    bb.on("file", async (name, file, info) => {
      const { filename, encoding, mimeType } = info;
      console.log(
        `File [${name}]: filename: %j, encoding: %j, mimeType: %j`,
        filename,
        encoding,
        mimeType
      );
      if (mimeType !== "image/jpeg") {
        return res.status(400).json({
          message: "Only jpeg files are allowed",
        });
      } else if (mimeType === "image/jpeg") {
        const chunks: any = [];
        file.on("data", (chunk) => {
          chunks.push(chunk);
        });

        file.on("end", async () => {
          const initBuffer = Buffer.concat(chunks);
          let buffer = initBuffer;

          const response = await sharp(buffer).rotate(0).metadata();
          let { height, width, orientation } = response!;
          const rotate = orientation === 6 || orientation === 5 ? 90 : 0;
          const flip = orientation === 2 || orientation === 5 ? true : false;
          console.log(orientation);

          let orientationType =
            height! > width!
              ? "portrait"
              : height! < width!
              ? "landscape"
              : "square";

          if (rotate === 90) {
            orientationType =
              orientationType === "portrait" ? "landscape" : "portrait";
          }

          const size =
            orientationType === "portrait"
              ? sizes.find((size) => size.type === "portrait")
              : orientationType === "landscape"
              ? sizes.find((size) => size.type === "landscape")
              : sizes.find((size) => size.type === "square");

          const targetAspectRatio = size!.ratio;
          let resizeWidth = size!.width;
          let resizeHeight = size!.height;

          // ================== RESIZE ==================
          const resizedImage = await sharp(buffer)
            .rotate(rotate)
            .flip(flip)
            .resize({
              width: resizeWidth,
              height: resizeHeight,
              fit: "inside",
            })
            .webp({ quality: 100 })
            .toBuffer();

          return res.status(200).json({
            message: "File uploaded",
            p: resizedImage.toString("base64"),
            width: resizeWidth,
            height: resizeHeight,
            orientation: orientationType,
            ratio: targetAspectRatio,
          });
        });
      }
    });
    req.pipe(bb);
  } catch (error: any) {
    console.log(error);
    res.status(400).json({
      message: error.message,
    });
  }
};
