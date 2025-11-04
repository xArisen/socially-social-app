// TODO: Split into multiple files.
export const ERROR_MESSAGES = {
  MESSAGE_LACKING: "Message is lacking for this accident.",
  AUTH: {
    UNAUTHENTICATED: "You must be signed in to perform this action.",
    USER_NOT_FOUND: "Unable to retrieve the current user.",
    EMAIL_NOT_FOUND:
      "Authenticated user does not have a primary email address.",
  },
  USER: {
    NOT_FOUND: "Unable to find the requested user profile.",
    CREATE_FAILED: "Unable to create the user profile.",
    UPDATE_METADATA_FAILED: "Unable to update the user metadata.",
    RECOMMENDATIONS_FAILED: "Unable to load recommended profiles.",
    FOLLOW_SUCCESS: "You are now following this user.",
    FOLLOW_FAILED: "Unable to follow the selected user.",
    UNFOLLOW_SUCCESS: "You are no longer following this user.",
    UNFOLLOW_FAILED: "Unable to unfollow the selected user.",
    TOGGLE_FOLLOW_FAILED: "Unable to update the follow status.",
    FOLLOW_SELF_FORBIDDEN: "You cannot follow yourself.",
  },
  POST: {
    CREATE_FAILED: "Unable to create the post.",
    CREATE_SUCCESS: "Post created successfully.",
  },
} as const;
