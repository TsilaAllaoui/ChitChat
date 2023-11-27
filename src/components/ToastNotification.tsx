import { createPortal } from "react-dom";
import "../styles/ToastNotification.scss";

const ToastNotification = ({
  content,
  showCondition,
  color,
}: {
  content: string;
  showCondition: boolean;
  color: string;
}) => {
  return showCondition
    ? createPortal(
        <div className="toast-content" style={{ backgroundColor: color }}>
          {content}
        </div>,
        document.querySelector("#portal") as HTMLElement
      )
    : null;
};

export default ToastNotification;
