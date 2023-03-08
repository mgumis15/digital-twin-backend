const BFS = (graph, source, destination) => {
    let dest = { x: destination.x - 1, y: destination.y - 1 }
    let src = { x: source.x - 1, y: source.y - 1 }
    let queue = []
    let M = JSON.parse(JSON.stringify(graph))
    for (let i = 0; i < M.length; i++) {
        for (let j = 0; j < M[i].length; j++) {
            M[i][j] = {
                isPackage: M[i][j],
                visited: false,
                parent: null
            }
        }
    }
    M[src.y][src.x].visited = true
    M[src.y][src.x].parent = null

    queue.push({ x: src.x, y: src.y })
    while (queue.length > 0) {
        current = queue.shift()
        if (current.x - 1 >= 0 && M[current.y][current.x - 1].visited != true) {
            if (current.x - 1 == dest.x && current.y == dest.y) {
                break
            }
            if (!M[current.y][current.x - 1].isPackage) {
                queue.push({ x: current.x - 1, y: current.y })
                M[current.y][current.x - 1].parent = current
                M[current.y][current.x - 1].visited = true
            }

        }
        if (current.x + 1 < graph[0].length && M[current.y][current.x + 1].visited != true) {
            if (current.x + 1 == dest.x && current.y == dest.y) {
                break
            }
            if (!M[current.y][current.x + 1].isPackage) {
                queue.push({ x: current.x + 1, y: current.y })
                M[current.y][current.x + 1].parent = current
                M[current.y][current.x + 1].visited = true
            }
        }
        if (current.y - 1 >= 0 && M[current.y - 1][current.x].visited != true) {
            if (current.x == dest.x && current.y - 1 == dest.y) {
                break
            }
            if (!M[current.y - 1][current.x].isPackage) {
                queue.push({ x: current.x, y: current.y - 1 })
                M[current.y - 1][current.x].parent = current
                M[current.y - 1][current.x].visited = true
            }
        }
        if (current.y + 1 < graph.length && M[current.y + 1][current.x].visited != true) {
            if (current.x == dest.x && current.y + 1 == dest.y) {
                break
            }
            if (!M[current.y + 1][current.x].isPackage) {
                queue.push({ x: current.x, y: current.y + 1 })
                M[current.y + 1][current.x].parent = current
                M[current.y + 1][current.x].visited = true
            }
        }
    }
    let path = []
    while (M[current.y][current.x].parent != null) {
        path.push({ x: current.x + 1, y: current.y + 1 })
        current = M[current.y][current.x].parent
    }
    path.push({ x: current.x + 1, y: current.y + 1 })
    return path.reverse()
}

module.exports = { BFS }