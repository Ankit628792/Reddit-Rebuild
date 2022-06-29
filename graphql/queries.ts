import { gql } from "@apollo/client";

export const GET_ALL_POSTS = gql`
query MyQuery{
    getPostList{
        body, 
        created_at
        id
        image
        title
        subreddit_id
        username
        comments {
            created_at
            id
            post_id
            text
            username
        }
        subreddit {
            created_at
            id
            topic
        }
        votes {
            created_at
            id
            post_id
            upvote
            username
        }
    }
}
`
export const GET_ALL_POST_BY_ID = gql`
query MyQuery($id: ID!){
    getPost(id: $id){
        body, 
        created_at
        id
        image
        title
        subreddit_id
        username
        comments {
            created_at
            id
            post_id
            text
            username
        }
        subreddit {
            created_at
            id
            topic
        }
        votes {
            created_at
            id
            post_id
            upvote
            username
        }
    }
}
`
export const GET_ALL_POSTS_BY_TOPIC = gql`
query MyQuery($topic: String!){
    getPostListByTopic(topic: $topic){
        body, 
        created_at
        id
        image
        title
        subreddit_id
        username
        comments {
            created_at
            id
            post_id
            text
            username
        }
        subreddit {
            created_at
            id
            topic
        }
        votes {
            created_at
            id
            post_id
            upvote
            username
        }
    }
}
`

export const GET_ALL_VOTES_BY_POSTID = gql`
    query MyQuery($id: ID!){
        getVoteUsingPost_id(id: $id){
            id
            created_at
            post_id
            upvote
            username
        }
    }
`

export const GET_SUBREDDIT_BY_TOPIC = gql`
    query MyQuery($topic: String!){
        getSubredditListByTopic(topic: $topic){
            id
            topic
            created_at
        }
    }
`

export const GET_SUBREDDITS_WITH_LIMIT = gql`
query MyQuery($limit: Int!){
    getSubredditListLimit(limit: $limit){
        created_at
        id
        topic
    }
}
`