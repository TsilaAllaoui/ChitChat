import EmojiPicker from "emoji-picker-react";
import "../styles/EmojisPicker.scss";

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
