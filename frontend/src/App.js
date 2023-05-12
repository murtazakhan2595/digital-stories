import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Landing from "./pages/Landing/Landing";
import Trending from "./pages/Trending/Trending";
import Leaderboard from "./pages/Leaderboard/Leaderboard";
import Engagements from "./pages/Engagements/Engagements";
import UpdateStory from "./pages/UpdateStory/UpdateStory";
import MyStories from "./pages/MyStories/MyStories";
import StoryDetails from "./pages/StoryDetails/StoryDetails";
import Navigation from "./components/shared/Navigation/Navigation.js";
import SignUp from "./pages/SignUp/SignUp";
import SignIn from "./pages/SignIn/SignIn";
import Home from "./pages/Home/Home";
import Error from "./pages/Error/Error";
import Spinner from "./components/shared/Spinner/Spinner";
import usePersistentSession from "./hooks/usePersistentSession.js";
import MultiStepCreateStoryEntry from "./pages/MultiStepCreateStoryForm/MultiStepCreateStoryEntry";
import { GlobalContextProvider } from "./context/globalContext";

function App() {
  const { loading } = usePersistentSession();
  return loading ? (
    <Spinner message="Loading, please wait" />
  ) : (
    <GlobalContextProvider>
      <BrowserRouter>
        <div className="layout">
          <Navigation />
          <Routes>
            <Route
              className="main"
              path="/"
              element={
                <PublicRoute>
                  <Landing />
                </PublicRoute>
              }
            />
            <Route
              className="main"
              path="/get-started"
              element={
                <PublicRoute>
                  <SignUp />
                </PublicRoute>
              }
            />
            <Route
              className="main"
              path="/sign-in"
              element={
                <PublicRoute>
                  <SignIn />
                </PublicRoute>
              }
            />
            <Route
              className="main"
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              className="main"
              path="/trending"
              element={
                <ProtectedRoute>
                  <Trending />
                </ProtectedRoute>
              }
            />
            <Route
              className="main"
              path="/create-story"
              element={
                <ProtectedRoute>
                  <MultiStepCreateStoryEntry />
                </ProtectedRoute>
              }
            />
            <Route
              className="main"
              path="/leaderboard"
              element={
                <ProtectedRoute>
                  <Leaderboard />
                </ProtectedRoute>
              }
            />
            <Route
              className="main"
              path="/engagements"
              element={
                <ProtectedRoute>
                  <Engagements />
                </ProtectedRoute>
              }
            />
            <Route
              className="main"
              path="/my-stories"
              element={
                <ProtectedRoute>
                  <MyStories />
                </ProtectedRoute>
              }
            />
            <Route
              className="main"
              path="/story"
              element={
                <ProtectedRoute>
                  <StoryDetails />
                </ProtectedRoute>
              }
            />
            <Route
              className="main"
              path="/update-story"
              element={
                <ProtectedRoute>
                  <UpdateStory />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Error />} />
          </Routes>
        </div>
      </BrowserRouter>
    </GlobalContextProvider>
  );
}

function PublicRoute({ children, ...rest }) {
  const isAuth = useSelector((state) => state.auth.isAuth);
  return isAuth ? <Navigate to="/home" /> : <>{children}</>;
}

function ProtectedRoute({ children, ...rest }) {
  const isAuth = useSelector((state) => state.auth.isAuth);
  return isAuth ? <>{children}</> : <Navigate to="/" />;
}
export default App;
