import React from "react";
import { useState, useCallback } from "react";
import GoogleIcon from "../components/Google/GoogleIcon";
import { getDb } from "../services/firebase-config";
import { addDoc, collection } from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import { withRouter } from "react-router";
import "./Login.css";

const Login = ({ history }) => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [createaccount, setCreateaccount] = useState(true);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleCreateaccount = (e) => {
    setCreateaccount(!createaccount);
    reset();
    setErrors({});
  };

  //envio de formulario y validacion
  const handleSubmit = (e) => {
    e.preventDefault();

    let errorss = {};

    if (!form.email.trim()) {
      errorss.email = "Input Email esta vacio";
    }
    if (!form.password.trim()) {
      errorss.password = "Input password esta vacio";
    } else if (form.password.trim().length < 6) {
      errorss.password = "Debe ingresar una contraseña de 6 caracteres";
    }

    setErrors(errorss);
    //llamo a funcion para el crear una cuenta de usuario
    if (createaccount) {
      create();
    }
    //llamo a funcion para login de usuario
    if (createaccount === false) {
      login();
    }
  };

  //creo una cuenta de usuario
  const create = useCallback(async () => {
    try {
      const auth = getAuth();
      //utilizo funciones de auth para crear cuenta de usuario con email y contraseña
      const createUser = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      //Relaciono auth con firestore creo una coleccecion "users" y le paso el id del usuario + email y uid
      let tarea = collection(getDb, createUser.user.uid);
      await addDoc(tarea, {
        name: "tarea de ejemplo",
        date: Date.now(),
      });
      //mail de verificaion de usuario
      // await sendEmailVerification(auth.currentUser);
      reset();
      setErrors({});
      history.push("/admin");
    } catch (error) {
      //manejando errorres de auth
      const errorCode = "auth/invalid-email";
      const errorEmailInUse = "auth/email-already-in-use";

      if (error.code === errorCode) {
        setErrors({ email: "Email invalido." });
      } else if (error.code === errorEmailInUse) {
        setErrors({ email: "Ya existe el Email." });
      }
    }
  }, [form.email, form.password, history]);

  //Signing con Google
  const signinGoogle = (e) => {
    const auth = getAuth();
    auth.languageCode = "es";
    console.log("Signing google...");
    const provider = new GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/contacts.readonly");

    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log(token, user);
        history.push("/admin");
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
        console.log(errorCode, errorMessage, email, credential);
      });
  };

  //Funcion login
  const login = useCallback(async () => {
    try {
      const auth = getAuth();
      //Validacion de login, si es correcta ejecuto lo que hay en el catch
      const res = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      console.log(res);

      reset();
      setErrors({});
      history.push("/admin");
    } catch (error) {
      // console.log(error);
      const errorUserNotFound = "auth/user-not-found";
      const errorUserPassword = "auth/wrong-password";
      const errorUserManyRequests = "auth/too-many-requests";

      if (error.code === errorUserNotFound) {
        setErrors({ email: "Email no es valido" });
      }
      if (error.code === errorUserPassword) {
        setErrors({ password: "Error de contraseña" });
      }
      if (error.code === errorUserManyRequests) {
        setErrors({
          password: "Ah realizado demasiados intentos, intente más tarde",
        });
      }
    }
  }, [form.email, form.password, history]);

  const reset = (e) => {
    setForm({
      email: "",
      password: "",
    });
  };

  return (
    <section className="login">
      <h2 className="login-title">
        {createaccount ? "Create account" : "Login "}
      </h2>
      <div className="login-content">
        <form onSubmit={handleSubmit} className="login-content-form">
          <label htmlFor="email">
            Email
            <input
              type="email"
              name="email"
              placeholder="Ingrese email"
              value={form.email}
              onChange={handleChange}
              className="login-input"
              autoComplete="off"
              required
            />
          </label>
          {errors.email && (
            <p style={{ color: "#f44336", marginBottom: "1rem" }}>
              {errors.email}
            </p>
          )}
          <label htmlFor="password">
            Password
            <input
              type="password"
              name="password"
              placeholder="Ingrese su contraseña"
              value={form.password}
              onChange={handleChange}
              className="login-input"
              autoComplete="off"
              required
            />
          </label>
          {errors.password && (
            <p
              style={{
                color: "#f44336",
                fontSize: "12px",
                marginBottom: "1rem",
              }}
            >
              {errors.password}
            </p>
          )}
          <button type="submit">
            {createaccount ? "CreateAcoount" : "Login"}
          </button>
          <button
            type="button"
            onClick={(e) => {
              signinGoogle(e);
            }}
          >
            <GoogleIcon width="24px" heigth="24px" />
            Signin Google
          </button>
          <button
            type="button"
            className="button-login"
            onClick={(e) => {
              handleCreateaccount(e);
            }}
          >
            {createaccount ? "Have on account?" : "create account?"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default withRouter(Login);
