import { prismaClient } from "../clients/db";
import { redisClient } from "../clients/redis";

export interface CreateTweetPayload {
  content: string;
  imageURL?: string;
  userId: string;
}

class TweetService {
  // ─── Create ────────────────────────────────────────────────────────────────
  public static async createTweet(data: CreateTweetPayload) {
    const rateLimitFlag = await redisClient.get(
      `RATE_LIMIT:TWEET:${data.userId}`
    );
    if (rateLimitFlag) throw new Error("Please wait....");

    const tweet = await prismaClient.tweet.create({
      data: {
        content: data.content,
        imageURL: data.imageURL,
        author: { connect: { id: data.userId } },
      },
    });

    // 10-second rate limit per user
    await redisClient.setex(`RATE_LIMIT:TWEET:${data.userId}`, 10, 1);
    // Bust the global tweet cache
    await redisClient.del("ALL_TWEETS");
    return tweet;
  }

  // ─── Read all (cache-first, limited to latest 50) ──────────────────────────
  public static async getAllTweets() {
    const cachedTweets = await redisClient.get("ALL_TWEETS");
    if (cachedTweets) return JSON.parse(cachedTweets);

    const tweets = await prismaClient.tweet.findMany({
      orderBy: { createdAt: "desc" },
      take: 50, // ✅ Pagination fix — never return the entire table
    });

    await redisClient.set("ALL_TWEETS", JSON.stringify(tweets));
    return tweets;
  }

  // ─── Delete ────────────────────────────────────────────────────────────────
  public static async deleteTweet(tweetId: string, userId: string) {
    const tweet = await prismaClient.tweet.findUnique({
      where: { id: tweetId },
    });
    if (!tweet) throw new Error("Tweet not found");
    if (tweet.authorId !== userId)
      throw new Error("You are not authorized to delete this tweet");

    await prismaClient.tweet.delete({ where: { id: tweetId } });
    await redisClient.del("ALL_TWEETS");
    return true;
  }

  // ─── Like ──────────────────────────────────────────────────────────────────
  public static async likeTweet(tweetId: string, userId: string) {
    // prisma will throw on duplicate because of @@unique([userId, tweetId])
    await prismaClient.like.create({
      data: {
        user: { connect: { id: userId } },
        tweet: { connect: { id: tweetId } },
      },
    });
    await redisClient.del("ALL_TWEETS");
    return prismaClient.tweet.findUnique({ where: { id: tweetId } });
  }

  // ─── Unlike ────────────────────────────────────────────────────────────────
  public static async unlikeTweet(tweetId: string, userId: string) {
    await prismaClient.like.deleteMany({
      where: { userId, tweetId },
    });
    await redisClient.del("ALL_TWEETS");
    return prismaClient.tweet.findUnique({ where: { id: tweetId } });
  }

  // ─── Comment ───────────────────────────────────────────────────────────────
  public static async addComment(
    tweetId: string,
    userId: string,
    content: string
  ) {
    return prismaClient.comment.create({
      data: {
        content,
        author: { connect: { id: userId } },
        tweet: { connect: { id: tweetId } },
      },
    });
  }

  public static async getTweetComments(tweetId: string) {
    return prismaClient.comment.findMany({
      where: { tweetId },
      orderBy: { createdAt: "asc" },
    });
  }
}

export default TweetService;
