import React from "react";
import { Router } from "@reach/router";
import Notes from "./Notes";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

const App: React.FC = () => {
  return (
    <Router>
      <SignIn path="/" />
      <SignUp path="/register" />
      <Notes path="/notes" />
    </Router>
  );
};

export default App;
