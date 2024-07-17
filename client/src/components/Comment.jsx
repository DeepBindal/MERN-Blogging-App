import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useNavigate, useNavigation } from "react-router-dom";
import { Avatar, Button, Image, Input, Textarea } from "@nextui-org/react";
import { z } from "zod";
import { addCommentToBlog } from "../api";
import toast from "react-hot-toast";

const CommentValidation = z.object({
  comment: z.string().min(3, { message: "Minimum 3 characters." }),
});

function Comment({ blogId, currentUserImg, currentUserId }) {
    const navigate = useNavigate();
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      comment: "",
    },
  });

  const onSubmit = async (values) => {
    const data = { blogId, userId: currentUserId, commentText: values.comment };
    console.log(data);
    const response = await addCommentToBlog(data)
    const res = await response.data;
    if(res.message === "COMMENTADDED"){
      window.location.reload();
      toast.success("Comment added!");
    }
    reset();
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="comment-form">
      <Input
        type="text"
        //   label="Comment"
        {...register("comment")}
        id="comment"
        placeholder="Leave a comment !"
        errorMessage={errors.comment?.message}
        isInvalid={!!errors.comment}
        className="w-full"
        //   labelPlacement="outside"
        startContent={<Avatar src={currentUserImg} />}
      />
      <Button type="submit" color="primary">
        Comment
      </Button>
    </form>
  );
}

export default Comment;
