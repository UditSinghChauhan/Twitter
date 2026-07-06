import type { NextPage } from "next";
import Twitterlayout from "@/components/FeedCard/Layout/TwitterLayout";
import { BsBookmark } from "react-icons/bs";

const BookmarksPage: NextPage = () => (
  <Twitterlayout>
    <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-500 mt-32">
      <BsBookmark className="text-6xl" />
      <h1 className="text-2xl font-bold text-white">Bookmarks</h1>
      <p className="text-center">
        Tweets you&apos;ve saved will appear here. <br />
        This feature is coming soon!
      </p>
    </div>
  </Twitterlayout>
);

export default BookmarksPage;
