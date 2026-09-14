import { createFileRoute } from "@tanstack/react-router";

const title = "يوتيوب بالعربية — مشاهدة وبحث بدون إعلانات مزعجة";
const description =
  "تصفّح الرائج، ابحث عن أي فيديو، شاهد الشورتس وتابع قنواتك المفضّلة بواجهة عربية سريعة بالكامل.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => null,
});
