import { userCreationContext } from "./Context";
import { useContext, useState } from "react";
import { User } from "./Models";
import "../styles/Popup.scss";

function Popup({
  setPopupState,
  users,
}: {
  setPopupState: (b: boolean) => void,
  users: User[];
}) {
  const [keyword, setKeyword] = useState("");
  const [userList, setUserList] = useState<User[]>(users)

  const filter = (word: string ,keyword: string) => {
    
  };

  const userToCreate = useContext(userCreationContext)


  const createConversations = (user: User) => {
      userToCreate.userToBeCreated = {
          name: user.name,
          id: user.uid
      };
    setPopupState(false);
  };


  return (
    <div id="modal">
        <button onClick={() => setPopupState(false)}>Close</button>
        <label>Name</label>
        <input type="text" id="search-input" onChange={(e) => setKeyword(e.target.value)}/>
        <button>Search</button>
        <div id="user-list">
        {userList &&
            userList.map((user) => {
                return <div onClick={() => createConversations(user)}>
                    {
                       (keyword === "") ? <p>{user.name}</p> : (user.name.includes(keyword) ? <p>{user.name}</p> : null)
                    }
                </div>

            })}
        </div>
        <button type="submit"></button>
    </div>
  );
}
export default Popup;
