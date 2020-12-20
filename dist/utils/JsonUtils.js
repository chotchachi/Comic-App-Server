toJsonWithData = (message, totalResult, data) => {
    return {
        message: message,
        totalResult: totalResult,
        data: data
    };
}

toJsonWithData = (message, data) => {
    let dataArr = []

    if (Array.isArray(data)) {
        dataArr = data
    } else {
        dataArr.push(data)
    }

    return {
        message: message,
        totalResult: dataArr.length,
        data: dataArr
    };
}

jsonMessage = (message) => {
    return {
        message: message
    }
}

module.exports = { toJsonWithData, jsonMessage };
