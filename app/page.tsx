import { FileUpload } from "@/components/file-upload";

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4 md:px-6 flex flex-col items-center">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">AI File Analyzer</h1>
          <p className="text-muted-foreground">
            Drag and drop files or click to browse. Supports images and PDFs.
          </p>
        </div>
        <FileUpload maxFiles={5} maxSize={5} accept="image/*,application/pdf" />
      </div>
    </main>
  );
}
