import mongoose from "mongoose";

const DatabaseConnect = async () => {
  mongoose.set("strictQuery", false);
  mongoose
    .connect(process.env.DB_URI)
    .then((data) => {
      console.log(`Mongodb connected with server: ${data.connection.host}`);
    })
    .catch((err) => {
      console.log(err);
    });
};
 
export { DatabaseConnect };
