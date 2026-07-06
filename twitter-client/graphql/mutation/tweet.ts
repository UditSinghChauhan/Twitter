import { graphql } from "@/gql";

export const createTweetMutation = graphql(`
  mutation CreateTweet($payload: CreateTweetData!) {
    createTweet(payload: $payload) {
      id
    }
  }
`);

export const deleteTweetMutation = graphql(`
  mutation DeleteTweet($tweetId: ID!) {
    deleteTweet(tweetId: $tweetId)
  }
`);

export const likeTweetMutation = graphql(`
  mutation LikeTweet($tweetId: ID!) {
    likeTweet(tweetId: $tweetId) {
      id
      likesCount
      likes {
        id
      }
    }
  }
`);

export const unlikeTweetMutation = graphql(`
  mutation UnlikeTweet($tweetId: ID!) {
    unlikeTweet(tweetId: $tweetId) {
      id
      likesCount
      likes {
        id
      }
    }
  }
`);

export const addCommentMutation = graphql(`
  mutation AddComment($tweetId: ID!, $content: String!) {
    addComment(tweetId: $tweetId, content: $content) {
      id
      content
      createdAt
      author {
        id
        firstName
        lastName
        profileImageURL
      }
    }
  }
`);
