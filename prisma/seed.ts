import { Prisma, PrismaClient } from "../generated/client/deno/edge.ts";
import { config } from "https://deno.land/std@0.163.0/dotenv/mod.ts";

const envVars = await config();
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: envVars.DATABASE_URL
        }
    }
});

const dinoData: Prisma.dinoCreateInput[] = [
    {
        name: "Aardonyx",
        desc: "An early stage in the evolution of sauropods.",
    },
    {
        name: "Abelisaurus",
        desc: "\"Abels's lizard\" has been recontructed from a single skull.",
    },
    {
        name: "Acanthopholis",
        desc: "No, it's not a city in Greece",
    },
]

for (const d of dinoData) {
    const dino = await prisma.dino.create({
        data: d
    })
    console.log(`Created dino with id:${dino.id}`);
}
console.log(`Seeding finished`);

await prisma.$disconnect;