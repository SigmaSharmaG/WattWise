import React from 'react'
import { ImPower } from "react-icons/im";
import { FaAnglesLeft } from "react-icons/fa6";
import { IoGridOutline } from "react-icons/io5";
import { MdOutlineMeetingRoom } from "react-icons/md";
import { PiFanLight } from "react-icons/pi";
import { TbAutomaticGearboxFilled } from "react-icons/tb";
import { IoAnalyticsOutline } from "react-icons/io5";
import { AiOutlineSetting } from "react-icons/ai";
import { NavLink } from 'react-router-dom';
import ProgressBar from './ProgressBar';

const Sidebar = () => {

    const links = [
        {
            name: "Dashboard",
            path: "/",
            icon: IoGridOutline,
            end: true,
        },
        {
            name: "Rooms",
            path: "/room",
            icon: MdOutlineMeetingRoom,
        },
        {
            name: "Devices",
            path: "/devices",
            icon: PiFanLight,
        },
        {
            name: "Automation",
            path: "/automation",
            icon: TbAutomaticGearboxFilled,
        },
        {
            name: "Energy Analytics",
            path: "/analytics",
            icon: IoAnalyticsOutline,
        },
        {
            name: "Settings",
            path: "/setting",
            icon: AiOutlineSetting,
        }

    ]

    return (
        <div className='fixed md:sticky top-0 max-h-screen w-64 shadow-md p-3 px-4 z-50 bg-white flex flex-col'>
            <div className='flex items-center gap-2'>
                <div className="inline-flex items-center justify-center rounded-md bg-green-800 p-3">
                    <ImPower size={16} className="text-white" />
                </div>
                <div className='flex-1 items-center'>
                    <h2 className='text-xl font-bold tracking-tight leading-none'>WattWise</h2>
                    <p className='uppercase text-xs font-bold text-green-800'>Energy core</p>
                </div>
                <div className="inline-flex items-center justify-center rounded-md p-3">
                    <FaAnglesLeft size={16} className="text-gray-800/60" />
                </div>
            </div>

            

            <nav className="space-y-1 py-6 overflow-y-auto">
            <p className='text-xs font-bold text-gray-600 uppercase leading-none tracking-wide pb-3 px-2'>System Navigation</p>
                {links.map(({ name, path, icon: Icon, end }) => (
                    <NavLink
                        key={path}
                        to={path}
                        end={end}
                        className={({ isActive }) =>
                            `flex items-center gap-3 rounded-lg px-4 py-2 transition-all ${isActive
                                ? "bg-green-700 text-white"
                                : "text-gray-700 hover:bg-gray-200"
                            }`
                        }
                    >
                        <Icon size={18} />
                        <span className='text-sm font-semibold'>{name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className='mt-auto bg-gray-100 p-4 space-y-2 rounded-2xl'>
                <div className='flex justify-between items-center'>
                    <h2 className='uppercase text-xs font-bold text-gray-600 tracking-tight'>Grid Tariffs</h2>
                    <p className='text-xs font-bold text-[#804029]'>Peak Rate</p>
                </div>
                <div className='flex justify-between items-center'>
                    <p className='font-semibold text-2xl'>₹7.80</p>
                    <p className='text-xs font-bold text-gray-700'>/ kWh</p>
                </div>
                <ProgressBar
                    percent={68}
                    color="#804029"
                    size={7}
                />
                <p className='text-xs font-medium text-gray-500'>Eco-shift triggers in 42m</p>
            </div>
        </div>
    )
}

export default Sidebar