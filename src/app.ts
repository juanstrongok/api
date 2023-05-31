import express from "express";
import { router } from "./router";
import morgan from "morgan";
import cors from "cors";
import { tests } from "./tests";
import { mongoConnectService } from "./services/mongoConnectService";
import { createAuth2ServerAppService } from "./services/createAuth2ServerAppService";

try {
  (async () => {
    // Connect to mongo
    await mongoConnectService();
    // Create default app
    await createAuth2ServerAppService();
    // Create express app
    const app = express();
    // Middlewares
    app.use(express.json()); // for parsing application/json
    app.use(cors()); // for cors
    app.use(morgan("dev")); // for logging
    // Routes
    app.use(router);
    // Start server
    app.listen(3400, () => {
      console.log("App start on port 3400");
    });
    // Tests
    tests();
  })();
} catch (error) {
  console.log(error);
}
