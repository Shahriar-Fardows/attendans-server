const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://shahriarfardows:pubstudent@pubstudent.v3f0l.mongodb.net/?retryWrites=true&w=majority&appName=pubstudent";

async function connectDB() {
  try {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();

    // data base create
    const teacherData = client.db("presidency").collection("teacher");
    const attendance = client.db("presidency").collection("attendance");

    // teacher er data post and get hobe ai code diya 

    app.post("/api/addTeacher", async (req, res) => {
      const teacher = req.body;
      const result = await teacherData.insertOne(teacher);
      res.json(result);
    });

    app.get("/api/getTeacher", async (req, res) => {
      const cursor = teacherData.find({});
      const teachers = await cursor.toArray();
      res.json(teachers);
    });

    // attendance er data post and get hobe ai code diya

    app.post("/api/Attendance", async (req, res) => {
        const attendanceData = req.body;
        const result = await attendance.insertOne(attendanceData);
        res.json(result);
        });

    app.get("/api/Attendance", async (req, res) => {
        const cursor = attendance.find({});
        const attendances = await cursor.toArray();
        res.json(attendances);
        });

        app.patch("/api/Attendance/:id", async (req, res) => {
            const id = req.params.id;
            const updatedAttendance = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
              $set: {
                attendance: updatedAttendance.attendance,
              },
            };
            const result = await attendance.updateOne(filter, updateDoc, options);
            res.json(result);
          });

          app.delete("/api/deleteAttendance/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await attendance.deleteOne(filter);
            res.json(result);
          });

          app.get("/api/getAttendance/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const attendanceData = await attendance.findOne(filter);
            res.json(attendanceData);
          });


    console.log("MongoDB Connected Successfully!");
    return client.db("test"); // ডাটাবেজ রিটার্ন করবে
  } catch (error) {
    console.error("MongoDB Connection Failed:", error);
  }
}

let db;
connectDB().then((database) => {
  db = database;
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
