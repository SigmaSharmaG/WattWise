
import {
  Armchair,
  CookingPot,
  BookOpen,
  BedDouble,
  Trees,
  Zap,
  ChevronRight,
} from "lucide-react";
import ProgressBar from "../ui/ProgressBar";

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

const totalPower = rooms.reduce((sum, room) => sum + room.power, 0);

const RoomDistribution = () => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Room-wise Distribution
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Instantaneous telemetry sorted by demand
          </p>
        </div>

        <div className="rounded-xl bg-green-500/10 p-2.5 text-green-600 dark:text-green-400">
          <Zap size={20} />
        </div>
      </div>

      {/* Total */}
      <div className="mb-5 flex items-center justify-between rounded-xl bg-gray-50 p-4 dark:bg-gray-800/70">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total Room Load
          </p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            {(totalPower / 1000).toFixed(2)} kW
          </p>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          {rooms.reduce((sum, room) => sum + room.active, 0)} active devices
        </p>
      </div>

      {/* Room Cards */}
      <div className="space-y-3 grid grid-cols-4 gap-4">
        {rooms.map((room) => {
          const Icon = room.icon;
          const percentage = (room.power / totalPower) * 100;

          return (
            <div
              key={room.name}
              className="group rounded-xl border bg-gray-50 border-gray-100 p-4 transition hover:border-gray-500/40 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50 shadow"
            >
              <div className="flex flex-col items-left gap-3 space-y-2.5">
                <div className={`rounded-xl flex justify-between ${room.color}`}>
                  <Icon size={25} />
                  <span className="rounded-full px-2 py-0.5 text-sm font-medium text-black/90">
                    {room.active} active
                  </span>
                </div>



                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-medium text-xl text-gray-900 dark:text-white">
                      {room.name}
                    </h3>


                  </div>

                  <div className="flex items-center gap-2">
                    <span className="whitespace-nowrap text-2xl font-semibold text-gray-900 dark:text-white">
                      {room.power} <span className="text-sm">W</span>
                    </span>
                    {/* <ChevronRight
                      size={16}
                      className="text-gray-400 transition group-hover:text-green-500"
                    /> */}
                  </div>

                  {/* Consumption bar */}
                  <div className="mt-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                    <ProgressBar percent={[percentage]} size={6} />
                  </div>


                </div>


              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoomDistribution;
