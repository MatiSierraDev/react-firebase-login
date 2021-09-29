import React from "react";
import { Link, NavLink, withRouter } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

import "./Header.css";

const Header = ({ observerUser, history }) => {
  const handleLogout = (e) => {
    e.preventDefault(e);

    const auth = getAuth();

    signOut(auth)
      .then(() => {
        // console.log(auth);
        history.push("/login");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <header className="header">
      <div className="wrapper">
        <div className="header-content">
          <Link className="logo" to="/">
            <h2 className="spacial">🚀</h2>
          </Link>
          <nav className="nav">
            <NavLink exact to="/" activeClassName="active">
              Home
            </NavLink>
            {observerUser ? (
              <>
                <NavLink to="/admin" activeClassName="active">
                  Admin
                </NavLink>
                <button
                  onClick={(e) => handleLogout(e)}
                  style={{
                    padding: "1rem",
                    listStyle: "none",
                    textDecoration: "none",
                    color: "teal",
                    border: "1px solid teal",
                    cursor: "pointer",
                    margin: "0px",
                    fontWeight: "bold",
                    borderRadius: "0px",
                    backgroundColor: "white",
                    boxShadow: "none",
                    fontFamily: "sans-serif",
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <NavLink to="/login" activeClassName="active">
                Login
              </NavLink>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default withRouter(Header);
