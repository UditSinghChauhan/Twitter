import type { NextPage } from "next";
import Twitterlayout from "@/components/FeedCard/Layout/TwitterLayout";
import { BiHash } from "react-icons/bi";

const ExplorePage: NextPage = () => (
  <Twitterlayout>
    <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-500 mt-32">
      <BiHash className="text-6xl" />
      <h1 className="text-2xl font-bold text-white">Explore</h1>
      <p className="text-center">
        Trending topics and search will appear here. <br />
        This feature is coming soon!
      </p>
    </div>
  </Twitterlayout>
);

export default ExplorePage;
