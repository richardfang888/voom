'use client'

import React from 'react'
import MeetingTypeList from '@/components/MeetingTypeList'
import { useGetCalls } from '@/hooks/useGetCalls'

const Home = () => {
    const now = new Date()
    const time = now.toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit' })
    const date = (new Intl.DateTimeFormat('en-US', { dateStyle: 'full' })).format(now)

    const { upcomingCalls } = useGetCalls()
    const firstCall = upcomingCalls && upcomingCalls.length > 0 ? upcomingCalls[0].state.startsAt?.toISOString() : null

    return (
        <section className='flex size-full flex-col gap-5 text-white'>
            <div className='h-[303px] w-full rounded-[20px] bg-hero bg-cover'>
                <div className='flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11'>
                    <h2 className='glassmorphism max-w-[300px] rounded py-2 text-center text-base font-normal'>{firstCall ? `Next Meeting At: ${firstCall.substring(11, 16)} ${firstCall.substring(0, 10)}` : `No Upcoming Meetings`}</h2>
                    <div className='flex flex-col gap-2'>
                        <h1 className='text-4xl font-extrabold lg:text-7xl'>
                            {time}
                        </h1>
                        <p className='text-lg font-medium text-sky-1 lg:text-2xl'>{date}</p>
                    </div>
                </div>
            </div>

            <MeetingTypeList />
            
        </section>
    )
}

export default Home