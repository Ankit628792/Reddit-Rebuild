import React from 'react'
import Image from 'next/image'
import { ChevronDownIcon, HomeIcon, SearchIcon, MenuIcon } from '@heroicons/react/solid'
import { BellIcon, ChatIcon, GlobeIcon, LoginIcon, LogoutIcon, PlusIcon, SparklesIcon, SpeakerphoneIcon, StarIcon, VideoCameraIcon } from '@heroicons/react/outline'
import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'

function Header() {
    const { data: session } = useSession()
    return (
        <div className='flex items-center bg-white px-4 shadow-sm py-2 sticky top-0 z-50'>
            <Link href='/'>
                <div className='relative flex-shrink-0 cursor-pointer items-center flex'>
                    <img src="/images/reddit_logo.png" className='h-10 w-10 object-left  sm:w-24 object-cover sm:object-contain' alt="" />
                </div>
            </Link>

            <Link href='/'>
                <div className='hidden sm:flex items-center mx-5 cursor-pointer xl:min-w-[200px]'>
                    <HomeIcon className='h-5 w-5' />
                    <p className='flex-1 ml-2 hidden lg:inline'>Home</p>
                    <ChevronDownIcon className='h-5 w-5' />
                </div>
            </Link>

            <form className='flex flex-1 items-center space-x-2 border border-gray-200 rounded-sm bg-gray-100 px-3 py-1 ml-5'>
                <SearchIcon className='h-6 w-6 textgray-400' />
                <input className='flex-1 bg-transparent w-0 outline-none border-none' type='text' placeholder="Search Reddit" />
                <button type='submit' hidden />
            </form>

            <div className='items-center text-gray-500 space-x-2 mx-5 hidden lg:inline-flex'>
                <SparklesIcon className='icon' />
                <GlobeIcon className='icon' />
                <VideoCameraIcon className='icon' />
                <hr className='h-10 border border-gray-100 bg-gray-100' />
                <ChatIcon className='icon' />
                <BellIcon className='icon' />
                <PlusIcon className='icon' />
                <SpeakerphoneIcon className='icon' />
            </div>
            <div className='ml-5 flex items-center lg:hidden'>
                {session ? <LogoutIcon className='icon' onClick={() => signOut()} /> : <LoginIcon className='icon' onClick={() => signIn('reddit')} />}
            </div>

            <div onClick={() => session ? signOut() : signIn('reddit')} className='hidden lg:flex items-center space-x-2 border border-gray-100 p-2 cursor-pointer'>
                <div className='relative h-5 w-5 flex-shrink-0'>
                    <Image src="/images/reddit_logo_icon.png" layout='fill' objectFit='contain' alt="" />
                </div>
                {session ?
                    <div className='flex-1 text-xs'>
                        <p className='truncate'>{session?.user?.name}</p>
                        <p className='text-gray-400'>1 Karma</p>
                    </div>
                    :
                    <p className='text-gray-400'>Sign In</p>
                }
            </div>
        </div>
    )
}

export default Header