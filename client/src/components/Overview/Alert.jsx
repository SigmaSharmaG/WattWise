import React from 'react'

const Alert = () => {
    return (
        <div className='p-4 bg-amber-500/30 rounded-2xl space-y-2'>
            <div className='flex justify-between'>
                <div>
                    <h2 className='uppercase font-bold text-amber-950 text-xs'>Telemetry Alert</h2>
                    <p className='font-bold text-black text-sm'>Study Room Fan Overdraw</p>
                </div>

                <p className='bg-amber-800 text-white text-xs font-semibold px-2 py-0.5 flex items-center rounded-md h-max '>Attention</p>
            </div>

            <p className='text-xs text-gray-900'>Atomberg Fan currently drawing 32 W at Speed 3 (calibrated normal baseline: 26 W). Potential friction drag or dust accumulation on blade assembly.</p>

            <div className='flex items-center gap-4'>
                <button className='text-xs font-bold bg-amber-900 text-white py-1 px-4 flex-1 rounded-md'>View Diagnostic</button>
                <button className='text-xs bg-white text-black font-semibold py-1 px-4 rounded-md border border-gray-400/40'>Dismiss</button>
            </div>
        </div>
    )
}

export default Alert