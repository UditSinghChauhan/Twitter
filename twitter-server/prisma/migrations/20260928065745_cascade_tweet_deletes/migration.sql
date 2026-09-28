-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_tweetId_fkey";

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_tweetId_fkey";

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_tweetId_fkey" FOREIGN KEY ("tweetId") REFERENCES "Tweet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_tweetId_fkey" FOREIGN KEY ("tweetId") REFERENCES "Tweet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
