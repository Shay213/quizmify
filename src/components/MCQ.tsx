"use client";

import { Game, Question } from "@prisma/client";
import { BarChart, ChevronRight, Loader2, Timer } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button, buttonVariants } from "./ui/button";
import MCQCounter from "./MCQCounter";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { checkAnswerSchema } from "@/schemas/form/quiz";
import { useToast } from "./ui/use-toast";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  game: Game & { questions: Pick<Question, "id" | "options" | "question">[] };
};

type Payload = z.infer<typeof checkAnswerSchema>;

const MCQ = ({ game }: Props) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [isEnded, setIsEnded] = useState(false);
  const { toast } = useToast();

  const currentQuestion = useMemo(() => {
    return game.questions[questionIndex];
  }, [questionIndex, game.questions]);

  const options = useMemo(() => {
    if (!currentQuestion?.options) return [];
    return JSON.parse(currentQuestion.options as string) as string[];
  }, [currentQuestion]);

  const { mutate: checkAnswer, isLoading: isChecking } = useMutation({
    mutationFn: (payload: Payload) =>
      fetch("http://localhost:3000/api/checkAnswer", {
        method: "POST",
        body: JSON.stringify(payload),
      }).then((res) => res.json()),
  });

  const handleNext = useCallback(() => {
    if (isChecking) return;
    checkAnswer(
      { questionId: currentQuestion.id, userAnswer: options[selectedChoice] },
      {
        onSuccess: ({ isCorrect }) => {
          if (isCorrect) {
            toast({
              title: "Correct!",
              description: "Correct answer",
              variant: "success",
            });
            setCorrectAnswers((prev) => prev + 1);
          } else {
            toast({
              title: "Incorrect!",
              description: "Incorrect answer",
              variant: "destructive",
            });
            setWrongAnswers((prev) => prev + 1);
          }
          if (questionIndex === game.questions.length - 1) {
            setIsEnded(true);
          }
          setQuestionIndex((prev) => prev + 1);
        },
      }
    );
  }, [
    checkAnswer,
    currentQuestion.id,
    options,
    selectedChoice,
    toast,
    isChecking,
    game.questions.length,
    questionIndex,
  ]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      switch (e.key) {
        case "1":
          setSelectedChoice(0);
          break;
        case "2":
          setSelectedChoice(1);
          break;
        case "3":
          setSelectedChoice(2);
          break;
        case "4":
          setSelectedChoice(3);
          break;
        case "Enter":
          handleNext();
          break;
      }
    };
    document.addEventListener("keydown", handler);

    return () => {
      document.removeEventListener("keydown", handler);
    };
  }, [handleNext]);

  return (
    <>
      {isEnded ? (
        <div className="flex flex-col justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ">
          <div className="px-4 mt-2 font-semibold text-white bg-green-500 rounded-md whitespace-nowrap">
            You completed in {"3min 4s"}
          </div>
          <Link
            href={`/statistics/${game.id}`}
            className={cn(buttonVariants(), "mt-2")}
          >
            View Statistics <BarChart className="w-4 h-4 ml-2" />
          </Link>
        </div>
      ) : (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:w-[80vw] max-w-4xl w-[90vw]">
          <div className="flex justify-between">
            <div className="flex flex-col">
              <p>
                <span className="text-slate-400 mr-2">Topic</span>
                <span className="px-2 py-1 text-white rounded-lg bg-slate-800">
                  {game.topic}
                </span>
              </p>
              <div className="flex self-start mt-3 text-slate-400">
                <Timer className="mr-2" /> <span>00:00</span>
              </div>
            </div>
            <MCQCounter
              correctAnswers={correctAnswers}
              wrongAnswers={wrongAnswers}
            />
          </div>
          <Card className="w-full mt-4">
            <CardHeader className="flex items-center">
              <CardTitle className="mr-5 text-center divide-y divide-zinc-600/50">
                <div>{questionIndex + 1}</div>
                <div className="text-base text-slate-400">
                  {game.questions.length}
                </div>
              </CardTitle>
              <CardDescription className="flex-grow text-lg">
                {currentQuestion?.question}
              </CardDescription>
            </CardHeader>
          </Card>
          <div className="flex flex-col items-center justify-center w-full mt-4">
            {options.map((option, i) => (
              <Button
                key={`${option}${i}`}
                className="justify-start w-full py-8 mb-4"
                variant={selectedChoice === i ? "default" : "secondary"}
                onClick={() => setSelectedChoice(i)}
              >
                <div className="flex items-center justify-start">
                  <div className="p-2 px-3 mr-5 border rounded-md">{i + 1}</div>
                  <div className="text-start">{option}</div>
                </div>
              </Button>
            ))}
            <Button className="mt-2" onClick={handleNext} disabled={isChecking}>
              {isChecking && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Next <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default MCQ;
