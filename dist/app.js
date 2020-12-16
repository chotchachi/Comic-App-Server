"use strict";
const __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : {"default": mod};
};

Object.defineProperty(exports, "__esModule", { value: true });
const util = require("./util");
const createError = require('http-errors');
const express = __importDefault(require("express"));
const path = __importDefault(require("path"));
const cookieParser = require('cookie-parser');
const morgan = __importDefault(require("morgan"));
const db = require('./db/index');

/**
 * Import routes
 */
const index = __importDefault(require("./index"));
const detail = __importDefault(require("./controllers/detail"));
const chapter_detail = __importDefault(require("./controllers/chapter_detail"));
const search_comic = __importDefault(require("./search_comic"));
const category = __importDefault(require("./controllers/category"));
const category_detail = __importDefault(require("./controllers/category_detail"));
const app = express.default();

/**
 * Basic setup
 */

// Connect to MongoDB
db.connect();

//Config port
const listener = app.listen(8888, function () {
    console.log('Listening on port ' + listener.address().port);
});

app.use(morgan.default('dev'));
app.use(express.default.json());
app.use(express.default.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.default.static(path.default.join(__dirname, 'public')));

/**
 * Use routes
 */
app.use('/', index.default);
app.use('/comic_detail', detail.default);
app.use('/chapter_detail', chapter_detail.default);
app.use('/search_comic', search_comic.default);
app.use('/category', category.default);
app.use('/category_detail', category_detail.default);

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
