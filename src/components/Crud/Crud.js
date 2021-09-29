import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import Loader from "../Loader/Loader";
import { getDb } from "../../services/firebase-config";
import moment from "moment";
import "moment/locale/es";
import "./Crud.css";

function Crud({ user }) {
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modeEdit, setModeEdit] = useState(false);
  const [id, setId] = useState("");
  const initialForm = {
    tarea: "",
  };

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const getData = async () => {
      try {
        let tareasCol = collection(getDb, user);
        let tareaSnapshot = await getDocs(tareasCol);

        let tareaList = tareaSnapshot.docs.map((el) => ({
          id: el.id,
          ...el.data(),
        }));

        setTareas(tareaList);
        setLoading(false);
      } catch (error) {}
    };
    getData();
  }, [user]);

  const validateForm = (form) => {
    let errors = {};
    let regexName = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü0-9\s]+$/;
    if (!form.tarea.trim()) {
      errors.tarea = "Debe ingresar un a tarea";
      console.log("Errore 1");
    } else if (!regexName.test(form.tarea.trim())) {
      errors.tarea = "Debe ingresar una tarea correcta";
      console.log("Errore 2");
    }
    return errors;
  };

  const handleKeyUp = (e) => {
    handleChange(e);
    setErrors(validateForm(form));
  };

  const handleChange = ({ target }) => {
    setForm({
      ...form,
      [target.name]: target.value,
    });
  };

  const deleteData = async (id) => {
    try {
      setLoading(true);
      const tareasCol = collection(getDb, user);
      await deleteDoc(doc(tareasCol, id));
      const arrayFilter = tareas.filter((tarea) => tarea.id !== id);
      setTareas(arrayFilter);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const editData = (e, tarea) => {
    e.preventDefault();
    setModeEdit(true);
    setForm({
      tarea: tarea.name,
    });
    setId(tarea.id);
  };

  const updateData = async (e) => {
    e.preventDefault();
    setErrors(validateForm(form));

    try {
      const editData = {
        name: form.tarea,
      };

      const tareasCol = collection(getDb, user);
      await setDoc(doc(tareasCol, id), editData);

      const arrayUpdate = tareas.map((tarea) =>
        tarea.id === id
          ? { id: tarea.id, date: tarea.date, name: form.tarea }
          : tarea
      );

      setTareas(arrayUpdate);

      setModeEdit(false);
      setId("");
      // console.log(tareas);
    } catch (errors) {
      console.log(errors);
    }
    setForm(initialForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      let tareasCol = collection(getDb, user);

      const nuevaTarea = {
        name: form.tarea,
        date: Date.now(),
      };

      const docRef = await addDoc(tareasCol, nuevaTarea);
      // console.log(docRef);

      setTareas([...tareas, { ...nuevaTarea, id: docRef.id }]);
    } catch (error) {
      console.log(error);
    }

    setForm(initialForm);
    setLoading(false);
  };
  return (
    <>
      <p className="todo-description">
        {" "}
        Administra tu lista de tareas diarias y matene tu día organizado.{" "}
      </p>
      <form
        onSubmit={modeEdit ? updateData : handleSubmit}
        className="todo-form"
      >
        <input
          className="todo-input-form"
          type="text"
          name="tarea"
          id="tarea"
          value={form.tarea}
          onChange={handleChange}
          onKeyUp={handleKeyUp}
          placeholder="Ingrese tarea..."
          required
        />
        {errors && (
          <p
            style={{ color: "#f44336", marginBottom: "1rem" }}
          >
            {errors.tarea}
          </p>
        )}
        <button
          className={
            modeEdit ? " btn-general btn-edit" : "btn-general btn-dark "
          }
          type="submit"
        >
          {modeEdit ? "Editar tarea" : "Agregar tarea"}
        </button>
      </form>
      <article>
        <h3 className="todo-title">
          {modeEdit ? " 🖊 Editando tarea " : " 📝 Mis tareas"}
        </h3>
        <ul className="todo-group">
          {loading && <Loader />}

          {!loading && tareas.length === 0 && <h1>No hay tareas</h1>}

          {tareas.map((tarea) => (
            <li className="todo-group-item" key={tarea.id}>
              <span style={{ color: "gray", fontSize: "12px" }}>
                {moment(tarea.date).format("lll")}
              </span>
              <h3 className="todo-title-item">{tarea.name}</h3>
              <button
                className="btn-general btn-edit"
                onClick={(e) => {
                  // updateData(tarea);
                  editData(e, tarea);
                }}
              >
                Editar
              </button>
              <button
                className="btn-general btn-del"
                onClick={(e) => {
                  deleteData(tarea.id);
                }}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </article>
    </>
  );
}

export default Crud;
