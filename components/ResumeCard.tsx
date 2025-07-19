"use client";
import { useEffect, useState } from "react";
import { usePuterStore } from "@/lib/puter";
import ScoreCircle from "./ScoreCircle";
import Image from "next/image";
import Link from "next/link";

const ResumeCard = ({
  resume: { id, companyName, jobTitle, feedback, imagePath },
}: {
  resume: Resume;
}) => {
    const { fs } = usePuterStore();
  const [resumeUrl, setResumeUrl] = useState("");

  useEffect(() => {
    const loadResume = async () => {
      const blob = await fs.read(imagePath);
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      setResumeUrl(url);
    };

    loadResume();
  }, [imagePath, fs]);

  return (
    <Link
      href={`/resume/${id}`}
      className="flex flex-col gap-8 h-[560px] w-full lg:w-[450px] xl:w-[490px] bg-white rounded-2xl p-4 animate-in fade-in duration-1000"
    >
      <div className="flex flex-row gap-2 justify-between min-h-[110px] max-sm:flex-col items-center max-md:justify-center max-md:items-center">
        <div className="flex flex-col gap-2">
          {companyName && (
            <h2 className="!text-black font-bold break-words">{companyName}</h2>
          )}
          {jobTitle && (
            <h3 className="text-lg break-words text-gray-500">{jobTitle}</h3>
          )}
          {!companyName && !jobTitle && (
            <h2 className="!text-black font-bold">Resume</h2>
          )}
        </div>
        <div className="flex-shrink-0">
          <ScoreCircle score={feedback.overallScore} />
        </div>
      </div>
      {resumeUrl && (
        <div className="bg-gradient-to-b from-light-blue-100 to-light-blue-200 p-4 rounded-2xl animate-in fade-in duration-1000">
          <div className="w-full h-full">
            <Image
              src={resumeUrl}
              alt="resume"
              className="w-full h-[350px] max-sm:h-[200px] object-cover object-top"
            />
          </div>
        </div>
      )}
    </Link>
  );
};
export default ResumeCard;
