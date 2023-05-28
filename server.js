import app from "./app.js";
import { DatabaseConnect } from "./config/database.js";

DatabaseConnect();

app.listen(process.env.PORT, () => {
  console.log(`server is started on port : ${process.env.PORT}`);
});
