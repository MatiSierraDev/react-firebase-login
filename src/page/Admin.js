import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { withRouter } from "react-router";

import "./Admin.css";
import Crud from "../components/Crud/Crud";

const Admin = ({ history }) => {
  const auth = getAuth();
  let currentUser = auth.currentUser || false;
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
    } else {
      // console.log("no loegueado");
      history.push("/login");
    }
  }, [currentUser, history, user]);

  return (
    <section className="admin">
      {!user ? "No esta logueado" : <Crud user={user.uid} />}
      {/* {!user ? "No esta logueado" : `Bienvenid@ ${user.uid} 🤗`} */}
    </section>
  );
};

export default withRouter(Admin);
