import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import ChatWindow from "./components/ChatWindow";
import Welcome from "./components/Welcome";
import Header from "./components/Header";
import UserList from "./components/UserList";
import NewConversationRoom from "./components/NewConversationRoom";
import ConversationRoom from "./components/ConversationRoom";

function App() {
  return (
    <BrowserRouter>
    <Header />
    <Routes>
      <Route path="/" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/welcome-page" element={<Welcome />} />
      <Route path="/user-list" element={<UserList />} />
      <Route path="/chat-window" element={<ChatWindow />} />
      <Route path="/new-conversation-room" element={<NewConversationRoom />} />
      <Route path="/conversation/:roomName" element={<ConversationRoom />} />
    </Routes>
    </BrowserRouter>

  );
}

export default App;
