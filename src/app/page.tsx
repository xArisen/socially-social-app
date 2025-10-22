import { getPosts } from "@/actions";
import { CreatePost, PostCard, WhoToFollow } from "@/components/ui";
import { getAuthenticatedUser } from "@/lib/server/helpers";

export default async function HomePage() {
  const { isUserAuthenticated, user } = await getAuthenticatedUser();
  const posts = await getPosts();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
      <div className="lg:col-span-6">
        {isUserAuthenticated ? <CreatePost user={user} /> : null}

        <div className="space-y-6">
          {/* TODO: should be extracted component PostCards */}
          {posts.map((post) => {
            return <PostCard key={post.id} post={post} />;
          })}
        </div>
      </div>
      <div className="hidden lg:block lg:col-span-4 sticky top-20">
        <WhoToFollow />
      </div>
    </div>
  );
}
