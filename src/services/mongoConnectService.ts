import mongoose from "mongoose";
// import handleErrorMongoose from "../middlewares/mongoose/handleErrorMongoose";
// import { paginationPlugin } from "../mongoose/plugins/pagination";
// import { paginationAggregatePlugin } from "../mongoose/plugins/paginationAggregate";

export const mongoConnectService = async () => {
  try {
    console.log("====== CONNECTION TO MONGO ======");
    const connection = await mongoose.connect(process.env.MONGO_URI!);
    console.log("====== CONNECTION TO MONGO : OK ======");
    return connection;
  } catch (error) {
    throw error;
  }
};
