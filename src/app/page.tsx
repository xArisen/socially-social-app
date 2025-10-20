import { CreatePost, WhoToFollow } from "@/components/ui";
import { getAuthenticatedUser } from "@/lib/server/helpers";

export default async function HomePage() {
  const { isUserAuthenticated, user } = await getAuthenticatedUser();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
      <div className="lg:col-span-6">
        {isUserAuthenticated ? <CreatePost user={user} /> : null}
      </div>
      <div className="hidden lg:block lg:col-span-4 sticky top-20">
        <WhoToFollow />
      </div>
    </div>
  );
}
