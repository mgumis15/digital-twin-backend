const getSliceIndex = (page, limit) => {

    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    return [startIndex, endIndex]
}
const paginatedResults = () => {
    return (req, res, next) => {
        const page = req.query.page
        const query = req.query.query

        let indexes = getSliceIndex(page, 10)
        result = {}
        result.hasMore = true
        result.data = req.result.slice(indexes[0], indexes[1])

        if (indexes[1] >= req.result.length)
            result.hasMore = false
        req.result = result
        next()
    }
}

const filterResults = (model, resource) => {
    return (req, res, next) => {
        const query = req.query.query
        switch (resource) {
            case "logs":
                req.result = model.filter((item) =>
                (item.product_id.toString().startsWith(query)
                    || item.id.toString().startsWith(query))
                )
                break
            case "products":
                req.result = model.filter((item) =>
                (item.id.toString().startsWith(query)
                    || item.product_info?.includes(query))
                )
                break
        }
        next()
    }
}

module.exports = { getSliceIndex, paginatedResults, filterResults }