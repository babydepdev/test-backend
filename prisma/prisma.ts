import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const seedProducts = async () => {
  const products = [
    { name: "Wireless Headphones", price: 10.0 },
    { name: "Bluetooth Speaker", price: 20.0 },
    { name: "Smart Watch", price: 30.0 },
    { name: "Laptop Stand", price: 40.0 },
    { name: "Phone Charger", price: 50.0 },
    { name: "Portable Power Bank", price: 60.0 },
    { name: "Noise-Cancelling Earbuds", price: 70.0 },
    { name: "Smartphone Case", price: 80.0 },
    { name: "LED Desk Lamp", price: 90.0 },
    { name: "Tablet Holder", price: 100.0 },
  ];

  const existingProducts = await prisma.product.findMany();

  if (existingProducts.length === 0) {
    for (const product of products) {
      await prisma.product.create({
        data: product,
      });
    }

    console.log("10 products have been seeded!");
  } else {
    console.log("Products already exist in the database.");
  }
};

seedProducts()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

export default prisma;
