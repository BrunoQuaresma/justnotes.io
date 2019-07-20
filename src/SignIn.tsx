import React from "react";
import { RouteComponentProps, Link } from "@reach/router";

const SignIn: React.FC<RouteComponentProps> = () => {
  return (
    <div className="container h-100 d-flex align-items-center">
      <div className="row">
        <div className="col-md-8">
          <h1 className="display-2 font-weight-bold">
            Welcome back to your notes app.{" "}
            <span className="text-muted font-weight-normal">
              Just simple, just notes.
            </span>
          </h1>
        </div>
        <div className="col-md-4">
          <div className="form-group mt-4">
            <label htmlFor="">E-mail</label>
            <input autoFocus type="text" className="form-control" />
          </div>

          <div className="form-group">
            <label htmlFor="">Password</label>
            <input type="text" className="form-control" />
          </div>

          <div className="form-group">
            <button className="btn btn-dark btn-block">Login</button>
            <button className="btn btn-light btn-block">Register</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
