import EmojiPicker from "emoji-picker-react";
import "../Styles/EmojisPicker.scss";
import { IoCloseCircleOutline } from "react-icons/io5";

const EmojisPicker = ({
  hide,
  updateMessage,
}: {
  hide: () => void;
  updateMessage: (val: string) => void;
}) => {
  return (
    <div id="emojis-container" onClick={hide}>
      <div onClick={(e) => e.stopPropagation()}>
        <EmojiPicker onEmojiClick={(emoji) => updateMessage(emoji.emoji)} />
      </div>
    </div>
  );
};

export default EmojisPicker;
