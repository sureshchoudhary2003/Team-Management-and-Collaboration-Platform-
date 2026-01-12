// EmojiPickerComponent.tsx
import React from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { customEmojis } from "./custom-emojis";

const EmojiPicker = ({ onSelectEmoji }) => {
  const handleEmojiSelect = (emoji) => {
    if (!emoji) return;
    onSelectEmoji?.(emoji.native);
  };

  return (
    <div className="relative w-full max-w-8">
      <Picker
        data={data}
        custom={customEmojis}
        onEmojiSelect={handleEmojiSelect}
        emojiSize={20}
        showPreview={false}
        showSkinTones={false}
        theme="light"
        navPosition="top"
        maxFrequentRows={0}
        emojiButtonColors={["rgba(102, 51, 153, .2)"]}
        className="h-[40px]"
      />
    </div>
  );
};

export default EmojiPicker;
