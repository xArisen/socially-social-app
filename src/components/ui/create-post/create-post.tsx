"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar/avatar";
import { Button } from "@/components/ui/button/button";
import { TextareaField } from "@/components/ui/input-fields/text-area-field/text-area-field";
import { TextareaVariant } from "@/components/ui/input-fields/parts/text-area/text-area";
import { ImageIcon, SendIcon } from "lucide-react";
import { Card, CardContent } from "../card/card";
import { useCreatePost } from "./create-post.hook";
import type { CreatePostProps } from "./create-post.types";

export function CreatePost(props: CreatePostProps) {
  const { user } = props;
  const { form, content, imageUrl, isPosting, setShowImageUpload, onSubmit } =
    useCreatePost();

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="flex space-x-4">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user.image || "/avatar.png"} />
            </Avatar>
            <TextareaField
              form={form}
              name="content"
              ariaLabel="What's on your mind?"
              variant={TextareaVariant.Fixed}
              placeholder="What's on your mind?"
              disabled={isPosting}
            />
          </div>

          {/* {(showImageUpload || imageUrl) && (
            <div className="border rounded-lg p-4">
              <ImageUpload
                endpoint="postImage"
                value={imageUrl}
                onChange={(url) => {
                  setImageUrl(url);
                  if (!url) setShowImageUpload(false);
                }}
              />
            </div>
          )} */}

          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-primary"
                onClick={() => setShowImageUpload((prev) => !prev)}
                isLoading={isPosting}
              >
                <ImageIcon className="size-4 mr-2" />
                Photo
              </Button>
            </div>
            <Button
              className="flex items-center"
              type="submit"
              isLoading={isPosting}
              disabled={!content.trim() && !imageUrl}
            >
              <SendIcon className="size-4 mr-2" />
              Post
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
