import { IconType } from "react-icons";

export type ActionLabel = {
  label: string;
  icon: IconType;
  color: string;
  method: (...params: any) => void;
};
