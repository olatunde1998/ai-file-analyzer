import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="flex flex-row justify-between items-center bg-white rounded-full p-4 w-full px-10 max-w-4xl mx-auto">
      <Link href="/">
        <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#AB8C95] via-[#000000] to-[#8E97C5]">
          RESUMIND
        </p>
      </Link>
      <Link
        href="/upload"
        style={{
          background: "linear-gradient(to bottom, #8e98ff, #606beb)",
          boxShadow: "0px 74px 21px 0px #6678ef00",
        }}
        className="text-white rounded-full px-4 py-2 cursor-pointer w-fit"
      >
        Upload Resume
      </Link>
    </nav>
  );
};
export default Navbar;
