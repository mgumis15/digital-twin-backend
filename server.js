const express = require("express")
const bodyParser = require('body-parser')
const path = require("path")
const http = require(("http"))
const PORT = process.env.PORT || 3000
const res = require("express/lib/response")
const fs = require('fs')
const app = express()
const httpServer = app.listen(PORT, () => { console.log(`Server listening on port ${PORT}`) })
const cors = require('cors')
const { Server } = require("socket.io")
const pagination = require("./pagination.js")
const truck = require("./truckSupervisor.js")
const io = new Server(httpServer)
truck.runSocket(io)

let storeFile = JSON.parse(fs.readFileSync("data/fakeStore.json"))
let logsFile = JSON.parse(fs.readFileSync("data/fakeLogs.json"))

app.use(express.static(path.join(__dirname, "../frontend")))
app.use(express.static("public"))

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

truck.createMap(storeFile)


app.get("/getLogs", pagination.filterResults(logsFile.logs, "logs"), pagination.paginatedResults(), (req, res) => {
    const page = req.query.page
    if (page) {
        res.json(req.result)
    } else
        res.json(logsFile)
})

app.get("/getProducts", pagination.filterResults(storeFile.products, "products"), pagination.paginatedResults(), (req, res) => {
    const page = req.query.page
    if (page) {
        res.json(req.result)
    } else
        res.json(storeFile)
})

app.get("/getTasks", (req, res) => {
    res.json(truck.getTasks())
})

app.post("/taskAdd", (req, res) => {
    let data = req.body
    truck.addTask(data)
    res.json(data)
})

app.post("/taskDelete", (req, res) => {
    let data = req.body
    truck.deleteTask(data.id)
    res.json(data)
})



app.get("/warehouse", (req, res) => {
    const wearhouse = {
        x: 300,
        y: 400
    }
    res.json(wearhouse)
})

app.use('*', (req, res, next) => {
    res.sendFile(path.join(__dirname, "../frontend", "index.html"))
})


