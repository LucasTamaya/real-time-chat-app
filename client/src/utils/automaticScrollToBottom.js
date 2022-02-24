// fonction qui enclenche un scroll automatique vers le bas lors de l'envoit et de la réception de messages.
const automaticScrollToBottom = () => {
  const messagesContainer = document.querySelector(".messagesContainer");
  messagesContainer.scrollTo(0, messagesContainer.scrollHeight);
};

module.exports = automaticScrollToBottom;