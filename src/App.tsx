import React from "react";
import { Router } from "@reach/router";
import Notes from "./Notes";
import SignIn from "./SignIn";

const App: React.FC = () => {
  return (
    <Router>
      <SignIn path="/" />
      <Notes path="/notes" />
    </Router>
  );
};

export default App;
