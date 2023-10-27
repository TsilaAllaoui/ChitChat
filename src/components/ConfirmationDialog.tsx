import { createPortal } from "react-dom";
import "../Styles/ConfirmationDialog.scss";

const ConfirmationDialog = ({
  show,
  hide,
  action,
}: {
  show: boolean;
  hide: () => void;
  action: () => void;
}) => {
  if (!show) return null;

  return (
    <>
      {createPortal(
        <>
          <div id="confirmation" onClick={hide}>
            <div id="container" onClick={(e) => e.stopPropagation()}>
              <h1>Delete message?</h1>
              <div id="separator"></div>
              <h2>
                This action is irreversible. Proceed carrefully before choosing.
              </h2>
              <div id="buttons">
                <button
                  onClick={() => {
                    action();
                    hide();
                  }}
                >
                  Yes
                </button>
                <button onClick={hide}>No</button>
              </div>
            </div>
          </div>
        </>,
        document.getElementById("portal") as HTMLElement
      )}
    </>
  );
};

export default ConfirmationDialog;
