const express = require("express");
const AWS = require("aws-sdk");
const sqlite3 = require('sqlite3').verbose();
const path = require("path");
const { v4: uuid } = require('uuid');

AWS.config.update({ region: "ap-south-1" });
const sqs = new AWS.SQS();
const QueueUrl = "https://sqs.ap-south-1.amazonaws.com/473220211695/MyQueue";

let db = new sqlite3.Database(path.resolve(__dirname, 'mydb.db'), sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.log(err.message)
    }
    console.log('connected to database')
})

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/static/index.html')
})

app.post("/add-to-queue", (req, res) => {
    const { message, "sleep-time": sleep_time } = req.body;
    const message_id = uuid();
    db.run(`INSERT INTO messages(message_id, message, sleep_time, status) VALUES (?, ?, ?, ?)`, [message_id ,message, sleep_time, "Queued"], (err) => {
        if (err) console.log(err);
        const params = {
            QueueUrl,
            MessageBody: JSON.stringify({ message_id, message, sleep_time })
        }
        sqs.sendMessage(params, (err, data) => {
            if (err) console.log(err)
            console.log("Success", data.MessageId)
            res.sendFile(__dirname + '/static/index.html')
        })
    })


})

app.get("/queue-items", (req, res) => {
    const query = `SELECT * FROM messages`;
    db.all(query, (err, rows) => {
        res.json(rows)
    });

})

app.listen(3000, () => {
    console.log("Server started on port 3000")
})