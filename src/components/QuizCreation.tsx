"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { quizCreationSchema } from "@/schemas/form/quiz";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BookOpen, CopyCheck } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import LoadingQuestions from "./LoadingQuestions";

type Props = {};
type FormData = z.infer<typeof quizCreationSchema>;

const QuizCreation = (props: Props) => {
  const router = useRouter();
  const {
    mutate: getQuestions,
    isLoading,
    isSuccess,
    isError,
  } = useMutation({
    mutationFn: (data: FormData) =>
      fetch("http://localhost:3000/api/game", {
        method: "POST",
        body: JSON.stringify(data),
      }).then((res) => res.json()),
  });

  const form = useForm<FormData>({
    resolver: zodResolver(quizCreationSchema),
    defaultValues: {
      amount: 3,
      topic: "",
      type: "open_ended",
    },
  });

  form.watch();

  const onSubmit = (data: FormData) => {
    getQuestions(data, {
      onSuccess: ({ gameId }) => {
        router.push(`/play/${data.type}/${gameId}`);
      },
    });
  };

  if (isLoading) {
    return <LoadingQuestions finished={isSuccess || isError} />;
  }

  return (
    <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Quiz Creation</CardTitle>
          <CardDescription>Choose a topic</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic</FormLabel>
                    <FormControl>
                      <Input placeholder="Web dev" {...field} />
                    </FormControl>
                    <FormDescription>
                      Please provide any topic you would like to be quizzed on
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Questions</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="3"
                        {...field}
                        type="number"
                        onChange={(e) =>
                          form.setValue("amount", parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between">
                <Button
                  type="button"
                  className="flex-1 rounded-none rounded-l-lg"
                  variant={
                    form.getValues("type") === "mcq" ? "default" : "secondary"
                  }
                  onClick={() => {
                    form.setValue("type", "mcq");
                  }}
                >
                  <CopyCheck className="w-4 h-4 mr-2" /> Multiple Choice
                </Button>
                <Separator orientation="vertical" />
                <Button
                  type="button"
                  onClick={() => {
                    form.setValue("type", "open_ended");
                  }}
                  className="flex-1 rounded-none rounded-r-lg"
                  variant={
                    form.getValues("type") === "open_ended"
                      ? "default"
                      : "secondary"
                  }
                >
                  <BookOpen className="w-4 h-4 mr-2" /> Open Ended
                </Button>
              </div>
              <Button type="submit" disabled={isLoading}>
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizCreation;
