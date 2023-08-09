"use client";

import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import React, { useCallback } from "react";
import WordCloud from "react-d3-cloud";

type Word = {
  text: string;
  value: number;
};
type Props = {
  topics: Word[];
};

const data = [
  { text: "Hey", value: 1000 },
  { text: "lol", value: 200 },
  { text: "first impression", value: 800 },
  { text: "very cool", value: 1000000 },
  { text: "duck", value: 10 },
];

const CustomWordCloud = ({ topics }: Props) => {
  const { theme } = useTheme();
  const router = useRouter();

  const fontSize = useCallback(
    (word: Word) => Math.log2(word.value * 10) * 5,
    []
  );
  const handleWordClick = (e: MouseEvent, word: Word) => {
    router.push(`/quiz?topic=${word.text}`);
  };
  return (
    <WordCloud
      data={topics}
      height={550}
      font="Times"
      padding={10}
      fill={theme === "dark" ? "white" : "black"}
      fontSize={fontSize}
      rotate={0}
      random={Math.random}
      onWordClick={handleWordClick}
    />
  );
};

export default CustomWordCloud;
