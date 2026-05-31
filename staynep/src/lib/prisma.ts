import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const REQUIRED_DELEGATES = [
  "user",
  "property",
  "travelerLocation",
  "touristReport",
] as const;

export const STALE_PRISMA_MESSAGE =
  "Prisma client is out of date (schema models missing). Run `npx prisma generate`, then restart `npm run dev`.";

function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

function isPrismaClientReady(client: PrismaClient) {
  return REQUIRED_DELEGATES.every((model) => {
    const delegate = client[model as keyof PrismaClient] as {
      findMany?: unknown;
    };
    return typeof delegate?.findMany === "function";
  });
}

function getPrismaClient(): PrismaClient {
  const cached = globalForPrisma.prisma;
  if (cached && isPrismaClientReady(cached)) {
    return cached;
  }

  if (cached) {
    globalForPrisma.prisma = undefined;
    void cached.$disconnect().catch(() => {});
  }

  const client = createPrismaClient();
  if (!isPrismaClientReady(client)) {
    throw new Error(STALE_PRISMA_MESSAGE);
  }

  globalForPrisma.prisma = client;
  return client;
}

/**
 * Lazy Prisma client — re-checks delegates on each access so HMR cannot
 * leave a stale client missing models like touristReport.
 */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient();
    const value = client[prop as keyof PrismaClient];
    if (typeof value === "function") {
      return (value as (...args: unknown[]) => unknown).bind(client);
    }
    if (
      value === undefined &&
      REQUIRED_DELEGATES.includes(prop as (typeof REQUIRED_DELEGATES)[number])
    ) {
      throw new Error(STALE_PRISMA_MESSAGE);
    }
    return value;
  },
});
