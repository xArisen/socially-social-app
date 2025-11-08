import { Prisma } from "@/generated/prisma";

export function mapPrismaError(err: unknown): {
  errorCode: string;
  message: string;
} {
  const message = "Database error.";

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return { errorCode: err.code, message };
  }

  return { errorCode: "UNKNOWN", message };
}
