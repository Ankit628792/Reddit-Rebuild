import { useQuery } from '@apollo/client'
import { Jelly } from '@uiball/loaders'
import React from 'react'
import { GET_ALL_POSTS, GET_ALL_POSTS_BY_TOPIC } from '../graphql/queries'
import Post from './Post'

function Feed({ topic }: { topic?: string }) {

    const { data, loading, error } = !topic ? useQuery(GET_ALL_POSTS) : useQuery(GET_ALL_POSTS_BY_TOPIC, { variables: { topic: topic } })
    const posts: Post[] = !topic ? data?.getPostList : data?.getPostListByTopic

    if (loading && !Boolean(posts)) {
        return (
          <div className='flex items-center justify-center w-full p-10 text-xl'>
            <Jelly size={50} color='#FF4501' />
          </div>
        )
      }
    return (
        <div className='mt-5 space-y-4'>
            {posts?.map(post => (
                <Post key={post.id} post={post} large={false} />
            ))}

        </div>
    )
}

export default Feed