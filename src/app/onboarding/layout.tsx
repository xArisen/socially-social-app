import { createUser } from "@/actions/user.action";
import { paths } from "@/lib/constants/paths";
import { isNotNullable, isNullable } from "@/lib/utils/type-guards.utils";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sessionClaims, userId } = await auth();
  const isOnboardingComplete =
    sessionClaims?.metadata.onboardingComplete === true;
  if (isNullable(userId) || (isNotNullable(userId) && isOnboardingComplete)) {
    redirect(paths.HOME);
  } else if (!isOnboardingComplete) {
    await createUser();
  }

  return children;
}
