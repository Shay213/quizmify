import QuizCreation from "@/components/QuizCreation";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  searchParams: { [topic: string]: string | undefined };
};

export const metadata = {
  title: "Quiz | Quizmify",
};

const Quiz = async ({ searchParams: { topic } }: Props) => {
  const session = await getAuthSession();

  if (!session?.user) {
    return redirect("/");
  }
  return <QuizCreation topic={topic || ""} />;
};

export default Quiz;
