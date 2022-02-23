import * as Yup from "yup";


// schema de validation pour la création d'une nouvelle conversation room
const newConversationRoomSchema = Yup.object({
  room: Yup.string()
    .min(3, "This is too short")
    .required("You must enter a room name"),
}).required();

export default newConversationRoomSchema;