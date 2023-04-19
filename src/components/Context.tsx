import { createContext } from "react";

export const popupContext = createContext({show: false});
export const userCreationContext = createContext({userToBeCreated: {name: "", id: ""}});