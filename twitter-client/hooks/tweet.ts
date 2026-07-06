import { graphqlClient } from "@/clients/api";
import { CreateTweetData } from "@/gql/graphql";
import {
  createTweetMutation,
  deleteTweetMutation,
  likeTweetMutation,
  unlikeTweetMutation,
  addCommentMutation,
} from "@/graphql/mutation/tweet";
import {
  getAllTweetsQuery,
  getTweetCommentsQuery,
} from "@/graphql/query/tweet";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

// ─── Get All Tweets ───────────────────────────────────────────────────────────
export const useGetAllTweets = () => {
  const query = useQuery({
    queryKey: ["all-tweets"],
    queryFn: () => graphqlClient.request(getAllTweetsQuery),
  });
  return { ...query, tweets: query.data?.getAllTweets };
};

// ─── Create Tweet ─────────────────────────────────────────────────────────────
export const useCreateTweet = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: CreateTweetData) =>
      graphqlClient.request(createTweetMutation, { payload }),
    onMutate: () => toast.loading("Creating Tweet", { id: "create-tweet" }),
    onSuccess: async () => {
      await queryClient.invalidateQueries(["all-tweets"]);
      toast.success("Tweet posted!", { id: "create-tweet" });
    },
    onError: (err: any) => {
      toast.error(err?.message ?? "Failed to post tweet", {
        id: "create-tweet",
      });
    },
  });

  return mutation;
};

// ─── Delete Tweet ─────────────────────────────────────────────────────────────
export const useDeleteTweet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tweetId }: { tweetId: string }) =>
      graphqlClient.request(deleteTweetMutation as any, { tweetId }),
    onSuccess: async () => {
      await queryClient.invalidateQueries(["all-tweets"]);
      toast.success("Tweet deleted");
    },
    onError: (err: any) => toast.error(err?.message ?? "Failed to delete"),
  });
};

// ─── Like Tweet ───────────────────────────────────────────────────────────────
export const useLikeTweet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tweetId }: { tweetId: string }) =>
      graphqlClient.request(likeTweetMutation as any, { tweetId }),
    onSuccess: async () => {
      await queryClient.invalidateQueries(["all-tweets"]);
    },
    onError: (err: any) => toast.error(err?.message ?? "Failed to like"),
  });
};

// ─── Unlike Tweet ─────────────────────────────────────────────────────────────
export const useUnlikeTweet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tweetId }: { tweetId: string }) =>
      graphqlClient.request(unlikeTweetMutation as any, { tweetId }),
    onSuccess: async () => {
      await queryClient.invalidateQueries(["all-tweets"]);
    },
    onError: (err: any) => toast.error(err?.message ?? "Failed to unlike"),
  });
};

// ─── Add Comment ──────────────────────────────────────────────────────────────
export const useAddComment = () => {
  return useMutation({
    mutationFn: ({
      tweetId,
      content,
    }: {
      tweetId: string;
      content: string;
    }) =>
      graphqlClient.request(addCommentMutation as any, { tweetId, content }),
    onSuccess: () => toast.success("Comment added!"),
    onError: (err: any) =>
      toast.error(err?.message ?? "Failed to add comment"),
  });
};

// ─── Get Tweet Comments (lazy — only runs when enabled) ───────────────────────
export const useGetTweetComments = (tweetId: string, enabled: boolean) => {
  return useQuery({
    queryKey: ["tweet-comments", tweetId],
    queryFn: () =>
      graphqlClient.request(getTweetCommentsQuery as any, { tweetId }),
    enabled,
  });
};
