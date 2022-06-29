import type { NextPage } from 'next'
import Communities from '../components/Communities'
import Feed from '../components/Feed'
import PostBox from '../components/PostBox'


const Home: NextPage = () => {
  return (
    <div className="max-w-5xl my-7 mx-auto p-2">
      <PostBox />
      <div className='flex'>
        <Feed />
        <Communities topic='' />
      </div>
    </div>
  )
}

export default Home
