import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

async function main() {
  const project1 = await prisma.project.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "Project Alpha",
      tasks: {
        create: [
          { name: "Setup database", description: "Set up the PostgreSQL database", priority: "alta", status: "a_fazer" }, 
          { name: "Create API endpoints", description: "Develop RESTful API endpoints", priority: "media", status: "a_fazer" }],
      },
    },
  });

  const project2 = await prisma.project.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: "Project Beta",
      tasks: {
        create: [
          { name: "Design UI", description: "Create a user-friendly interface", priority: "alta", status: "a_fazer" },
          { name: "Implement authentication", description: "Set up user login and registration", priority: "media", status: "a_fazer" }
        ],
      },
    },
  });

  console.log({ project1, project2 });
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
