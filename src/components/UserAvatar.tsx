import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";

type Props = {
  name: string;
  image?: string | null;
};

const UserAvatar = ({ image, name }: Props) => {
  return (
    <Avatar>
      {image ? (
        <div className="relative w-full h-full aspect-square">
          <Image fill src={image} alt={name} referrerPolicy="no-referrer" />
        </div>
      ) : (
        <AvatarFallback>
          <span className="sr-only">{name}</span>
        </AvatarFallback>
      )}
    </Avatar>
  );
};

export default UserAvatar;
