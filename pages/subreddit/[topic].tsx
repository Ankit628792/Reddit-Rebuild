import { useRouter } from 'next/router'
import React from 'react'
import Avatar from '../../components/Avatar'
import Communities from '../../components/Communities'
import Feed from '../../components/Feed'
import PostBox from '../../components/PostBox'

function Subreddit() {
    const { query: { topic } } = useRouter()
    return (
        <div className={`h-24 bg-red-400 p-2 sm:p-8`}>
            <div className='lg:mx-8 mt-10 bg-white rounded-md'>
                <div className='mx-auto flex max-w-5xl items-center space-x-4 pb-3 px-3'>
                    <div className='-mt-5'>
                        <Avatar seed={topic as string} large />
                    </div>
                    <div className='py-2'>
                        <h1 className='text-xl sm:text-2xl md:text-3xl font-semibold'>Welcome to the r/{topic} subreddit</h1>
                        <p className='text-sm text-gray-400'>r/{topic}</p>
                    </div>
                </div>
            </div>

            <div className='mt-8 pb-10'>
                <PostBox subreddit={topic as string} />
                <div className='flex w-full max-w-max mx-auto'>
                    <Feed topic={topic as string} />
                    <Communities topic={topic as string} />
                </div>
            </div>

        </div>
    )
}

export default Subreddit