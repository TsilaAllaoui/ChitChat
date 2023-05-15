import { ActionLabel } from "./Model/ActionModel";
import "../styles/Action.scss";

function Action({actions}: {actions: ActionLabel[]}) {

  let height = actions.length * 20; 
  console.log("Height: ", height);

  return (
    <div 
    className="dropdown" 
    style={{height: height.toString() + "px", transition:"opacity 750ms"}}
    onMouseLeave={(e) => {
      e.currentTarget.style.opacity = "0"
    }}
    >
      {
        actions.map((action) => {
          return (
            <button>
              <action.icon />
              {action.label}
            </button>
          )
        })
      }
    </div>
  );
}

export default Action;
