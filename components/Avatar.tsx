import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { type } from 'os'
import React from 'react'

type Props = {
    seed?: string
    large?: boolean
}

function Avatar({ seed, large }: Props) {
    const { data: session } = useSession()

    return (
        <div className={`relative h-10 w-10 rounded-full overflow-hidden border-2 border-gray-00 bg-white ${large && 'w-20 h-20'}`}>
            <Image src={`https://avatars.dicebear.com/api/open-peeps/${seed || session?.user?.name || 'placeholder'}.svg`} layout="fill" />
        </div>
    )
}

export default Avatar