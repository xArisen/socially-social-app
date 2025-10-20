import { getRecommendedUsers } from "@/actions";
import { ERROR_MESSAGES } from "@/lib/constants";

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
