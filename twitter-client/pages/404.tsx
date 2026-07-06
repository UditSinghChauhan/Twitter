import Link from "next/link";
import { BsTwitter } from "react-icons/bs";
import type { NextPage } from "next";

const NotFoundPage: NextPage = () => (
  <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-6">
    <BsTwitter className="text-[#1d9bf0] text-6xl" />
    <h1 className="text-8xl font-extrabold">404</h1>
    <p className="text-xl text-gray-400">
      Hmm, this page doesn&apos;t exist. Try searching for something else.
    </p>
    <Link
      href="/"
      className="mt-4 bg-[#1d9bf0] hover:bg-blue-500 transition-colors font-semibold px-6 py-3 rounded-full"
    >
      Go to Home
    </Link>
  </div>
);

export default NotFoundPage;
