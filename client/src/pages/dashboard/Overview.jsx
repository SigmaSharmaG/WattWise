import React from 'react'
import GreetCard from '../../components/Overview/GreetCard'
import SavingInfo from '../../components/Overview/SavingInfo'

import {
  Zap,
  TrendingUp,
  TrendingDown,
  IndianRupee,
  ShieldCheck,
  PiggyBank,
  Leaf,
  Cloud,
} from "lucide-react";
import KPICard from '../../components/Overview/KPICard';
import PowerConsumptionChart from '../../components/Overview/PowerConsumptionChart';
import Alert from '../../components/Overview/Alert';

export const kpiData = [
  {
    id: 1,
    title: "Live Power Draw",
    badge: "LIVE",
    value: "1,852 W",
    trend: {
      icon: TrendingUp,
      value: "+140 W",
      description: "vs 10m baseline",
      positive: false,
    },
    footer: {
      icon: Zap,
      text: "1.4 kW solar sync",
    },
    type: "power",
    color: "orange",
  },
  {
    id: 2,
    title: "Today's Consumption",
    icon: Zap,
    value: "14.8 kWh",
    trend: {
      icon: TrendingDown,
      value: "-18.7%",
      description: "vs 18.2 kWh yesterday",
      positive: true,
    },
    type: "consumption",
    color: "blue",
  },
  {
    id: 3,
    title: "Month-to-Date Cost",
    subtitle: "₹7.50 / kWh",
    value: "₹1,860",
    secondaryValue: "/ ₹3,200 cap",
    progress: 58,
    status: {
      icon: ShieldCheck,
      text: "On track",
      description: "12 days remaining",
    },
    type: "cost",
    color: "green",
  },
  {
    id: 4,
    title: "Verified Savings",
    icon: PiggyBank,
    value: "₹412",
    description: "net saved",
    metrics: [
      {
        icon: Leaf,
        value: "55 kWh",
        label: "avoided",
      },
      {
        icon: Cloud,
        value: "42 kg",
        label: "CO₂ cut",
      },
    ],
    type: "savings",
    color: "emerald",
  },
];


import {
  Armchair,
  CookingPot,
  BookOpen,
  BedDouble,
  Trees,
  ChevronRight,
} from "lucide-react";
import RoomDistribution from '../../components/Overview/RoomDistribution';
import ActiveAutomation from '../../components/Overview/ActiveAutomation';

const rooms = [
  {
    name: "Living Room",
    active: 4,
    power: 680,
    icon: Armchair,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    name: "Kitchen",
    active: 3,
    power: 540,
    icon: CookingPot,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    name: "Study Room",
    active: 2,
    power: 320,
    icon: BookOpen,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  {
    name: "Master Bed",
    active: 1,
    power: 180,
    icon: BedDouble,
    color: "text-pink-500",
    bg: "bg-pink-500/10",
  },
  {
    name: "Outdoor",
    active: 1,
    power: 120,
    icon: Trees,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
];


const Overview = () => {

  const totalPower = rooms.reduce((sum, room) => sum + room.power, 0);

  return (
    <div className='w-full max-w-7xl mx-auto p-5 space-y-5'>
      <GreetCard />
      <SavingInfo />


      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpiData.map((item) => (
          <KPICard key={item.id} data={item} />
        ))}
      </div>

      <div className='grid grid-cols-[3fr_2fr] space-y-2 gap-4'>
        <div className='space-y-4'>
          <PowerConsumptionChart />
          <RoomDistribution />
        </div>
        <div className='space-y-4'>
          <Alert />
          <ActiveAutomation/>
        </div>
      </div>





    </div>
  )
}

export default Overview