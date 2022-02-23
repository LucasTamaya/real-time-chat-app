import "../styles/ConversationRoom.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";
import template from "../utils/template";

// connecte le client au serveur
const socket = io.connect(`${template}`);

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
    const res = await axios.get(
      `${template}api/messages/${roomName}`
    );
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

    console.log(socket)

    //   connecte le socket client à la conversation room crée
    socket.emit("joinRoom", roomName);

    socket.on("receiveMessage", (data) => {
      setMessageList((prev) => [...prev, data]);
    });
  }, [socket]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      //requete vers websockets et api
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
    }
  };

  return (
    <main className="mainConversationRoom-container">
      <h1 className="conversationRoom-title">{roomName} Conversation Room</h1>
      <div className="chatContainer">
        <div className="messageContainer">
          {loading && <p>Loading ...</p>}
          {messageError && <p>{messageError}</p>}
          {messageList && (
            <div>
              {messageList.map((x) => (
                <div>
                  <p>
                    {x.sender} - {x.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="inputContainer">
          <input
            type="text"
            placeholder="Chat"
            onChange={(e) => setCurrentMessage(e.target.value)}
            className="inputContainer-input"
          />
          <button
            type="submit"
            onClick={sendMessage}
            className="inputContainer-btn"
          >
            Send
          </button>
        </div>
      </div>
    </main>
  );
};

export default ConversationRoom;
