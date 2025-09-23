import { PrismaClient } from "@prisma/client";

declare const globalThis: {
  prismaGlobal: PrismaClient;
} & typeof global;

const prisma: PrismaClient = globalThis.prismaGlobal ?? new PrismaClient();

export default prisma;

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}
