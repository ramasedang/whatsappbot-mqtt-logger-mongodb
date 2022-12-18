import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function getLogService(phone) {
  let log = await prisma.logger.findMany({
    select: {
      phone_number: true,
      message: true,
    },
  });

  return log;
}