import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AiOutlineCheckCircle } from "react-icons/ai";
import "../styles/Popup.scss";

function Popup({
  content,
  hidePopup,
}: {
  content: string;
  hidePopup: () => void;
}) {
  //  ************** State **************
  const popupRef = useRef<HTMLDivElement>(null);

  // *************** Effects ****************

  useEffect(() => {
    setTimeout(
      () => (popupRef.current!.style.animation = "fade-out 500ms"),
      1500
    );
    setTimeout(() => hidePopup(), 2000);
  }, []);

  //  ************** Rendering **************

  return (
    <>
      {createPortal(
        <div id="popup" ref={popupRef}>
          <AiOutlineCheckCircle />
          <p>{content}</p>
        </div>,
        document.getElementById("portal") as HTMLElement
      )}
    </>
  );
}

export default Popup;
