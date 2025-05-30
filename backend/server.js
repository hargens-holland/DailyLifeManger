import express from "express";
import cors from "cors";
import mysql from "mysql2";

const app = express();
const port = 3000;
app.use(cors()); // for allowing cross-origin requests from frontend to backend server.It is a middleware function.
app.use(express.json()); // for parsing application/json

app.listen(port, () => {
  console.log(`Server listening on port : ${port}`);
});

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Bluedog25!",
  database: "DailyLife",
});

app.get("/", (req, res) => {
  const queery = "SELECT * FROM users";
  connection.query(queery, (err, result) => {
    if (err) return res.json({ Message: err });
    return res.json(result);
  });
});