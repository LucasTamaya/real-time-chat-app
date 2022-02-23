import "../styles/Header.css";
import PeopleIcon from "@mui/icons-material/People";
import ChatIcon from "@mui/icons-material/Chat";
import AddBoxIcon from '@mui/icons-material/AddBox';
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="headerBg">
      <div className="headerContainer">
        <h1 className="headerContainer-h1">Chat App</h1>
        <nav className="headerContainer-nav">
          <Link to="/user-list">
            <PeopleIcon
              className="headerContainer-icon"
              sx={{ fontSize: 20 }}
            />
          </Link>
          <Link to="/chat-window">
            <ChatIcon className="headerContainer-icon" sx={{ fontSize: 20 }} />
          </Link>
          <Link to="/new-conversation-room">
            <AddBoxIcon className="headerContainer-icon" sx={{ fontSize: 20 }} />
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
