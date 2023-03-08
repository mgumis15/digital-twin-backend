const express = require("express")
const bodyParser = require('body-parser')
const http = require(("http"))
const PORT = 4000
const res = require("express/lib/response")
const fs = require('fs')
const app = express()
const pagination = require("./pagination.js")
const truck = require("./truckSupervisor.js")
let storeFile = JSON.parse(fs.readFileSync("data/fakeStore.json"))
let logsFile = JSON.parse(fs.readFileSync("data/fakeLogs.json"))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

truck.createMap(storeFile)

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    )
    next()
})


app.get("/logs", pagination.filterResults(logsFile.logs, "logs"), pagination.paginatedResults(), (req, res) => {
    const page = req.query.page
    if (page) {
        res.json(req.result)
    } else
        res.json(logsFile)
})

app.get("/products", pagination.filterResults(storeFile.products, "products"), pagination.paginatedResults(), (req, res) => {
    const page = req.query.page
    if (page) {
        res.json(req.result)
    } else
        res.json(storeFile)
})

app.get("/tasks", (req, res) => {
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

app.listen(PORT, (error) => {
    if (!error)
        console.log("Lisiten on the port " + PORT.toString())
    else
        console.log("Error")
})



