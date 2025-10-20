import { paths } from "@/lib/constants";
import { isNullable } from "@/lib/utils";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../card";
import { FollowButton } from "./parts";
import { loadWhoToFollow } from "./who-to-follow.loader";

export async function WhoToFollow() {
  const { recommendedUsers } = await loadWhoToFollow();

  if (isNullable(recommendedUsers)) {
    return null;
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Who to Follow</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendedUsers.map((recommendedUser) => (
            <div
              key={recommendedUser.id}
              className="flex gap-2 items-center justify-between "
            >
              <div className="flex items-center gap-1">
                <Link href={paths.PROFILE(recommendedUser.id)}>
                  <Avatar>
                    <AvatarImage
                      width={40}
                      src={recommendedUser.image ?? "/avatar.png"}
                    />
                  </Avatar>
                </Link>
                <div className="text-xs pl-2">
                  <Link
                    href={paths.PROFILE(recommendedUser.id)}
                    className="font-medium cursor-pointer"
                  >
                    {recommendedUser.name}
                  </Link>
                  <p className="text-muted-foreground">
                    @{recommendedUser.username}
                  </p>
                  <p className="text-muted-foreground">
                    {recommendedUser._count.followers} followers
                  </p>
                </div>
              </div>
              <FollowButton userToFollowId={recommendedUser.id} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
