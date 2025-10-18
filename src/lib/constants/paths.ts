// The paths without import from this file are also found in the middleware.ts file.
export const paths = {
  HOME: "/",
  ON_BOARDING: "/onboarding",
  ABOUT: "/about",
  NOTIFICATIONS: "/notifications",
  PROFILE: (id: string) => `/profile/${id}`,
};
