import slugify from "slugify";
import "dotenv-flow/config";

export const tests = () => {
  console.log("====== TEST ======");
  console.log(
    "slugify username : Alica al país de las maravillas >>> ",
    slugify("Alica al país de las maravillas", {
      lower: true,
      replacement: "_",
    })
  );
  console.log("get from .env.* JWT_SECRET: ", process.env.JWT_SECRET);
  console.log("====== END TEST ======");
};
