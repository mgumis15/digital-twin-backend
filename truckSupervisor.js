const BFS = require("./BFS.js")
const truckPosition = {
    x: 1, y: 1
}

var io = null
const runSocket = (server) => {
    io = server

    io.on("connection", socket => {
        io.emit("truckPosition", truckPosition)
        // console.log("Connected ", socket.id)
        socket.on("disconnect", () => {
            // console.log("Disconnected ", socket.id)
        })

    })
}


const truckPositionSocket = () => {

    io.emit("truckPosition", truckPosition)
}
const truckPositionInterwal = {
    interval: setInterval(truckPositionSocket, 1000)
}

const tasks = [
]
const currentTask = {
    task: null,
    interval: null
}
const warehouseMap = []


const createMap = (storeFile) => {
    for (let i = 0; i < 25; i++) {
        warehouseMap[i] = []
        for (let j = 0; j < 25; j++) {
            warehouseMap[i][j] = false
        }
    }
    storeFile.products.forEach(e => {
        warehouseMap[e.localization.y - 1][e.localization.x - 1] = true
    })
}

const addTask = (task) => {
    tasks.push(task)
    runTruck()
}

const getTasks = () => {
    return tasks
}

const deleteTask = (id) => {
    let i = tasks.findIndex(task => task.task.id == id)
    if (i >= 0)
        tasks.splice(i, 1)
    if (currentTask.task && currentTask.task.id === id) {
        clearInterval(currentTask.interval)
        currentTask.task = null
        io.emit("currentPath", [])
        runTruck()
    }
}

const runTruck = () => {
    if (currentTask.task == null && tasks.length > 0) {
        clearInterval(truckPositionInterwal.interval)
        truckPositionInterwal.interval = null
        currentTask.task = tasks[0].task
        let path = BFS.BFS(warehouseMap, truckPosition, currentTask.task.localization)
        currentTask.interval = setInterval(() => {
            let nextHop = path.shift()
            truckPosition.x = nextHop.x
            truckPosition.y = nextHop.y
            io.emit("truckPosition", truckPosition)
            io.emit("currentPath", path)
            if (path.length === 0) {
                clearInterval(currentTask.interval)
                if (!truckPositionInterwal.interval)
                    truckPositionInterwal.interval = setInterval(truckPositionSocket, 1000)
                tasks.shift()
                currentTask.task = null
                currentTask.interval = null
                runTruck()
            }
        }, 1000)
    } else {
        if (!truckPositionInterwal.interval)
            truckPositionInterwal.interval = setInterval(truckPositionSocket, 1000)
    }
}


module.exports = { runSocket, createMap, addTask, deleteTask, getTasks, runTruck }