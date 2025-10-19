// TODO: Split into multiple files.
export const ERROR_MESSAGES = {
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
  },
  POST: {
    CREATE_FAILED: "Unable to create the post.",
    CREATE_SUCCESS: "Post created successfully.",
  },
} as const;
