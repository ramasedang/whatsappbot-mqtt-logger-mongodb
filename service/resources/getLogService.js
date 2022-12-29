import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getLogService() {
  let log = await prisma.loggers.findMany();

  let result = "";
  for (let i = 0; i < log.length; i++) {
    result += `Date Time: ${new Date(log[i].created_at).toLocaleString()} \n`;
    result += `No Sender: ${log[i].no_sender} \n`;
    result += `No Group: ${log[i].no_group} \n`;
    result += `Name: ${log[i].name} \n`;
    result += `Message: ${log[i].message} \n`;
    result += `Quoted Message: ${log[i].quoted_message} \n`;
    result += `Topic: ${log[i].topic} \n`;
    result += `============================ \n`;
  }

  return result;
}

export async function deleteAll() {
  await prisma.loggers.deleteMany();
  return "Delete all data";
}
