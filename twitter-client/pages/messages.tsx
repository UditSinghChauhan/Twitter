import type { NextPage } from "next";
import Twitterlayout from "@/components/FeedCard/Layout/TwitterLayout";
import { BsEnvelope } from "react-icons/bs";

const MessagesPage: NextPage = () => (
  <Twitterlayout>
    <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-500 mt-32">
      <BsEnvelope className="text-6xl" />
      <h1 className="text-2xl font-bold text-white">Messages</h1>
      <p className="text-center">
        Your direct messages will appear here. <br />
        This feature is coming soon!
      </p>
    </div>
  </Twitterlayout>
);

export default MessagesPage;
