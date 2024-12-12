import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import React from 'react'

const Comment = ({comment}) => {
  return (
    <div className='my-2'>
      <div className='flex gap-3 items-center'>
        <Avatar
         className="relative w-12 h-12 overflow-hidden rounded-full border border-gray-600"
                    style={{
                      width: "48px",
                      height: "48px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
            <AvatarImage className='w-full h-full rounded-full object-cover' src={comment?.author?.profilePicture}/>
            <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <h1 className='font-bold text-sm'>{comment?.author.username}<span className='font-normal pl-1'>{comment?.text}</span></h1>
      </div>
    </div>
  )
}

export default Comment
