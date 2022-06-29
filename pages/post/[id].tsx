import { useMutation, useQuery } from '@apollo/client'
import { Jelly } from '@uiball/loaders'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Avatar from '../../components/Avatar'
import Post from '../../components/Post'
import { ADD_COMMENT } from '../../graphql/mutations'
import { GET_ALL_POST_BY_ID } from '../../graphql/queries'
import TimeAgo from 'react-timeago'

type FormData = {
  comment: string
}

function PostPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [addComment] = useMutation(ADD_COMMENT, { refetchQueries: [GET_ALL_POST_BY_ID, 'getPost'] })

  const { data, loading, error } = useQuery(GET_ALL_POST_BY_ID, { variables: { id: router.query.id } })

  const post: Post = data?.getPost

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>()

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    if (!Boolean(formData.comment.trim())) {
      return toast.error('Enter a valid comment', { id: 'empty' })
    }
    const notification = toast.loading('Posting your comment...')

    try {
      await addComment({
        variables: {
          post_id: router.query.id,
          username: session?.user?.name,
          text: formData.comment.trim()
        }
      })
      setValue('comment', '');
      toast.success('Comments Posted Successfully 😀', { id: notification })
    } catch (error) {
      toast.error('Oops! Something went wrong 🤕', { id: notification })
    }

  }

  if (loading && !Boolean(post)) {
    return (
      <div className='flex items-center justify-center w-full p-10 text-xl'>
        <Jelly size={50} color='#FF4501' />
      </div>
    )
  }

  if (error) {
    return
  }

  return (
    <div className='mx-auto my-7 max-w-4xl'>
      <Post post={post} large />
      <div className='-mt-1 rounded-b-md border border-t-0 border-gray-300 bg-white p-5 pl-16'>
        <p className='text-sm mb-4'>Comment as <span className='text-red-500'>{session?.user?.name}</span></p>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col space-y-4'>
          <textarea {...register('comment', { required: true })} minLength={3} disabled={!session} className='h-24 rounded-md border border-gray-200 p-2 pl-4 outline-none disabled:bg-gray-50 resize-none overflow-scroll' placeholder={session ? 'What are your thoughts?' : 'Please sign in to comment'}></textarea>
          <button disabled={!session} type='submit' className='rounded-full max-w-xs bg-red-500 p-3 font-semibold text-white disabled:bg-gray-200'>Comment</button>
        </form>
      </div>

      <div className='-my-5 rounded-b-md border border-t-0 border-gray-300 bg-white py-5 px-10'>
        <>
          <hr className='py-2' />
          {post?.comments.map((comment) => (
            <div key={comment.id} className='relative flex items-center space-x-2 space-y-5'>
              <hr className='absolute top-10 left-7 z-0 h-16 bg-gray-200 border' />
              <div className='z-50'>
                <Avatar seed={comment.username} />
              </div>
              <div className='flex flex-col'>
                <p className='py-2 text-xs text-gray-400'>
                  <span className='font-semibold text-gray-600'>{comment.username}</span> •{' '}
                  <TimeAgo date={comment.created_at} />
                </p>
                <p>{comment.text}</p>
              </div>
            </div>
          ))}
        </>
      </div>
    </div>
  )
}

export default PostPage