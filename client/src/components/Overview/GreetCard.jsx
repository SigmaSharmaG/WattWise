import React from 'react'

const GreetCard = () => {
    return (
        <div className='flex p-4 bg-white rounded-md justify-between'>
            <div className='space-y-1'>
                <h2 className='font-medium text-2xl max-w-xl '>Good afternoon, Garvit Sharma! Your home is running efficiently.</h2>
                <span className='text-xs bg-green-300/70 text-green-950 font-medium px-3 py-0.5 rounded-2xl'>Grid Synced</span>
                <p className='text-sm text-gray-700 text-medium py-2'>4 active zones • 14 connected devices (11 online, 3 idle) • Solar offset active at 1.4 kW</p>
            </div>

            <div className='grid grid-cols-3 gap-2'>
                <button className='bg-green-700 text-white h-10 px-4 rounded-md text-sm font-medium leading-0'>Saving Mode</button>
                <button className='bg-gray-200 text-gray-700 h-10 px-4 rounded-md text-sm font-medium leading-0'>Comfort Mode</button>
                <button className='bg-gray-200 text-gray-700 h-10 px-4 rounded-md text-sm font-medium leading-0'>Efficiency Mode</button>
            </div>
        </div>
    )
}

export default GreetCard