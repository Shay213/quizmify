import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { History } from "lucide-react";
import Link from "next/link";

type Props = {};

const HistoryCard = (props: Props) => {
  return (
    <Link href="/history">
      <Card className="hover:cursor-pointer hover:opacity-75">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-2xl font-bold">History</CardTitle>
          <History size={28} strokeWidth={2.5} />
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            View past quiz attempts
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default HistoryCard;
