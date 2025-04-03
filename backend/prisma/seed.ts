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
            { id: uuidv4(), roleType: "teacher" },
        ],
    });
    await prisma.institution.create({
        data: {
            name: "Greenwood High School",
            address: "123 Education Lane, Springfield",
            phoneNumber1: "+1-555-123-4567",
            phoneNumber2: "+1-555-987-6543",
            institutionKey: "GWH-2025",
        },
    });

    await prisma.institution.create({
        data: {
            name: "Riverdale Academy",
            address: "456 River Road, Riverdale",
            phoneNumber1: "+1-555-111-2222",
            phoneNumber2: "+1-555-333-4444",
            institutionKey: "RA-2025",
        },
    });

    await prisma.subject.create({
        data: {
            name: "Mathematic",
        },
    });
    await prisma.subject.create({
        data: {
            name: "Physics",
        },
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
