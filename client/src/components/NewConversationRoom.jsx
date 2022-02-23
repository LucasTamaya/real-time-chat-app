import "../styles/newConversationRoom.css";
import { Controller, useForm } from "react-hook-form"; //librairie afin de faciliter la mise en place de formulaire
import { yupResolver } from "@hookform/resolvers/yup"; //nécessaire afin d'utiliser "react-hook-form" et "yup" ensemble
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NewConversationRoomSchema from "../utils/validationSchema/newConversationRoomSchema";
import { useState } from "react";
import template from "../utils/template";

const NewConversationRoom = () => {
  const [messageError, setMessageError] = useState("");
  const [loading, setLoading] = useState(false);

  let navigate = useNavigate(); //gere les redirections

  // import des composantss afin de vérifier nos formulaires
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(NewConversationRoomSchema), //on indique à react-hook-form d'utiliser notre validationSchema afin de traiter les erreurs
  });

  const createNewConversationRoom = async (input) => {
    setLoading(true);

    const res = await axios.post(`${template}api/conversation`, {
      room: input.room,
    });

    const data = await res;

    console.log(data);

    // si erreur
    if (data.data.message === "Existing conversation error") {
      setMessageError("This conversation room already exists");
      setLoading(false);
    }

    // si aucune erreur, on redirige l'utilisateur vers la page de conversation qu'il a crée
    if (!data.data.message) {
      setLoading(false);
      navigate(`/conversation/${data.data}`);
    }
  };

  return (
    <main className="mainNewConversationRoom-container">
      <h1 className="newConversationRoom-title">
        Create a new conversation room
      </h1>
      <form
        className="newConversationRoom-form"
        onSubmit={handleSubmit(createNewConversationRoom)}
      >
        <Controller
          control={control}
          name="room"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <div>
              <input
                type="text"
                placeholder="Room name..."
                value={value || ""}
                className="newConversationRoom-input"
                onChange={onChange}
              />
              {/* si il y a une erreur dans le champs, on affiche le message correspondant à l'erreur */}
              {!!error && (
                <p className="newConversationRoom-input-error">
                  {error?.message}
                </p>
              )}
            </div>
          )}
        />
        <button type="submit" className="newConversationRoom-btn">
          Create
        </button>
      </form>
      {loading && <p>Loading ...</p>}
      {messageError && <p>{messageError}</p>}
    </main>
  );
};

export default NewConversationRoom;
