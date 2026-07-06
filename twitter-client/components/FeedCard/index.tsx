import React, { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { BiMessageRounded, BiUpload } from "react-icons/bi";
import { FaRetweet } from "react-icons/fa";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Tweet } from "@/gql/graphql";
import { useCurrentUser } from "@/hooks/user";
import {
  useLikeTweet,
  useUnlikeTweet,
  useDeleteTweet,
  useAddComment,
  useGetTweetComments,
} from "@/hooks/tweet";
import { timeAgo } from "@/utils/timeAgo";
import toast from "react-hot-toast";

interface FeedCardProps {
  data: Tweet;
}

const FeedCard: React.FC<FeedCardProps> = ({ data }) => {
  const { user: currentUser } = useCurrentUser();

  // ─── Comment toggle state ────────────────────────────────────────────────
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentsFetched, setCommentsFetched] = useState(false);

  // ─── Optimistic like state ───────────────────────────────────────────────
  // null = use server state; true/false = override with optimistic value
  const [optimisticLiked, setOptimisticLiked] = useState<boolean | null>(null);
  const [optimisticCount, setOptimisticCount] = useState<number | null>(null);

  // ─── Hooks ────────────────────────────────────────────────────────────────
  const { mutateAsync: likeTweet } = useLikeTweet();
  const { mutateAsync: unlikeTweet } = useUnlikeTweet();
  const { mutateAsync: deleteTweet, isLoading: isDeleting } = useDeleteTweet();
  const { mutateAsync: addComment, isLoading: isCommenting } = useAddComment();

  const { data: commentsData } = useGetTweetComments(data.id, commentsFetched);
  const comments = (commentsData as any)?.getTweetComments ?? [];

  // ─── Derived state ────────────────────────────────────────────────────────
  const isLiked =
    optimisticLiked !== null
      ? optimisticLiked
      : data.likes?.some((like) => like?.id === currentUser?.id) ?? false;

  const likeCount =
    optimisticCount !== null ? optimisticCount : data.likesCount ?? 0;

  const isMyTweet = currentUser?.id === data.author?.id;

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const handleLikeToggle = useCallback(async () => {
    if (!currentUser) {
      toast.error("Please login to like tweets");
      return;
    }
    if (isLiked) {
      setOptimisticLiked(false);
      setOptimisticCount((likeCount) => (likeCount ?? 1) - 1);
      await unlikeTweet({ tweetId: data.id });
    } else {
      setOptimisticLiked(true);
      setOptimisticCount((likeCount) => (likeCount ?? 0) + 1);
      await likeTweet({ tweetId: data.id });
    }
  }, [currentUser, isLiked, likeCount, likeTweet, unlikeTweet, data.id]);

  const handleDelete = useCallback(async () => {
    if (!window.confirm("Delete this tweet? This cannot be undone.")) return;
    await deleteTweet({ tweetId: data.id });
  }, [data.id, deleteTweet]);

  const handleCommentToggle = useCallback(() => {
    setShowComments((prev) => !prev);
    // Trigger the comments fetch the first time the user opens it
    if (!commentsFetched) setCommentsFetched(true);
  }, [commentsFetched]);

  const handleAddComment = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!currentUser) {
        toast.error("Please login to comment");
        return;
      }
      const trimmed = commentText.trim();
      if (!trimmed) return;
      await addComment({ tweetId: data.id, content: trimmed });
      setCommentText("");
    },
    [commentText, currentUser, addComment, data.id]
  );

  return (
    <div className="border border-r-0 border-l-0 border-b-0 border-gray-600 p-5 hover:bg-slate-900 transition-all cursor-pointer">
      <div className="grid grid-cols-12 gap-3">
        {/* ── Avatar ──────────────────────────────────────────────────────── */}
        <div className="col-span-1">
          {data.author?.profileImageURL && (
            <Link href={`/${data.author.id}`}>
              <Image
                className="rounded-full"
                src={data.author.profileImageURL}
                alt={`${data.author.firstName}'s avatar`}
                height={50}
                width={50}
              />
            </Link>
          )}
        </div>

        {/* ── Content ─────────────────────────────────────────────────────── */}
        <div className="col-span-11">
          {/* Header row: name + timestamp + delete */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link
                href={`/${data.author?.id}`}
                className="font-semibold hover:underline"
              >
                {data.author?.firstName} {data.author?.lastName}
              </Link>
              {/* ✅ Timestamp */}
              {data.createdAt && (
                <span className="text-sm text-gray-500">
                  · {timeAgo(data.createdAt)}
                </span>
              )}
            </div>

            {/* ✅ Delete button — only shown for tweet's own author */}
            {isMyTweet && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                title="Delete tweet"
                className="text-gray-500 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-slate-800"
              >
                <RiDeleteBin6Line className="text-lg" />
              </button>
            )}
          </div>

          {/* Tweet text */}
          <p className="mt-1 leading-relaxed">{data.content}</p>

          {/* Tweet image */}
          {data.imageURL && (
            <Image
              src={data.imageURL}
              alt="tweet-image"
              width={500}
              height={300}
              className="mt-2 rounded-2xl border border-gray-700 object-cover max-h-96"
            />
          )}

          {/* ── Action row ──────────────────────────────────────────────── */}
          <div className="flex justify-between mt-4 text-gray-500 text-xl w-[90%]">
            {/* Comment */}
            <button
              onClick={handleCommentToggle}
              className="flex items-center gap-1 hover:text-blue-400 transition-colors group"
            >
              <span className="p-2 rounded-full group-hover:bg-blue-400/10 transition-colors">
                <BiMessageRounded />
              </span>
              {(data.commentsCount ?? 0) > 0 && (
                <span className="text-sm">{data.commentsCount}</span>
              )}
            </button>

            {/* Retweet (UI only — coming soon) */}
            <button
              className="flex items-center gap-1 hover:text-green-400 transition-colors group"
              title="Retweet — coming soon"
            >
              <span className="p-2 rounded-full group-hover:bg-green-400/10 transition-colors">
                <FaRetweet />
              </span>
            </button>

            {/* ✅ Like / Unlike */}
            <button
              onClick={handleLikeToggle}
              className="flex items-center gap-1 hover:text-pink-500 transition-colors group"
            >
              <span className="p-2 rounded-full group-hover:bg-pink-500/10 transition-colors">
                {isLiked ? (
                  <AiFillHeart className="text-pink-500" />
                ) : (
                  <AiOutlineHeart />
                )}
              </span>
              {likeCount > 0 && <span className="text-sm">{likeCount}</span>}
            </button>

            {/* Share */}
            <button className="flex items-center gap-1 hover:text-blue-400 transition-colors group">
              <span className="p-2 rounded-full group-hover:bg-blue-400/10 transition-colors">
                <BiUpload />
              </span>
            </button>
          </div>

          {/* ── Comment section ─────────────────────────────────────────── */}
          {showComments && (
            <div className="mt-3 border-t border-gray-700 pt-3">
              {/* Existing comments */}
              {comments.length > 0 ? (
                <div className="space-y-3 mb-3">
                  {comments.map((c: any) => (
                    <div key={c.id} className="flex gap-2 items-start">
                      {c.author?.profileImageURL && (
                        <Image
                          src={c.author.profileImageURL}
                          alt="commenter"
                          width={28}
                          height={28}
                          className="rounded-full mt-0.5 flex-shrink-0"
                        />
                      )}
                      <div>
                        <span className="text-sm font-semibold mr-1">
                          {c.author?.firstName} {c.author?.lastName}
                        </span>
                        {c.createdAt && (
                          <span className="text-xs text-gray-500 mr-1">
                            · {timeAgo(c.createdAt)}
                          </span>
                        )}
                        <p className="text-sm text-gray-300">{c.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 mb-3">
                  No comments yet. Be the first!
                </p>
              )}

              {/* Add comment input */}
              {currentUser && (
                <form onSubmit={handleAddComment} className="flex gap-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment…"
                    maxLength={280}
                    className="flex-1 bg-slate-800 text-sm rounded-full px-4 py-2 outline-none border border-gray-600 focus:border-blue-500 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={isCommenting || !commentText.trim()}
                    className="bg-[#1d9bf0] text-white text-sm px-4 py-2 rounded-full font-semibold disabled:opacity-50 hover:bg-blue-500 transition-colors"
                  >
                    {isCommenting ? "…" : "Reply"}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedCard;
