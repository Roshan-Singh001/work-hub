import app from "./app.js";
import { configDotenv } from "dotenv";

configDotenv()

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})

