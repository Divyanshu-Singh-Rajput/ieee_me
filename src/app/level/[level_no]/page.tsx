import Level1 from '@/levels/spot-red-flag/Level-1'
import Level2 from '@/levels/spot-red-flag/Level2'
import Level3 from '@/levels/spot-red-flag/Level3'
import React from 'react'

export default async function Page({
    params,
  }: {
    params: Promise<{ level_no: string }>;
  }) {
    const no = await params.then(p => p.level_no)
    switch(no){
        case "1":
            return <div className='w-screen h-screen'><h1 className='text-4xl font-bold text-white'><Level1/></h1></div>
        case "2":
            return <div className='w-screen h-screen'><h1 className='text-4xl font-bold text-white'><Level2/></h1></div>
        case "3":
            return <div className='w-screen h-screen'><h1 className='text-4xl font-bold text-white'><Level3/></h1></div>
        default:
            return <div className='w-screen h-screen'><h1 className='text-4xl font-bold text-white'>Level Not Found</h1></div>
    }

}
