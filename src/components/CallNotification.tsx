import { createPortal } from "react-dom";
import "../styles/CallNotification.scss";
import { IoMdCall } from "react-icons/io";
import { FcEndCall } from "react-icons/fc";

const CallNotification = ({
  caller,
  showCondition,
  action,
  onClose,
}: {
  caller: string;
  showCondition: boolean;
  action: () => void;
  onClose: () => void;
}) => {
  return showCondition
    ? createPortal(
        <div className="call-content">
          <div className="content">
            <span>Incoming call from </span>
            {caller}
          </div>
          <div className="buttons">
            <IoMdCall title="answer" onClick={action} />
            <FcEndCall title="end" onClick={onClose} />
          </div>
        </div>,
        document.querySelector("#portal") as HTMLElement
      )
    : null;
};

export default CallNotification;
