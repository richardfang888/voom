'use client'

import { useUser } from '@clerk/nextjs'
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk'
import React, { useState } from 'react'
import MeetingRoom from '@/components/MeetingRoom'
import MeetingSetup from '@/components/MeetingSetup'
import { useGetCallById } from '@/hooks/useGetCallById'
import Loader from '@/components/Loader'

const Meeting = ({ params: { id } }: { params: { id: string } }) => {
    const { user, isLoaded } = useUser()
    const [isSetupComplete, setIsSetupComplete] = useState(false)
    const { call, isCallLoading } = useGetCallById(id)

    if(!isLoaded || isCallLoading) return <Loader />

    if (!call) return (
        <p className="text-center text-3xl font-bold text-white">
          Call Not Found
        </p>
      );

    return (
        <main className='h-screen w-full'>
            <StreamCall call={call}>
                <StreamTheme>
                    {!isSetupComplete ? (
                        <MeetingSetup setIsSetupComplete={setIsSetupComplete}/>
                    ): (
                        <MeetingRoom />
                    )}
                </StreamTheme>
            </StreamCall>
        </main>
    )
}

export default Meeting