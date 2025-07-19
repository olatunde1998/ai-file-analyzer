"use client";
// import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// import { usePuterStore } from "@/lib/puter";
import ResumeCard from "./ResumeCard";
import Image from "next/image";
import Navbar from "./Navbar";
import Link from "next/link";

export default function Home() {
  // const { auth, kv } = usePuterStore();
  //   const router = useRouter();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  //   useEffect(() => {
  //     if (!auth.isAuthenticated) router.push("/auth?next=/");
  //   }, [auth.isAuthenticated]);

  useEffect(() => {
    const loadResumes = async () => {};
    loadResumes();
      setLoadingResumes(false);
      setResumes([])
  }, []);

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-[100vh]">
      <Navbar />

      <section className="flex flex-col items-center gap-8 pt-12 mx-15 pb-5">
        <div className="flex flex-col items-center gap-8 max-w-4xl text-center py-16">
          <h1>Track Your Applications & Resume Ratings</h1>
          {!loadingResumes && resumes?.length === 0 ? (
            <h2>No resumes found. Upload your first resume to get feedback.</h2>
          ) : (
            <h2>Review your submissions and check AI-powered feedback.</h2>
          )}
        </div>
        {loadingResumes && (
          <div className="flex flex-col items-center justify-center">
            <Image
              width={100}
              height={100}
              alt="loading resumes"
              src="/images/resume-scan-2.gif"
              className="w-[200px]"
            />
          </div>
        )}

        {!loadingResumes && resumes.length > 0 && (
          <div className="flex flex-wrap max-lg:flex-col gap-6 items-start  w-full max-w-[1850px] justify-evenly">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}

        {!loadingResumes && resumes?.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <Link
              href="/upload"
              style={{
                background: "linear-gradient(to bottom, #8e98ff, #606beb)",
                boxShadow: "0px 74px 21px 0px #6678ef00",
              }}
              className="text-white rounded-full px-4 py-2 cursor-pointer w-fit text-xl font-semibold"
            >
              Upload Resume
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
