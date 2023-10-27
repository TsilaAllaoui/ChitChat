import { createContext } from "react";

export type ProfileType = {
  showProfile: boolean;
  setShowProfile: (_b: boolean) => void;
};

export const ShowProfileContext = createContext<ProfileType>({
  showProfile: false,
  setShowProfile: (_b: boolean) => {},
});
