import { Tweet, Comment } from "@prisma/client";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { prismaClient } from "../../clients/db";
import { GraphqlContext } from "../../intefaces";
import UserService from "../../services/user";
import TweetService, { CreateTweetPayload } from "../../services/tweet";
import { toISO } from "../../utils/date";

const s3Client = new S3Client({
  region: process.env.AWS_DEFAULT_REGION,
});

// ─── Queries ──────────────────────────────────────────────────────────────────
const queries = {
  getAllTweets: () => TweetService.getAllTweets(),

  getTweetComments: async (
    parent: any,
    { tweetId }: { tweetId: string },
    ctx: GraphqlContext
  ) => TweetService.getTweetComments(tweetId),

  getSignedURLForTweet: async (
    parent: any,
    { imageType, imageName }: { imageType: string; imageName: string },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user || !ctx.user.id) throw new Error("Unauthenticated");

    const allowedImageTypes = [
      "image/jpg",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];
    if (!allowedImageTypes.includes(imageType))
      throw new Error("Unsupported Image Type");

    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      ContentType: imageType,
      Key: `uploads/${ctx.user.id}/tweets/${imageName}-${Date.now()}`,
    });

    const signedURL = await getSignedUrl(s3Client, putObjectCommand);
    return signedURL;
  },
};

// ─── Mutations ────────────────────────────────────────────────────────────────
const mutations = {
  createTweet: async (
    parent: any,
    { payload }: { payload: CreateTweetPayload },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user) throw new Error("You are not authenticated");
    return TweetService.createTweet({ ...payload, userId: ctx.user.id });
  },

  deleteTweet: async (
    parent: any,
    { tweetId }: { tweetId: string },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user) throw new Error("You are not authenticated");
    return TweetService.deleteTweet(tweetId, ctx.user.id);
  },

  likeTweet: async (
    parent: any,
    { tweetId }: { tweetId: string },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user) throw new Error("You are not authenticated");
    return TweetService.likeTweet(tweetId, ctx.user.id);
  },

  unlikeTweet: async (
    parent: any,
    { tweetId }: { tweetId: string },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user) throw new Error("You are not authenticated");
    return TweetService.unlikeTweet(tweetId, ctx.user.id);
  },

  addComment: async (
    parent: any,
    { tweetId, content }: { tweetId: string; content: string },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user) throw new Error("You are not authenticated");
    return TweetService.addComment(tweetId, ctx.user.id, content);
  },
};

// ─── Extra (field) resolvers ──────────────────────────────────────────────────
const extraResolvers = {
  Tweet: {
    // Resolve author User from authorId FK
    author: (parent: Tweet) => UserService.getUserById(parent.authorId),

    // Convert Prisma Date (or cached ISO string) → ISO string for GraphQL
    createdAt: (parent: Tweet) => toISO(parent.createdAt),

    // Return list of User objects who liked this tweet
    likes: async (parent: Tweet) => {
      const likes = await prismaClient.like.findMany({
        where: { tweetId: parent.id },
        include: { user: true },
      });
      return likes.map((like) => like.user);
    },

    // Count of likes (separate from the list — cheaper when list not needed)
    likesCount: (parent: Tweet) =>
      prismaClient.like.count({ where: { tweetId: parent.id } }),

    // Fetch comments for this tweet
    comments: (parent: Tweet) =>
      prismaClient.comment.findMany({
        where: { tweetId: parent.id },
        orderBy: { createdAt: "asc" },
      }),

    // Count of comments
    commentsCount: (parent: Tweet) =>
      prismaClient.comment.count({ where: { tweetId: parent.id } }),
  },

  Comment: {
    // Resolve author User from authorId FK
    author: (parent: Comment) => UserService.getUserById(parent.authorId),

    // Convert Prisma Date (or cached ISO string) → ISO string
    createdAt: (parent: Comment) => toISO(parent.createdAt),
  },
};

export const resolvers = { mutations, extraResolvers, queries };
