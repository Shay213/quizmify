"use client";

import { useTheme } from "next-themes";
import React, { useCallback } from "react";
import WordCloud from "react-d3-cloud";

type Props = {};
type Word = {
  text: string;
  value: number;
};

const CustomWordCloud = (props: Props) => {
  const { theme } = useTheme();
  const data = [
    { text: "Hey", value: 1000 },
    { text: "lol", value: 200 },
    { text: "first impression", value: 800 },
    { text: "very cool", value: 1000000 },
    { text: "duck", value: 10 },
  ];

  const fontSize = useCallback((word: Word) => Math.log2(word.value) * 5, []);
  const onWordClick = useCallback((word: Word) => {
    console.log(`onWordClick: ${word}`);
  }, []);
  const onWordMouseOver = useCallback((word: Word) => {
    console.log(`onWordMouseOver: ${word}`);
  }, []);
  const onWordMouseOut = useCallback((word: Word) => {
    console.log(`onWordMouseOut: ${word}`);
  }, []);

  return (
    <WordCloud
      data={data}
      height={550}
      font="Times"
      padding={10}
      fill={theme === "dark" ? "white" : "black"}
      fontSize={fontSize}
      spiral="rectangular"
      rotate={0}
      random={Math.random}
      onWordClick={onWordClick}
      onWordMouseOver={onWordMouseOver}
      onWordMouseOut={onWordMouseOut}
    />
  );
};

export default CustomWordCloud;
