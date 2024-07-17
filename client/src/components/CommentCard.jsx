import { Image } from "@nextui-org/react";
import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Button,
} from "@nextui-org/react";
import { Link } from "react-router-dom";

function formatDateString(dateString) {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString(undefined, options);

  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${time} - ${formattedDate}`;
}

function CommentCard({
  id,
  currUserId,
  parentId,
  content,
  author,
  createdAt,
  comments,
}) {
  return (
    <Card className="max-w-full">
      <CardHeader className="justify-between">
        <div className="flex gap-5">
          <Avatar
            isBordered
            radius="full"
            size="md"
            as={Link}
            to={`/profile/${author._id}`}
            src={author.image}
          />
          <div className="flex flex-col gap-1 items-start justify-center">
            <h4 className="text-small font-semibold leading-none text-default-600">
              {author.firstName} {author.lastName}
            </h4>
            <h5 className="text-small tracking-tight text-default-400">
              @{author.username}
            </h5>
          </div>
        </div>
      </CardHeader>
      <CardBody className="px-3 py-0 text-small text-default-400">
        <p>{content}</p>
      </CardBody>
      <CardFooter className="gap-3">
        <div className="flex gap-1">
          <p className="font-semibold text-default-400 text-small">
            {formatDateString(createdAt)}
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}

export default CommentCard;
