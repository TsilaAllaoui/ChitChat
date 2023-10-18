import { useCollection } from "react-firebase-hooks/firestore";
import { IConversation } from "./MainPage";
import { collection, query } from "firebase/firestore";
import { db } from "../Firebase";

const Conversation = ({ conversation }: { conversation: IConversation }) => {
  return <></>;
};

export default Conversation;
