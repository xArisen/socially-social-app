import type { GetPostsResponse } from "@/actions/post.action";

export interface PostCardProps {
  post: GetPostsResponse[number];
}
