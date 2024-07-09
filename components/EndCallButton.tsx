'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { useCallStateHooks, useCall } from '@stream-io/video-react-sdk'

const EndCallButton = () => {
    const call = useCall()
    const router = useRouter()

    const { useLocalParticipant } = useCallStateHooks()
    const localParticipant = useLocalParticipant()
    
    const isMeetingOwner = localParticipant && call?.state.createdBy && localParticipant.userId === call.state.createdBy.id

    if(!isMeetingOwner) return null


    return (
        <Button onClick={async () => {
            await  call.endCall()
            router.push('/')
        }} className='bg-red-500'>
            End call for everyone
        </Button>
    )
}

export default EndCallButton