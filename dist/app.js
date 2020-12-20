"use strict";
const __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : {"default": mod};
};
Object.defineProperty(exports, "__esModule", { value: true });

const express = __importDefault(require("express"));
const path = __importDefault(require("path"));
const morgan = __importDefault(require("morgan"));

const util = require("./util");
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const db = require('./db/index');
const crawler = require('./crawler/crawler')
const cors = require('cors');

/**
 * Import routes
 */
const index = __importDefault(require("./controllers/index"));
const category = __importDefault(require("./controllers/category"));
const comic = __importDefault(require("./controllers/comic"));
const app = express.default();

// Disable CORS
app.use(cors())

/**
 * Basic setup
 */
// Connect to MongoDB
db.connect();

// Config port
const listener = app.listen(8888, function () {
    console.log('Listening on port ' + listener.address().port);
});

// Crawl data
//crawler.crawlComics()
//crawler.crawlCategories()

app.use(morgan.default('dev'));
app.use(express.default.json());
app.use(express.default.urlencoded({ extended: false }));
app.use(express.default.static(path.default.join(__dirname, 'public')));
app.use(cookieParser());

/**
 * Use routes
 */
app.use('/category', category.default);
app.use('/comic', comic.default);
app.use('/', index.default);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});
// error handler
const errorHandler = (err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // send the error response
    const statusCode = err.status || 500;
    const error = {
        message: `An error occurred: '${err}'`,
        status_code: statusCode,
    };
    util.log({ err });
    res.status(statusCode).json(error);
};
app.use(errorHandler);

exports.default = app;
