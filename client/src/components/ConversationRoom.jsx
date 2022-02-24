import "../styles/ConversationRoom.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";
import template from "../utils/template";
import SendIcon from "@mui/icons-material/Send";
import LoadingData from "./LoadingData";
import ReactEmoji from "react-emoji";
import automaticScrollToBottom from "../utils/automaticScrollToBottom";

// connecte le client au serveur
// const socket = io("https://react-real-time-chat-backend.herokuapp.com/");
const socket = io("http://localhost:3001");

const ConversationRoom = () => {
  // represente le message qu'on est entrain de taper
  const [currentMessage, setCurrentMessage] = useState("");

  const [messageList, setMessageList] = useState([]);
  const [messageError, setMessageError] = useState("");
  const [loading, setLoading] = useState(true);

  // recuperation du nom de la conversation dans l'url
  const { roomName } = useParams();

  // recuperation des messages precedents
  const fetching = async () => {
    const res = await axios.get(`${template}api/messages/${roomName}`);
    const data = await res;

    if (data.data.message === "Fetch error") {
      setMessageError("Internal server error during the fetch of the data");
      setLoading(false);
    }

    if (!data.data.message) {
      setMessageList(data.data);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetching();

    console.log("status du socket", socket);

    //   connecte le socket client à la conversation room sélectionnée
    socket.emit("joinRoom", roomName);

    // détecte la réception de messages des autres utilisateurs
    socket.on("receiveMessage", (data) => {
      setMessageList((prev) => [...prev, data]);
      // scroll automatique vers le bas pour voir les derniers messages
      automaticScrollToBottom();
    });

    // détecte si il y a une erreur au niveau des websockets
    socket.on("connect_error", () => {
      alert("connexion error with socket");
    });

    // clean up function qui déconnecte le socket une fois le composant démonté
    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, [socket]);

  // fonction lorsqu'on envoit un message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (currentMessage !== "") {
  
      const messageData = {
        conversationRoomName: roomName,
        sender: sessionStorage.getItem("username"),
        message: currentMessage,
        date:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      //   envoit de la data au socket coté backend
      await socket.emit("sendMessage", messageData);
      setMessageList((prev) => [...prev, messageData]);

      // réinitialise l'input
      setCurrentMessage("");

      // scroll automatique vers le bas pour voir les derniers messages envoyés
      automaticScrollToBottom();
    }
  };

  return (
    <main className="conversationRoom-container">
      <h1 className="conversationRoom-title">{roomName} Conversation</h1>
      {loading && <LoadingData />}

      {messageError && (
        <p className="conversationRoom-messageError">{messageError}</p>
      )}

      {messageList && (
        <div className="messagesContainer">
          {messageList.map((x) => (
            <div key={x._id}>
              <div
                className={`${
                  x.sender === sessionStorage.getItem("username")
                    ? "senderMessage-container"
                    : "guestMessage-container"
                }`}
              >
                <div>
                  <p className="message-sender">{x.sender}</p>
                  <p className="message-paragraph">
                    {ReactEmoji.emojify(x.message)}
                  </p>
                </div>
              </div>
              <p
                className={`${
                  x.sender === sessionStorage.getItem("username")
                    ? "senderMessage-time"
                    : "guestMessage-time"
                }`}
              >
                {x.date}
              </p>
            </div>
          ))}
        </div>
      )}

      <form className="conversationRoom-inputContainer" onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Chat"
          value={currentMessage}
          className="conversationRoom-inputContainer-input"
          onChange={(e) => setCurrentMessage(e.target.value)}
        />
        <button
          type="submit"
          className="conversationRoom-inputContainer-btn"
          // onClick={sendMessage}
        >
          <SendIcon sx={{ color: "var(--main-blue)" }} />
        </button>
      </form>
    </main>
  );
};

export default ConversationRoom;
