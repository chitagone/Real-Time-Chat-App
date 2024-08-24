import mongoose from "mongoose";

const connect = async () => {
  try {
    console.log(`Attempting to connect to database ...`);
    await mongoose.connect(process.env.MONGO_RUL, {});
    console.log(`Connected to database...`);
  } catch (error) {
    console.log(`Fail Connect to batabase ...`, error.message);
    process.exit(1);
  }
};

export default connect;
