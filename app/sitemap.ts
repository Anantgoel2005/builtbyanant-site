import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://builtbyanant.site/", changeFrequency: "monthly", priority: 1 },
    { url: "https://builtbyanant.site/projects/pathwise", changeFrequency: "monthly", priority: 0.6 },
  ];
}
