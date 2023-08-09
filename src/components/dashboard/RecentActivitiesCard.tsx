import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import QuizHistory from "../QuizHistory";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

type Props = {};

const RecentActivitiesCard = async (props: Props) => {
  const session = await getAuthSession();

  if (!session?.user) {
    return redirect("/");
  }

  const gamesCount = await prisma.game.count({
    where: { userId: session.user.id },
  });

  return (
    <Card className="col-span-4 lg:col-span-3">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Recent Activities</CardTitle>
        <CardDescription>
          You have played a total of {gamesCount} games.
        </CardDescription>
      </CardHeader>
      <CardContent className="max-h-[580px] overflow-auto">
        <QuizHistory limit={10} userId={session.user.id} />
      </CardContent>
    </Card>
  );
};

export default RecentActivitiesCard;
