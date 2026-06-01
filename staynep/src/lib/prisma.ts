import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/** Models that must exist after `prisma generate` (schema additions). */
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

function missingDelegates(client: PrismaClient): string[] {
  return REQUIRED_DELEGATES.filter((model) => {
    const delegate = client[model as keyof PrismaClient] as {
      findMany?: unknown;
    };
    return typeof delegate?.findMany !== "function";
  });
}

function isPrismaClientReady(client: PrismaClient) {
  return missingDelegates(client).length === 0;
}

function staleError(client: PrismaClient) {
  const missing = missingDelegates(client);
  if (missing.length === 0) return new Error(STALE_PRISMA_MESSAGE);
  return new Error(
    `${STALE_PRISMA_MESSAGE} Missing delegates: ${missing.join(", ")}.`
  );
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
    throw staleError(client);
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
      throw staleError(client);
    }
    return value;
  },
});
