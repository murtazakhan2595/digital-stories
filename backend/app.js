const express = require("express");
const morgan = require("morgan");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const storyRouter = require("./routes/storyRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();
app.use(express.json());

// 1) MIDDLEWARES
app.use(morgan("dev"));

// 3) ROUTES
app.use("/stories", storyRouter);
app.use("/users", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
