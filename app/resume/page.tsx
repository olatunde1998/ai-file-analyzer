"use client";
import { use, useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
import { usePuterStore } from "@/lib/puter";
import Summary from "@/components/Summary";
import ATS from "@/components/ATS";
import Image from "next/image";
import Link from "next/link";


export default function Resume({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { fs, kv } = usePuterStore();
  const { id } = use(params);
  const [imageUrl, setImageUrl] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  //   const router = useRouter();

  //   useEffect(() => {
  //     if (!isLoading && !auth.isAuthenticated)
  //       router.push(`/auth?next=/resume/${id}`);
  //   }, [isLoading]);

  useEffect(() => {
    const loadResume = async () => {
      const resume = await kv.get(`resume:${id}`);

      if (!resume) return;

      const data = JSON.parse(resume);

      const resumeBlob = await fs.read(data.resumePath);
      if (!resumeBlob) return;

      const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
      const resumeUrl = URL.createObjectURL(pdfBlob);
      setResumeUrl(resumeUrl);

      const imageBlob = await fs.read(data.imagePath);
      if (!imageBlob) return;
      const imageUrl = URL.createObjectURL(imageBlob);
      setImageUrl(imageUrl);

      setFeedback(data.feedback);
      console.log({ resumeUrl, imageUrl, feedback: data.feedback });
    };

    loadResume();
  }, [id]);

  return (
    <main className="!pt-0">
      <nav className="flex flex-row justify-between items-center p-4 border-b border-gray-200">
        <Link
          href="/"
          className="flex flex-row items-center gap-2 border border-gray-200 rounded-lg p-2 shadow-sm"
        >
          <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5" />
          <span className="text-gray-800 text-sm font-semibold">
            Back to Homepage
          </span>
        </Link>
      </nav>
      <div className="flex flex-row w-full max-lg:flex-col-reverse">
        <section className="flex flex-col gap-8 w-1/2 px-8 max-lg:w-full py-6 bg-[url('/images/bg-small.svg') bg-cover h-[100vh] sticky top-0 items-center justify-center">
          {imageUrl && resumeUrl && (
            <div className="animate-in fade-in duration-1000 bg-gradient-to-b from-light-blue-100 to-light-blue-200 p-4 rounded-2xl max-sm:m-0 h-[90%] max-wxl:h-fit w-fit">
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                <Image
                  width={100}
                  height={100}
                  alt="user image file"
                  src={imageUrl}
                  className="w-full h-full object-contain rounded-2xl"
                  title="resume"
                />
              </a>
            </div>
          )}
        </section>
        <section className="flex flex-col gap-8 w-1/2 px-8 max-lg:w-full py-6">
          <h2 className="text-4xl !text-black font-bold">Resume Review</h2>
          {feedback ? (
            <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
              <Summary feedback={feedback} />
              <ATS
                score={feedback.ATS.score || 0}
                suggestions={feedback.ATS.tips || []}
              />
              {/* <Details feedback={feedback} /> */}
            </div>
          ) : (
            <Image
              width={100}
              height={100}
              alt="resume scan gif"
              src="/images/resume-scan-2.gif"
              className="w-full"
            />
          )}
        </section>
      </div>
    </main>
  );
}
