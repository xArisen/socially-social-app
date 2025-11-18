"use client";

import { usePostCard } from "./post-card.hook";
import { PostCardProps } from "./post-card.types";

export function PostCard(props: PostCardProps) {
  const { post } = props;
  const {} = usePostCard();

  return <div>Post</div>;
}
