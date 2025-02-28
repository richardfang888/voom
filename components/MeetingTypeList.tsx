/* eslint-disable camelcase */
'use client'

import React, { useState } from 'react'
import HomeCard from './HomeCard'
import MeetingModal from './MeetingModal'
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { useToast } from "@/components/ui/use-toast"
import { Textarea } from './ui/textarea'
import { Input } from './ui/input'
import ReactDatePicker from 'react-datepicker'

const MeetingTypeList = () => {
    const [meetingState, setMeetingState] = useState<'isSchedulingMeeting' | 'isJoiningMeeting' | 'isStartingMeeting' | undefined>(undefined)
    const [values, setValues] = useState({
        dateTime: new Date(),
        description: '',
        link: '',
    })
    const [callDetails, setCallDetails] = useState<Call>()

    const { toast } = useToast()
    const router = useRouter();
    
    const { user } = useUser();
    const client = useStreamVideoClient();

    const createMeeting = async () => {
        if(!client || !user) return 

        try {
            if(!values.dateTime) {
                toast({
                    title: "Please select a date and time",
                })
                return
            }

            const id = crypto.randomUUID()
            const call = client.call('default', id)
            
            if(!call) throw new Error('Failed to create meeting')
            const startsAt = values.dateTime.toISOString().substring(0, 16) || new Date(Date.now()).toISOString().substring(0, 16)
            const description = values.description || 'Create Meeting'

            await call.getOrCreate({
                data: {
                    starts_at: startsAt,
                    custom: {
                        description
                    }
                }
            })

            setCallDetails(call)

            if(!values.description) {
                router.push(`/meeting/${call.id}`)
            }

            toast({
                title: "Meeting Created",
            })
        } catch (error) {
            console.log(error)
            toast({
                title: "Failed to create Meeting",
            })
        }
    }

    const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`

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
                img='/icons/join-meeting.svg'
                title='Join Meeting'
                description='Join via invitation link'
                handleClick={() => setMeetingState('isJoiningMeeting')}
                color='bg-blue-1'
            />
            <HomeCard 
                img='/icons/schedule.svg'
                title='Schedule Meeting'
                description='Plan an upcoming meeting'
                handleClick={() => setMeetingState('isSchedulingMeeting')}
                color='bg-purple-1'
            />
            <HomeCard 
                img='/icons/recordings.svg'
                title='View Recordings'
                description='Check out your meeting recordings'
                handleClick={() => router.push('/recordings')}
                color='bg-yellow-1'
            />
            
            {!callDetails ? (
                <MeetingModal
                    isOpen={meetingState === 'isSchedulingMeeting'}
                    onClose={() => setMeetingState(undefined)}
                    title='Create Meeting'
                    handleClick={createMeeting}
                >
                    <div className='flex flex-col gap-2.5'>
                        <label className='text-base font-normal leading-[22.4px] text-sky-2'>Add a description</label>
                        <Textarea className='border-none bg-dark-3 focus-visible:ring-0 focus-visible-ring-offset-0' onChange={(e) => {
                            setValues({...values, description: e.target.value})
                        }}/>
                    </div>
                    <div className='flex w-full flex-col gap-2.5'>
                        <label className='text-base text-normal leading-[22.4px] text-sky-2'>Select Date and Time</label>
                        <ReactDatePicker 
                            selected={values.dateTime}
                            onChange={(date) => setValues({...values, dateTime: date!})}
                            showTimeSelect
                            timeFormat='HH:mm'
                            timeIntervals={15}
                            timeCaption='time'
                            dateFormat='MMMM d, yyyy h:mm aa'
                            className='w-full rounded bg-dark-3 p-2 focus-outline-none'
                        />
                    </div>
                </MeetingModal>
            ) : (
                <MeetingModal 
                    isOpen={meetingState === 'isSchedulingMeeting'}
                    onClose={() => setMeetingState(undefined)}
                    title='Meeting Created'
                    handleClick={() => {
                        navigator.clipboard.writeText(meetingLink)
                        toast({title: 'Link copied'})
                    }}
                    className='text-center'
                    image='/icons/checked.svg'
                    buttonIcon='/icons/copy.svg'
                    buttonText='Copy Meeting Link'
                />
            )}

            <MeetingModal 
                isOpen={meetingState === 'isStartingMeeting'}
                onClose={() => setMeetingState(undefined)}
                title='State a new meeting'
                buttonText='Start Meeting'
                handleClick={createMeeting}
                className='text-center'
            />

            <MeetingModal 
                isOpen={meetingState === 'isJoiningMeeting'}
                onClose={() => setMeetingState(undefined)}
                title='Enter meeting link'
                buttonText='Join Meeting'
                handleClick={() => router.push(values.link)}
                className='text-center'
            >
                <Input 
                    placeholder='Meeting Link'
                    className='border-none bg-dark-3 focus-visible:ring-0 forcus-visible:ring-offset-0'
                    onChange={(e) => setValues({ ...values, link: e.target.value })}
                />
            </MeetingModal>

        </section>
    )
}

export default MeetingTypeList