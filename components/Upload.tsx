"use client";
import { prepareInstructions } from "@/constants";
import { convertPdfToImage } from "@/lib/pdf2img";
import { usePuterStore } from "@/lib/puter";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { generateUUID } from "@/lib/utils";
import FileUploader from "./FileUploader";
import Navbar from "./Navbar";
import Image from "next/image";

const Upload = () => {
  const {fs, ai, kv } = usePuterStore();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (file: File | null) => {
    setFile(file);
  };

  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File;
  }) => {
    setIsProcessing(true);

    setStatusText("Uploading the file...");
    const uploadedFile = await fs.upload([file]);
    if (!uploadedFile) return setStatusText("Error: Failed to upload file");

    setStatusText("Converting to image...");
    const imageFile = await convertPdfToImage(file);
    if (!imageFile.file)
      return setStatusText("Error: Failed to convert PDF to image");

    setStatusText("Uploading the image...");
    const uploadedImage = await fs.upload([imageFile.file]);
    if (!uploadedImage) return setStatusText("Error: Failed to upload image");

    setStatusText("Preparing data...");
    const uuid = generateUUID();
    const data = {
      id: uuid,
      resumePath: uploadedFile.path,
      imagePath: uploadedImage.path,
      companyName,
      jobTitle,
      jobDescription,
      feedback: "",
    };
    await kv.set(`resume:${uuid}`, JSON.stringify(data));

    setStatusText("Analyzing...");

    const feedback = await ai.feedback(
      uploadedFile.path,
      prepareInstructions({ jobTitle, jobDescription })
    );
    if (!feedback) return setStatusText("Error: Failed to analyze resume");

    const feedbackText =
      typeof feedback.message.content === "string"
        ? feedback.message.content
        : feedback.message.content[0].text;

    data.feedback = JSON.parse(feedbackText);
    await kv.set(`resume:${uuid}`, JSON.stringify(data));
    setStatusText("Analysis complete, redirecting...");
    console.log(data);
    router.push(`/resume/${uuid}`);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget.closest("form");
    if (!form) return;
    const formData = new FormData(form);

    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;

    if (!file) return;

    handleAnalyze({ companyName, jobTitle, jobDescription, file });
  };

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="flex flex-col items-center gap-8 pt-12 pb-5 max-w-3xl mx-auto">
        <div className="flex flex-col items-center gap-8 max-w-4xl text-center py-16">
          <h1 className="text-7xl  text-gradient leading-tight tracking-[1px] font-semibold">
            Smart feedback for your dream job
          </h1>
          {isProcessing ? (
            <>
              <h2 className="text-3xl text-dark-200">{statusText}</h2>
              <Image
                width={100}
                height={100}
                alt="resume scan gif"
                src="/images/resume-scan.gif"
                className="w-full"
              />
            </>
          ) : (
            <h2 className="text-xl text-dark-200">
              Drop your resume for an ATS score and improvement tips
            </h2>
          )}
          {!isProcessing && (
            <form
              id="upload-form"
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 mt-8 items-start w-full"
            >
              <div className="flex flex-col gap-2 w-full items-start">
                <label htmlFor="company-name">Company Name</label>
                <input
                  type="text"
                  name="company-name"
                  placeholder="Company Name"
                  id="company-name"
                  className="w-full p-4 inset-shadow rounded-2xl focus:outline-none bg-white"
                />
              </div>
              <div className="flex flex-col gap-2 w-full items-start">
                <label htmlFor="job-title">Job Title</label>
                <input
                  type="text"
                  name="job-title"
                  placeholder="Job Title"
                  id="job-title"
                  className="w-full p-4 inset-shadow rounded-2xl focus:outline-none bg-white"
                />
              </div>
              <div className="flex flex-col gap-2 w-full items-start">
                <label htmlFor="job-description">Job Description</label>
                <textarea
                  rows={5}
                  name="job-description"
                  placeholder="Job Description"
                  id="job-description"
                  className="w-full p-4 inset-shadow rounded-2xl focus:outline-none bg-white"
                />
              </div>

              <div className="flex flex-col gap-2 w-full items-start">
                <label htmlFor="uploader">Upload Resume</label>
                <FileUploader onFileSelect={handleFileSelect} />
              </div>

              <button
                style={{
                  background: "linear-gradient(to bottom, #8e98ff, #606beb)",
                  boxShadow: "0px 74px 21px 0px #6678ef00",
                }}
                className="text-white rounded-full px-4 py-2 cursor-pointer w-full"
                type="submit"
              >
                Analyze Resume
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
};
export default Upload;
