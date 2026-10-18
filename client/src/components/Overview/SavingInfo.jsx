import React from 'react'
import { MdOutlineSavings } from "react-icons/md";
import { MdOutlineEnergySavingsLeaf } from "react-icons/md";

const SavingInfo = () => {
  return (
    <div className='px-4 py-2 bg-[#cfe8c8] rounded-md'>
        <p className='text-sm text-black/90 flex items-center gap-2'>
            <span className=''>
                <MdOutlineEnergySavingsLeaf size={18}/>
            </span>
            <span className='text-black font-semibold tracking-tight'>Saving Mode Active: </span>
            Prioritizing vacancy turn-offs & eco-drift limits. High-draw circuits clamped to non-peak tariff band.

            <span className='text-green-800 font-bold text-xs tracking-tight ml-auto'>₹420/month projected cut</span>
        </p>
    </div>
  )
}

export default SavingInfo