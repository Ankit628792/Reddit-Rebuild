import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import Avatar from './Avatar'
import { DotsHorizontalIcon, LinkIcon, PhotographIcon } from '@heroicons/react/outline'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useMutation } from '@apollo/client'
import { ADD_POST, ADD_SUBREDDIT } from '../graphql/mutations'
import client from '../applloClient'
import { GET_ALL_POSTS, GET_SUBREDDIT_BY_TOPIC } from '../graphql/queries'
import toast from 'react-hot-toast'

type FormData = {
    postTitle: string
    postBody: string
    postImage: string
    subreddit: string
}

function PostBox({ subreddit }: { subreddit?: string }) {
    const { data: session } = useSession()
    const [addPost] = useMutation(ADD_POST, { refetchQueries: [GET_ALL_POSTS, 'getPostList'] })
    const [addSubreddit] = useMutation(ADD_SUBREDDIT)

    const [isImgBox, setIsImgBox] = useState<boolean>(false)
    const { register, setValue, handleSubmit, watch, formState: { errors } } = useForm<FormData>()

    const uploadImage = async (image: any) => {
        let data = new FormData()
        data.append("file", image)
        data.append("upload_preset", "ankit_kumar")
        data.append("cloud_name", `ankit628792`)
        const resp = await fetch(`https://api.cloudinary.com/v1_1/ankit628792/image/upload`, {
            method: "post",
            body: data
        })
        let res = await resp.json();
        return res.secure_url
    }

    const onSubmit: SubmitHandler<FormData> = async (formData) => {
        if (!Boolean(formData.postTitle?.trim())) {
            return toast.error('Enter a valid title')
        }
        if (!Boolean(formData.subreddit?.trim()) && !subreddit) {
            return toast.error('Enter a valid subreddit')
        }
        let image = ''
        if (formData?.postImage) {
            // @ts-ignore
            if (formData?.postImage[0]?.type?.substring(0, 5) === 'image') {
                image = await uploadImage(formData?.postImage[0])
            }
            else {
                return toast.error('Enter a valid image')
            }
        }
        const notification = toast.loading('Creating new Post...')
        try {
            const { data: { getSubredditListByTopic } } = await client.query({
                query: GET_SUBREDDIT_BY_TOPIC,
                variables: {
                    topic: subreddit || formData.subreddit?.trim()
                }
            })
            const subredditExists = getSubredditListByTopic.length > 0
            if (!subredditExists) {
                // create subreddit
                const { data: { insertSubreddit: newSubreddit } } = await addSubreddit({
                    variables: {
                        topic: formData.subreddit?.trim()
                    }
                })

                const { data: { insertPost: newPost } } = await addPost({
                    variables: {
                        body: formData.postBody.trim(),
                        image: image,
                        title: formData.postTitle.trim(),
                        subreddit_id: newSubreddit.id,
                        username: session?.user?.name
                    }
                })
            }
            else {
                // use existing subreddit
                const { data: { insertPost: newPost } } = await addPost({
                    variables: {
                        body: formData.postBody.trim(),
                        image: image,
                        title: formData.postTitle.trim(),
                        subreddit_id: getSubredditListByTopic[0].id,
                        username: session?.user?.name
                    }
                })
            }
            setValue('postBody', '')
            // setValue('postImage', '')
            setValue('postTitle', '')
            setValue('subreddit', '')
            toast.success('New Post Created', { id: notification })
        } catch (error) {
            toast.error('Something went wrong', {
                id: notification
            })
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='sticky top-20 z-50 bg-white border rounded-md border-gray-300 p-2 max-w-3xl mx-auto'>
            <div className='flex items-center space-x-3'>
                <Avatar />
                <input minLength={3} required {...register('postTitle', { required: true })} disabled={!session} className="bg-gray-50 p-2 pl-5 outline-none border-none rounded-md w-0 flex-1" type='text' placeholder={session ? subreddit ? `Create a post in r/${subreddit}` : `Create a post by entering a title` : `Sign in to create post`} />
                <PhotographIcon onClick={() => setIsImgBox(!isImgBox)} className={`h-6 ${isImgBox ? 'text-blue-500' : 'text-gray-300'} hover:text-gray-500 cursor-pointer`} />
                {/* <LinkIcon className='h-6 text-gray-300' /> */}
                <DotsHorizontalIcon className='h-6 text-gray-300' />
            </div>
            {
                !!watch('postTitle') && (
                    <div className='flex flex-col py-2'>
                        <div className='flex items-center px-2'>
                            <p className='min-w-[90px]'>Body:</p>
                            <input className='m-2 flex-1 bg-blue-50 p-2 outline-none' {...register('postBody')} type="text" placeholder="Text (optional)" />
                        </div>

                        {!subreddit && <div className='flex items-center px-2'>
                            <p className='min-w-[90px]'>Subreddit:</p>
                            <input minLength={2} required className='m-2 flex-1 bg-blue-50 p-2 outline-none' {...register('subreddit', { required: true })} type="text" placeholder="i.e. ReactJS" />
                        </div>}
                        {isImgBox && (
                            <div className='flex items-center px-2'>
                                <p className='min-w-[90px]'>Image:</p>
                                <input className='m-2 flex-1 bg-blue-50 p-2 outline-none' {...register('postImage')} type="file" accept="image/*" placeholder="Optional" />
                            </div>
                        )}

                        {!!watch('postTitle') && <button type='submit' className='w-full rounded-full bg-blue-500 p-2 text-white'>Create Post</button>}
                    </div>
                )
            }
        </form>
    )
}

export default PostBox