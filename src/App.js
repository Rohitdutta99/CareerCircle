import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { connect, useSelector } from "react-redux";
import Login from "./components/Login.js";
import Home from "./components/Home.js";
import { getUserAuth } from "./actions/index.js";

function App(props) {
  const user = useSelector((state) => state.user);
  
  useEffect(() => {
    props.getUserAuth();
  }, [props]);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={user ? <Navigate to="/home" /> : <Login />}
          />
          <Route path="/home" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

const mapDispatchToProps = (dispatch) => ({
  getUserAuth: () => dispatch(getUserAuth()),
});

export default connect(null, mapDispatchToProps)(App);
