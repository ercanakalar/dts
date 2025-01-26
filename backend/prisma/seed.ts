import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
    await prisma.role.createMany({
        data: [
            {
                id: 1,
                roleType: "admin",
            },
            {
                id: 2,
                roleType: "institution",
            },
            {
                id: 3,
                roleType: "parent",
            },
            {
                id: 4,
                roleType: "student",
            },
            {
                id: 5,
                roleType: "driver",
            },
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
