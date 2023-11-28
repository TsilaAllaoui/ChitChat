import { createPortal } from "react-dom";
import "../styles/CallNotification.scss";
import { IoMdCall } from "react-icons/io";
import { FcEndCall } from "react-icons/fc";
import { RiLoader5Line } from "react-icons/ri";

const CallNotification = ({
  caller,
  showCondition,
  action,
  onClose,
  pendingAnswer,
  pendingEnd,
}: {
  caller: string;
  showCondition: boolean;
  action: () => void;
  onClose: () => void;
  pendingAnswer: boolean;
  pendingEnd: boolean;
}) => {
  return showCondition
    ? createPortal(
        <div className="call-content">
          <div className="content">
            <span>Incoming call from</span>
            <span>{caller}</span>
          </div>
          <div className="buttons">
            {pendingAnswer ? (
              <RiLoader5Line className="spinner" />
            ) : (
              <IoMdCall title="answer" onClick={action} />
            )}
            {pendingEnd ? (
              <RiLoader5Line className="spinner" />
            ) : (
              <IoMdCall title="end" onClick={onClose} />
            )}
          </div>
        </div>,
        document.querySelector("#portal") as HTMLElement
      )
    : null;
};

export default CallNotification;
