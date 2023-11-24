import { createPortal } from "react-dom";
import "../styles/ConfirmationDialog.scss";

const ConfirmationDialog = ({
  content,
  header,
  show,
  hide,
  action,
}: {
  content: string;
  header: string;
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
              <h1>{header}</h1>
              <div id="separator"></div>
              <h2>{content}</h2>
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
