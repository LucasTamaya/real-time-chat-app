import "../styles/Welcome.css";

const Welcome = () => {
  return (
      <main className="mainContainer">
        <h1>Welcome to the Chat App {localStorage.getItem("username")}</h1>
      </main>
  );
};

export default Welcome;
