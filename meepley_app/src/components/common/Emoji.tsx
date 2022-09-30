import React, { memo } from "react";
import { Image } from "native-base";
import twemoji from "twemoji";
import emojiShortName from "emoji-short-name";

type TwemojiTextProps = {
  size?: number;
  emo: string;
};

const Emoji: React.VFC<TwemojiTextProps> = ({ size, emo }) => {
  return (
    <Image
      alt={`Emoji ${emojiShortName[emo]}`}
      key={emojiShortName[emo]}
      style={{
        width: size ?? 18,
        height: size ?? 18,
      }}
      source={{
        uri: `https://twemoji.maxcdn.com/v/13.1.0/72x72/${twemoji.convert.toCodePoint(
          emo
        )}.png`,
      }}
    />
  );
};

export default memo(Emoji);
