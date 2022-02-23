import { useEffect, useState } from "react";
import "../styles/ChatWindow.css";
import axios from "axios";
import { Link } from "react-router-dom";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import template from "../utils/template";
import LoadingData from "./LoadingData";

const Chat = () => {
  const [conversationList, setConversationList] = useState([]);
  const [messageError, setMessageError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetching = async () => {
    setLoading(true);
    const res = await axios.get(`${template}api/conversation`);
    // const res = await axios.get("http://localhost:3001/api/conversation");

    const data = await res;

    if (data.data.message === "Fetch error") {
      setMessageError("Internal server error during the fetch of the data");
      setLoading(false);
    }

    if (!data.data.message) {
      setConversationList(data.data);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetching();
  }, []);

  return (
    <div className="mainConversationContainer">
      {loading && <LoadingData />}

      {messageError && <p className="chatWindowMessageError">{messageError}</p>}

      {conversationList && (
        <div>
          <h1 className="chat-title">All conversations</h1>
          <div className="conversationContainer">
            {conversationList.map((x) => (
              <Link
                key={x._id}
                to={`/conversation/${x.roomName}`}
                className="conversationContainer-item"
              >
                <h2 className="conversationContainer-h2">{x.roomName}</h2>
                <ArrowForwardIosIcon
                  className="conversationContainer-icon"
                  sx={{ transition: "0.2s ease", fontSize: 18 }}
                />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
