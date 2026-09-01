import serviceSuit from "@/assets/service-suit.jpg";
import serviceWedding from "@/assets/service-wedding.jpg";
import serviceShirt from "@/assets/service-shirt.jpg";
import fabrics from "@/assets/fabrics.jpg";

const imageByKey: Record<string, string> = {
  "service-suit": serviceSuit,
  "service-wedding": serviceWedding,
  "service-shirt": serviceShirt,
  fabrics,
};

/** The backend stores a short image key (e.g. "fabrics"); resolve it to the real bundled asset URL. */
export function resolveImage(key: string): string {
  return imageByKey[key] ?? fabrics;
}
