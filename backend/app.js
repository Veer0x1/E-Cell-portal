const express = require("express");
const multer = require("multer");
const fs = require("fs");
const app = express();

app.get("/", (req, res) => {
  res.send("working");
});

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  console.log(file);
  console.log("log1");

  fs.readFile(file.path, "utf-8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error reading file" });
    }

    fs.readFile("startups/startups.json", "utf-8", (err, startupsData) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "error reading existing file" });
      }

      // Merge the new data with the existing data
      const newData = JSON.parse(data);
      const mergedData = Object.assign({}, newData, JSON.parse(startupsData));

      fs.writeFile(
        "startups/startups.json",
        JSON.stringify(mergedData),
        (err) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ message: "Error writing file" });
          }

          console.log("File written successfully");
          res
            .status(200)
            .json({ message: "File uploaded and merged successfully" });
        }
      );
    });
  });
});
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
