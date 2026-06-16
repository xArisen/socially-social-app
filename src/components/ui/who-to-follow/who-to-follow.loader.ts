import { getRecommendedUsers } from "@/actions/user.action";
import { ERROR_MESSAGES } from "@/lib/constants/error.messages";

export async function loadWhoToFollow() {
  try {
    const recommendedUsers = await getRecommendedUsers();

    return {
      recommendedUsers,
    };
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === ERROR_MESSAGES.AUTH.UNAUTHENTICATED
    ) {
      return { recommendedUsers: null };
    }

    throw error;
  }
}
