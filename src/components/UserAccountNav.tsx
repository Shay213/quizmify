import React from "react";
import { Session } from "next-auth";

type Props = {
  user: Session["user"];
};

const UserAccountNav = ({ user }: Props) => {
  return <div>UserAccountNav</div>;
};

export default UserAccountNav;
