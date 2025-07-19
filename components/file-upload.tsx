"use client";
import {
  X,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useCallback, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { getAiResult } from "@/server/ai";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Image from "next/image";

export type FileUploadProps = {
  maxFiles?: number;
  maxSize?: number;
  accept?: string;
  onFilesChange?: (files: File[]) => void;
  className?: string;
};

type FileWithPreview = {
  file: File;
  preview: string | null;
  progress: number;
  status: "uploading" | "success" | "error";
  error?: string;
};

export function FileUpload({
  maxFiles = 5,
  maxSize = 5,
  accept = "image/*,application/pdf",
  onFilesChange,
  className,
}: FileUploadProps) {
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [prompt, setPrompt] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (selectedFiles: FileList | null) => {
      if (!selectedFiles) return;

      // Check if adding these files would exceed the max files limit
      if (files.length + selectedFiles.length > maxFiles) {
        toast.error(
          `Too many files, You can only upload up to ${maxFiles} files at once.`,
          {
            style: {
              background: "#ef4444",
              color: "white",
            },
          }
        );
        return;
      }

      const newFiles: FileWithPreview[] = [];

      Array.from(selectedFiles).forEach((file) => {
        // Check file size
        if (file.size > maxSize * 1024 * 1024) {
          toast.error(
            `File too large, ${file.name} exceeds the ${maxSize}MB size limit.`,
            {
              style: {
                background: "#ef4444",
                color: "white",
              },
            }
          );
          return;
        }

        // Create preview for images
        let preview = null;
        if (file.type.startsWith("image/")) {
          preview = URL.createObjectURL(file);
        }

        newFiles.push({
          file,
          preview,
          progress: 0,
          status: "uploading",
        });
      });

      // Simulate upload process for each file
      const updatedFiles = [...files, ...newFiles];
      setFiles(updatedFiles);

      if (onFilesChange) {
        onFilesChange(updatedFiles.map((f) => f.file));
      }

      // Simulate upload progress
      newFiles.forEach((fileWithPreview) => {
        simulateUpload(updatedFiles.indexOf(fileWithPreview));
      });
    },
    [files, maxFiles, maxSize, onFilesChange, toast]
  );

  const simulateUpload = (fileIndex: number) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setFiles((prevFiles) => {
        const newFiles = [...prevFiles];
        newFiles[fileIndex] = {
          ...newFiles[fileIndex],
          progress,
        };

        if (progress >= 100) {
          clearInterval(interval);
          newFiles[fileIndex].status =
            Math.random() > 0.9 ? "error" : "success";
          if (newFiles[fileIndex].status === "error") {
            newFiles[fileIndex].error = "Upload failed. Please try again.";
          }
        }

        return newFiles;
      });
    }, 300);
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const droppedFiles = e.dataTransfer.files;
      handleFiles(droppedFiles);
    },
    [handleFiles]
  );

  const removeFile = useCallback(
    (index: number) => {
      setFiles((prevFiles) => {
        const newFiles = [...prevFiles];
        // Release object URL to prevent memory leaks
        if (newFiles[index].preview) {
          URL.revokeObjectURL(newFiles[index].preview);
        }
        newFiles.splice(index, 1);

        if (onFilesChange) {
          onFilesChange(newFiles.map((f) => f.file));
        }

        return newFiles;
      });
    },
    [onFilesChange]
  );

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files);
      e.target.value = "";
    },
    [handleFiles]
  );

  const onSubmit = async () => {
    setIsLoading(true);
    const result = await getAiResult(prompt, files[0].file);
    console.log(result, "this is the result");
    setIsLoading(false);
    setAiResult(result);
  };

  return (
    <>
      <div className="flex flex-col gap-5">
        {aiResult && (
          <div className="flex flex-col gap-2 max-w-lg">
            <Button
              onClick={() => setAiResult(null)}
              className="cursor-pointer w-fit"
            >
              <ArrowLeft />
              Close
            </Button>
            <p className="text-sm text-muted-foreground leading-8">
              {aiResult}
            </p>
          </div>
        )}
        {!aiResult && (
          <>
            <Label htmlFor="textarea">Your Prompt</Label>
            <Textarea
              id="textarea"
              rows={10}
              value={prompt}
              placeholder="E.g Explain what is in this document."
              onChange={(e) => setPrompt(e.target.value)}
              className="h-32"
            />
            <div className={cn("w-full", className)}>
              <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                multiple={maxFiles > 1}
                onChange={handleFileInputChange}
                className="hidden"
              />

              <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={cn(
                  "relative flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg transition-colors",
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:border-primary/50",
                  "cursor-pointer"
                )}
                onClick={openFileDialog}
              >
                <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                <p className="mb-2 text-sm font-semibold text-center">
                  Drag & drop files here or click to browse
                </p>
                <p className="text-xs text-muted-foreground text-center">
                  Supports {accept.split(",").join(", ")} (Max: {maxSize}MB)
                </p>
                {files.length > 0 && (
                  <div
                    className="mt-4 w-full"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <p className="text-sm font-medium mb-2">
                      Files ({files.length}/{maxFiles})
                    </p>
                    <div className="space-y-2">
                      {files.map((file, index) => (
                        <Card key={index} className="overflow-hidden">
                          <CardContent className="p-3">
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0">
                                {file.preview ? (
                                  <div className="relative w-10 h-10 rounded overflow-hidden">
                                    <Image
                                      width={100}
                                      height={100}
                                      src={file.preview || "/placeholder.svg"}
                                      alt={file.file.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-center w-10 h-10 rounded bg-muted">
                                    <FileText className="w-5 h-5 text-muted-foreground" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                  {file.file.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {(file.file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                                {file.status === "uploading" && (
                                  <Progress
                                    value={file.progress}
                                    className="h-1 mt-1"
                                  />
                                )}
                                {file.status === "error" && (
                                  <p className="text-xs text-destructive mt-1">
                                    {file.error}
                                  </p>
                                )}
                              </div>
                              <div className="flex-shrink-0 flex items-center gap-2">
                                {file.status === "success" && (
                                  <CheckCircle className="w-5 h-5 text-green-500" />
                                )}
                                {file.status === "error" && (
                                  <AlertCircle className="w-5 h-5 text-destructive" />
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => removeFile(index)}
                                >
                                  <X className="h-4 w-4" />
                                  <span className="sr-only">Remove file</span>
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <Button
              onClick={onSubmit}
              disabled={isLoading || files.length === 0 || !prompt}
              className="w-full "
            >
              {isLoading ? (
                <Loader2 className="size-4 duration-500 animate-spin h-4 w-4 ml-2" />
              ) : (
                "Submit"
              )}
            </Button>
          </>
        )}
      </div>
    </>
  );
}
