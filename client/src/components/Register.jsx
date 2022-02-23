import "../styles/Auth.css";
import { Controller, useForm } from "react-hook-form"; //librairie afin de faciliter la mise en place de formulaire
import { yupResolver } from "@hookform/resolvers/yup"; //nécessaire afin d'utiliser "react-hook-form" et "yup" ensemble
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { AvatarGenerator } from "random-avatar-generator";
import template from "../utils/template";

const Register = () => {
  const [messageError, setMessageError] = useState("");
  const [loading, setLoading] = useState(false);

  let navigate = useNavigate(); // afin de gérer la redirection après le login

  const generator = new AvatarGenerator();

  // schema de validation pour register
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("You must enter a valid email address")
      .required("You must enter your email address"),
    name: Yup.string()
      .min(2, "This name is too short")
      .required("You must enter your email address"),
    password: Yup.string()
      .min(6, "This password is too short")
      .required("You must enter a password"),
  }).required();

  // import des composantss afin de vérifier nos formulaires
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema), //on indique à react-hook-form d'utiliser notre validationSchema afin de traiter les erreurs
  });

  const handleRegister = async (input) => {
    setLoading(true);
    const randomAvatar = generator.generateRandomAvatar(); //génère une url d'un avatar random

    const res = await axios.post(`${template}api/auth/register`, {
      email: input.email,
      name: input.name,
      password: input.password,
      avatar: randomAvatar,
    });

    const data = await res;

    if (data.data.message === "Existing user error") {
      setMessageError("This email is already used");
      setLoading(false);
    }

    if (!data.data.message) {
      navigate("/welcome-page");
      localStorage.setItem("username", data.data.username);
      setLoading(false);
    }
    console.log(data);
  };

  return (
    <main className="registerContainer">
      <div className="registerTitle">
        <h1 className="registerTitle-h1">Chat App</h1>
        <h2 className="registerTitle-h2">
          Chat with your friends in real time
        </h2>
      </div>
      <form className="formContainer" onSubmit={handleSubmit(handleRegister)}>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <div>
              <input
                type="email"
                placeholder="Email"
                value={value || ""}
                className="formContainer-input"
                onChange={onChange}
              />
              {/* si il y a une erreur dans le champs, on affiche le message correspondant à l'erreur */}
              {!!error && (
                <p className="formContainer-input-error">{error?.message}</p>
              )}
            </div>
          )}
        />
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <div>
              <input
                type="name"
                placeholder="Name"
                value={value || ""}
                className="formContainer-input"
                onChange={onChange}
              />
              {/* si il y a une erreur dans le champs, on affiche le message correspondant à l'erreur */}
              {!!error && (
                <p className="formContainer-input-error">{error?.message}</p>
              )}
            </div>
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <div>
              <input
                type="password"
                placeholder="Password"
                value={value || ""}
                className="formContainer-input"
                onChange={onChange}
              />
              {/* si il y a une erreur dans le champs, on affiche le message correspondant à l'erreur */}
              {!!error && (
                <p className="formContainer-input-error">{error?.message}</p>
              )}
            </div>
          )}
        />
        <button type="submit" className="formContainer-signBtn">
          Register
        </button>
        <Link to="/login">
          <button className="formContainer-changeMethodConnexionBtn">
            Sign In
          </button>
        </Link>
      </form>
      {loading && <p>Loading ...</p>}
      {messageError && <p>{messageError}</p>}
    </main>
  );
};

export default Register;
