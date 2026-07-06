import type { NextPage } from "next";
import Twitterlayout from "@/components/FeedCard/Layout/TwitterLayout";
import { BsBell } from "react-icons/bs";

const NotificationsPage: NextPage = () => (
  <Twitterlayout>
    <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-500 mt-32">
      <BsBell className="text-6xl" />
      <h1 className="text-2xl font-bold text-white">Notifications</h1>
      <p className="text-center">
        Your notifications will appear here. <br />
        This feature is coming soon!
      </p>
    </div>
  </Twitterlayout>
);

export default NotificationsPage;
