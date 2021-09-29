import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./components/header/Header";
import Login from "./page/Login";
import Admin from "./page/Admin";
import Home from "./page/Home";
import Error404 from "./page/Error404";
import Footer from './components/Footer/Footer'
import "./App.css";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Loader from "./components/Loader/Loader";

function App() {
  //seteo al usuario cuando lo detecto
  const [observerUser, setObserverUser] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    //Observador de usuario por que el auth.currentUser tarda unos segundos, de esta forma vamos a obtener el valor de auth.currentUser
    // y vamos a poder pintar lo que hagamos en el componente admin
    //evalua los cambiios, si se cierra sesion se vuelve a ejecutar
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // console.log(user);
        setObserverUser(user);
      } else {
        setObserverUser(null);
      }
    });
  }, []);

  //Mientras tarde vamos a pintar un "cargando..." cuando no este cargando es por que seteamos obeservado state
  //con los datos del usuario(registrado) o en null
  return observerUser !== false ? (
    <Router>
      <div className="container">
        <Header observerUser={observerUser} setObserverUser={setObserverUser} />
      </div>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/admin" component={Admin} />
        <Route path="*" component={Error404} />
      </Switch>
      <Footer />
    </Router>
  ) : (
    <Loader />
  );
}

export default App;
