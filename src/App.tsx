import React from "react";
import { Router } from "@reach/router";
import Notes from "./Notes"

const App: React.FC = () => {
  return (
    <Router>
      <Notes path="/notes" />
    </Router>
  ) 
};

export default App;
