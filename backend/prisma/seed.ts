import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();
async function main() {
    await prisma.role.createMany({
        data: [
            { id: uuidv4(), roleType: "admin" },
            { id: uuidv4(), roleType: "institution" },
            { id: uuidv4(), roleType: "parent" },
            { id: uuidv4(), roleType: "student" },
            { id: uuidv4(), roleType: "driver" },
        ],
    });
}
main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
