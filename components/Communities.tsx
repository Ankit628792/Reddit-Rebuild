import { useQuery } from '@apollo/client'
import { ChevronUpIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import React from 'react'
import { GET_SUBREDDITS_WITH_LIMIT } from '../graphql/queries'
import Avatar from './Avatar'

const SubredditRow = ({ topic, index }: { topic: string, index: number }) => {
    return (
        <div className='flex items-center space-x-2 border-t bg-white px-4 py-2 last:rounded-b'>
            <p>{index + 1}</p>
            <ChevronUpIcon className='h-4 w-4 flex-shrink-0 text-gray-400' />
            <Avatar seed={`/subreddit/${topic}`} />
            <p className='flex-1 truncate'>{topic}</p>
            <Link href={`/subreddit/${topic}`}>
                <div className='px-3 cursor-pointer rounded-full bg-blue-500 text-white'>View</div>
            </Link>
        </div>
    )
}

function Communities({ topic }: { topic: string }) {
    const { data, loading } = useQuery(GET_SUBREDDITS_WITH_LIMIT, { variables: { limit: 10 } })
    const subreddits: Subreddit[] = data?.getSubredditListLimit

    if (loading) return <></>;

    return (
        <div className='sticky top-36 mx-5 mt-5 hidden h-fit min-w-[300px] rounded-md border border-gray-300 bg-white lg:inline'>
            <p className='text-base mb-1 p-4 pb-3 font-bold'>Top Communities</p>
            <div>
                {
                    subreddits?.filter(item => item.topic !== topic)?.map((subreddit, i) => <SubredditRow key={subreddit.id} topic={subreddit.topic} index={i} />)
                }
            </div>
        </div>
    )
}

export default Communities