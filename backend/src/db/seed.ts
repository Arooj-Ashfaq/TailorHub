import { db, pool } from "./client.js";
import { products, services, testimonials, type NewProduct, type NewService, type NewTestimonial } from "./schema.js";

const productSeed: NewProduct[] = [
  { name: "Navy Super 150s Wool", category: "Fabrics", price: 89, image: "fabrics", rating: 4.9 },
  { name: "Ivory Silk Bow Tie", category: "Accessories", price: 49, image: "service-wedding", rating: 4.8 },
  { name: "Poplin Dress Shirt", category: "Ready-made", price: 149, image: "service-shirt", rating: 4.9 },
  { name: "Two-piece Charcoal Suit", category: "Ready-made", price: 649, image: "service-suit", rating: 4.7 },
  { name: "Mother-of-Pearl Cufflinks", category: "Cufflinks", price: 129, image: "service-shirt", rating: 5.0 },
  { name: "Italian Leather Belt", category: "Belts", price: 119, image: "service-suit", rating: 4.6 },
  { name: "Wool Silk Blend Cloth", category: "Fabrics", price: 129, image: "fabrics", rating: 4.9 },
  { name: "Oxford Derby Shoes", category: "Shoes", price: 349, image: "service-suit", rating: 4.8 },
];

const serviceSeed: NewService[] = [
  { title: "Custom Suits", price: 899, duration: "3–4 weeks", image: "service-suit", description: "Fully canvassed, hand-cut two and three-piece suits." },
  { title: "Wedding Suits", price: 1499, duration: "5–6 weeks", image: "service-wedding", description: "Tuxedos, morning coats and groom parties." },
  { title: "Shirts", price: 189, duration: "2 weeks", image: "service-shirt", description: "Thomas Mason & Albini poplins, twills and Oxfords." },
  { title: "Tailored Pants", price: 249, duration: "2 weeks", image: "service-suit", description: "Flat-front and pleated trousers, hemmed to the millimetre." },
  { title: "Sherwani", price: 1299, duration: "5 weeks", image: "service-wedding", description: "Hand-embroidered wedding sherwanis in silk and velvet." },
  { title: "Waistcoats", price: 349, duration: "2–3 weeks", image: "service-suit", description: "Odd waistcoats to sharpen any two-piece." },
  { title: "Alterations", price: 39, duration: "3–7 days", image: "service-shirt", description: "Precision alterations by senior tailors only." },
  { title: "Uniform Stitching", price: 129, duration: "4 weeks", image: "service-shirt", description: "Bulk corporate and hospitality uniforms." },
  { title: "Women's Dresses", price: 599, duration: "4 weeks", image: "service-wedding", description: "Made-to-measure occasion and evening wear." },
  { title: "Kids Clothing", price: 149, duration: "2 weeks", image: "service-shirt", description: "Little suits and party pieces, built to be handed down." },
  { title: "Premium Fabric Selection", price: 0, duration: "in-store", image: "fabrics", description: "Explore 800+ mill cloths from Italy and the UK." },
  { title: "Express Delivery", price: 199, duration: "10 days", image: "service-suit", description: "Fast-tracked craft for last-minute occasions." },
];

const testimonialSeed: NewTestimonial[] = [
  { name: "James Whitcomb", role: "CEO, Whitcomb & Sons", quote: "The finest suit I have ever owned—cut, cloth and finish are peerless.", rating: 5 },
  { name: "Adaeze Okonkwo", role: "Fashion Editor", quote: "TailorHub understand proportion the way great architects understand light.", rating: 5 },
  { name: "Marco Bellini", role: "Groom, June '24", quote: "They made me feel like a film star on the most important day of my life.", rating: 5 },
];

async function seed() {
  const [existing] = await db.select().from(products).limit(1);
  if (existing) {
    console.log("Database already has data — skipping seed. (Truncate the tables first if you want to reseed.)");
    await pool.end();
    return;
  }

  console.log("Seeding database...");
  await db.insert(products).values(productSeed);
  await db.insert(services).values(serviceSeed);
  await db.insert(testimonials).values(testimonialSeed);
  console.log(`Seeded ${productSeed.length} products, ${serviceSeed.length} services, ${testimonialSeed.length} testimonials.`);

  await pool.end();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
