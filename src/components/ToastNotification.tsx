import { createPortal } from "react-dom";
import "../styles/ToastNotification.scss";

const ToastNotification = ({
  content,
  showCondition,
}: {
  content: string;
  showCondition: boolean;
}) => {
  return showCondition
    ? createPortal(
        <div>{content}</div>,
        document.querySelector("#portal") as HTMLElement
      )
    : null;
};

export default ToastNotification;
