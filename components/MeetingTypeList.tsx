'use client'

import React, { useState } from 'react'
import HomeCard from './HomeCard'
import MeetingModal from './MeetingModal'
import router from 'next/router'

const MeetingTypeList = () => {
    const [meetingState, setMeetingState] = useState<'isSchedulingMeeting' | 'isJoiningMeeting' | 'isStartingMeeting' | undefined>()

    const createMeeting = () => {
        
    }

    return (
        <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
            <HomeCard 
                img='/icons/add-meeting.svg'
                title='New Meeting'
                description='Start a new meeting'
                handleClick={() => setMeetingState('isStartingMeeting')}
                color='bg-orange-1'
            />
            <HomeCard 
                img='/icons/schedule.svg'
                title='Schedule Meeting'
                description='Plan an upcoming meeting'
                handleClick={() => setMeetingState('isSchedulingMeeting')}
                color='bg-blue-1'
            />
            <HomeCard 
                img='/icons/recordings.svg'
                title='View Recordings'
                description='Check out your meeting recordings'
                handleClick={() => router.push('/recordings')}
                color='bg-purple-1'
            />
            <HomeCard 
                img='/icons/join-meeting.svg'
                title='Join Meeting'
                description='Join via invitation link'
                handleClick={() => setMeetingState('isJoiningMeeting')}
                color='bg-yellow-1'
            />

            <MeetingModal 
                isOpen={meetingState === 'isStartingMeeting'}
                onClose={() => setMeetingState(undefined)}
                title='State a new meeting'
                buttonText='Start Meeting'
                handleClick={createMeeting}
                className='text-center'
            />

        </section>
    )
}

export default MeetingTypeList