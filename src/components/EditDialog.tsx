import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { ScaleLoader } from "react-spinners";
import "../styles/EditDialog.scss";

const EditDialog = ({
  label,
  condition,
  hide,
  action,
}: {
  label: string;
  condition: boolean;
  hide: () => void;
  action: (val: string) => void;
}) => {
  /****************  States *****************/

  const [pending, setPending] = useState(false);

  /****************  Effects *****************/

  useEffect(() => {
    setPending(false);
  }, [label]);

  /****************  Refs *****************/

  const inputRef = useRef<HTMLInputElement>(null);

  /****************  Functions *****************/

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = inputRef.current!.value;

    if (value == "") {
      inputRef.current!.style.outline = "solid 2px red";
      inputRef.current!.style.animation = "shake 250ms";
      inputRef.current!.placeholder = "Invalid " + label + "!";
      setTimeout(() => {
        inputRef.current!.style.outline = "solid 2px transparent";
        inputRef.current!.placeholder = "";
      }, 1000);
      return;
    }

    action(value);
    setPending(true);
  };

  return (
    <>
      {condition
        ? createPortal(
            <>
              <form id="dialog" onClick={hide} onSubmit={submit}>
                <div id="container" onClick={(e) => e.stopPropagation()}>
                  <AiOutlineCloseCircle id="close" onClick={hide} />
                  <h1>Edit {label}</h1>
                  <div id="separator"></div>
                  <h2>Enter new {label}:</h2>
                  <input
                    ref={inputRef}
                    name={label}
                    type="text"
                    // onChange={(e) => setInputValue(e.currentTarget.value)}
                  />
                  <button
                    type="submit"
                    style={{ backgroundColor: pending ? "green" : "white" }}
                  >
                    {pending ? (
                      <ScaleLoader
                        color="white"
                        loading={pending}
                        height={13}
                        width={2}
                        radius={15}
                        margin={2}
                      ></ScaleLoader>
                    ) : (
                      <p>Update</p>
                    )}
                  </button>
                </div>
              </form>
            </>,
            document.getElementById("portal") as HTMLElement
          )
        : null}
    </>
  );
};

export default EditDialog;
