import Upload from "@/components/Upload";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resumind | Upload",
  description: "Smart feedback for your dream job!",
};

export default function UploadHome() {
  return (
    <>
      <Upload />
    </>
  );
}
