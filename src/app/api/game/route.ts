import { getAuthSession } from "@/lib/nextauth";
import { NextResponse } from "next/server";
import { quizCreationSchema } from "@/schemas/form/quiz";
import { ZodError } from "zod";
import { prisma } from "@/lib/db";

export async function POST(req: Request, res: Response) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { amount, topic, type } = quizCreationSchema.parse(body);

    const game = await prisma.game.create({
      data: {
        gameType: type,
        timeStarted: new Date(),
        userId: session.user.id,
        topic,
      },
    });
    const response = await fetch(`${process.env.API_URL}/api/questions`, {
      method: "POST",
      body: JSON.stringify({ amount, topic, type }),
    });
    const gptData = await response.json();

    if (type === "mcq") {
      type mcqQuestion = {
        question: string;
        answer: string;
        option1: string;
        option2: string;
        option3: string;
      };
      const questions = gptData.map(
        ({ question, answer, option1, option2, option3 }: mcqQuestion) => {
          const options = [answer, option1, option2, option3].sort(
            () => Math.random() - 0.5
          );
          return {
            question,
            answer,
            options: JSON.stringify(options),
            gameId: game.id,
            questionType: type,
          };
        }
      );
      await prisma.question.createMany({
        data: questions,
      });
    } else if (type === "open_ended") {
      type openQuestion = {
        question: string;
        answer: string;
      };
      const questions = gptData.map(({ answer, question }: openQuestion) => {
        return {
          question,
          answer,
          gameId: game.id,
          questionType: type,
        };
      });
      await prisma.question.createMany({
        data: questions,
      });
    }
    return NextResponse.json({ gameId: game.id }, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 }
    );
  }
}
