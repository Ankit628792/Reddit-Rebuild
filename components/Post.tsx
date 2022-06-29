import { ArrowDownIcon, ArrowUpIcon, BookmarkIcon, ChatAltIcon, DotsHorizontalIcon, GiftIcon, ShareIcon } from '@heroicons/react/outline'
import React, { useEffect, useState } from 'react'
import Avatar from './Avatar'
import TimeAgo from 'react-timeago'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { useSession } from 'next-auth/react'
import { useMutation, useQuery } from '@apollo/client'
import { GET_ALL_VOTES_BY_POSTID } from '../graphql/queries'
import { ADD_VOTE } from '../graphql/mutations'

type Props = {
    post: Post
    large: Boolean
}

function Post({ post, large }: Props) {
    const { data: session } = useSession()
    const [vote, setVote] = useState<boolean>()

    const { data, loading } = useQuery(GET_ALL_VOTES_BY_POSTID, { variables: { id: post?.id } })

    const [addVote] = useMutation(ADD_VOTE, { refetchQueries: [GET_ALL_VOTES_BY_POSTID, 'getVoteUsingPost_id'] })

    const upVote = async (isUpvote: boolean) => {
        if (!session) {
            return toast('You need to sig in to vote!')
        }
        if (vote && isUpvote) return;
        if (vote === false && !isUpvote) return;

        const { data: { insertVote: newVote } } = await addVote({
            variables: {
                post_id: post.id,
                username: session?.user?.name,
                upvote: isUpvote
            }
        })
        console.log('NEW VOTE -> ', newVote)
    }

    const displayVotes = (data: any) => {
        const votes: Vote[] = data?.getVoteUsingPost_id
        const displayNumber = votes?.reduce((total, vote) => (vote.upvote ? (total += 1) : (total -= 1)), 0)

        if (votes?.length === 0) return 0;
        if (displayNumber === 0) {
            return votes[0]?.upvote ? 1 : -1
        }
        return displayNumber
    }

    useEffect(() => {
        if (data) {
            const votes: Vote[] = data?.getVoteUsingPost_id
            const vote = votes.find(vote => vote.username == session?.user?.name)?.upvote
            setVote(vote)
        }
    }, [data])

    return (
        <Link href={`/post/${post.id}`}>
            <div className={`flex rounded-md border-gray-300 bg-white shadow-sm ${!large && 'border cursor-pointer hover:border-gray-600 hover:shadow-md'}`}>
                <div className='flex flex-col items-center justify-start space-y-1 rounded-l-md p-4 text-gray-400'>
                    <ArrowUpIcon onClick={() => upVote(true)} className={`voteButton hover:text-blue-400 ${vote && 'text-blue-400'}`} />
                    <p className='font-bold text-sm text-black'>{displayVotes(data)}</p>
                    <ArrowDownIcon onClick={() => upVote(false)} className={`voteButton hover:text-red-400 ${vote === false && 'text-red-400'}`} />
                </div>

                <div className='p-3 pb-1'>

                    <div className='flex items-center space-x-2'>
                        <Avatar seed={post.subreddit[0]?.topic} />
                        <p className='text-xs text-gray-400'>
                            <Link href={`/subreddit/${post.subreddit[0]?.topic}`} ><span className='font-bold text-black hover:text-blue-400 hover:underline cursor-pointer'>r/{post.subreddit[0]?.topic}</span></Link> • Posted by u/{post.username} <TimeAgo date={post.created_at} />
                        </p>
                    </div>

                    <div className='py-4'>
                        <h2 className='text-xl font-semibold'>{post.title}</h2>
                        <p className='mt-2 text-sm font-light'>{post.body}</p>
                    </div>

                    <img className='w-full max-h-96 object-contain max-w-lg mb-4' src={post.image} alt="" />

                    <div className='flex space-x-4 text-gray-400'>
                        <div className='postButton'>
                            <ChatAltIcon className='h-6 w-6' />
                            <p className=''>{post.comments.length} Comments</p>
                        </div>
                        <div className='postButton'>
                            <GiftIcon className='h-6 w-6' />
                            <p className='hidden sm:inline'>Award</p>
                        </div>
                        <div className='postButton'>
                            <ShareIcon className='h-6 w-6' />
                            <p className='hidden sm:inline'>Share</p>
                        </div>
                        <div className='postButton'>
                            <BookmarkIcon className='h-6 w-6' />
                            <p className='hidden sm:inline'>Save</p>
                        </div>
                        <div className='postButton'>
                            <DotsHorizontalIcon className='h-6 w-6' />
                        </div>

                    </div>

                </div>
            </div>
        </Link>
    )
}

export default Post