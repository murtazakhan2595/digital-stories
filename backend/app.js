const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const storyRouter = require("./routes/storyRoutes");
const userRouter = require("./routes/userRoutes");
const commentRouter = require("./routes/commentRoutes");
const engagementRouter = require("./routes/engagementRoutes");
const voteRouter = require("./routes/voteRoutes");
const leaderBoardRouter = require("./routes/leaderBoardRoutes");

const app = express();
app.use(express.json());

// 1) MIDDLEWARES
app.use(morgan("dev"));
app.use(cookieParser());

// 3) ROUTES
app.use("/stories", storyRouter);
app.use("/users", userRouter);
app.use("/comments", commentRouter);
app.use("/engagements", engagementRouter);
app.use("/votes", voteRouter);
app.use("/leaderboard", leaderBoardRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
