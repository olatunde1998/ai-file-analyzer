import generateOgImage from "@/lib/og-generator";

// Image metadata
export const alt = "Upload Resumind";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Image generation
export default async function Image() {
  return generateOgImage("upload");
}
