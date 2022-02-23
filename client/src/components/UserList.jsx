import "../styles/UserList.css";
import { useState, useEffect } from "react";
import axios from "axios";
import template from "../utils/template";

const UserList = () => {
  const [userList, setUserList] = useState([]);
  const [messageError, setMessageError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetching = async () => {
    setLoading(true);
    // const res = await axios.get("http://localhost:3001/api/user-list");
    const res = await axios.get(`${template}api/user-list`);
    const data = await res;

    // si erreur, on remplit le msg d'erreur
    if (data.data.message === "Fetch error") {
      setMessageError("Internal server error during the fetch of the data");
      setLoading(false);
    }

    // si aucun erreur, on recupere la data dans une liste
    if (!data.data.message) {
      console.log(data.data);
      setUserList(data.data);
      console.log("UserList: ", userList);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetching();
  }, []);

  return (
    <main className="mainUserList-container">
      <h1 className="userList-title">List of users</h1>
      {loading && <p>loading...</p>}
      {messageError && <p>{messageError}</p>}
      {userList && (
        <div>
          {userList.map((x) => (
            <div key={x._id} className="userContainer">
              <img
                src={x.avatar}
                alt="random user avatar"
                className="userContainer-avatar"
              />
              <p className="userContainer-name">{x.name}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default UserList;
