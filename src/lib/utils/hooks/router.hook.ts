// eslint-disable-next-line no-restricted-imports
import { useRouter as useRouterLib } from "next/navigation";

export const useRouter = () => {
  const router = useRouterLib();

  return router;
};
