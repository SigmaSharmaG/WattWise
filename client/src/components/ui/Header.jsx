
import { useState } from "react";
import {
  MapPin,
  Search,
  Sun,
  Moon,
  Bell,
  ChevronDown,
  Zap,
  Leaf,
  Scale,
  UserRound,
  Settings,
  LogOut,
  Check,
} from "lucide-react";

const modes = [
  {
    label: "Saving",
    description: "Reduce electricity costs",
    icon: Leaf,
    color: "text-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
  },
  {
    label: "Balanced",
    description: "Balance comfort and cost",
    icon: Scale,
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-500/10",
  },
  {
    label: "Comfort",
    description: "Prioritize home comfort",
    icon: Zap,
    color: "text-amber-600",
    bg: "bg-amber-50 dark:bg-amber-500/10",
  },
];

export default function Header() {
  const [mode, setMode] = useState("Balanced");
  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains("dark")
  );
  const [modeOpen, setModeOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [location, setLocation] = useState("Home");
  const [search, setSearch] = useState("");

  const selectedMode = modes.find((item) => item.label === mode);
  const ModeIcon = selectedMode.icon;

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle("dark", next);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/90">
      <div className="flex min-h-10 flex-wrap items-center gap-2 px-2 py-1 sm:px-6 lg:flex-nowrap lg:px-4">

        {/* Location */}
        <div className="relative shrink-0">
          <button
            onClick={() => setLocationOpen(!locationOpen)}
            className="flex items-center gap-2 rounded-md border border-gray-200 px-3 py-1 transition hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900"
          >
            <MapPin size={18} className="text-emerald-600" />

            <div className="text-left flex items-center py-2">
              {/* <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500">
                Location
              </p> */}
              <p className="text-xs font-semibold text-gray-900 dark:text-white">
                {location}
              </p>
            </div>

            <ChevronDown size={15} className="text-gray-500" />
          </button>

          {locationOpen && (
            <div className="absolute left-0 top-full mt-2 w-44 rounded-xl border border-gray-200 bg-white p-1 shadow-xl dark:border-gray-800 dark:bg-gray-900">
              {["Tagore Hostel", "Work", "Other"].map((place) => (
                <button
                  key={place}
                  onClick={() => {
                    setLocation(place);
                    setLocationOpen(false);
                  }}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {place}
                  {location === place && (
                    <Check size={15} className="text-emerald-600" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Energy mode */}
        <div className="relative shrink-0">
          <button
            onClick={() => setModeOpen(!modeOpen)}
            className="flex items-center gap-2 rounded-md border border-gray-200 px-3 py-1 transition hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900"
          >
            <div className={`rounded-lg p-2 ${selectedMode.bg}`}>
              <ModeIcon size={17} className={selectedMode.color} />
            </div>

            <div className="text-left">
              <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500">
                Energy mode
              </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {mode}
              </p>
            </div>

            <ChevronDown size={15} className="text-gray-500" />
          </button>

          {modeOpen && (
            <div className="absolute left-0 top-full mt-2 w-64 rounded-xl border border-gray-200 bg-white p-2 shadow-xl dark:border-gray-800 dark:bg-gray-900">
              {modes.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      setMode(item.label);
                      setModeOpen(false);
                    }}
                    className="flex w-full items-center gap-3 rounded-xl p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <div className={`rounded-lg p-2 ${item.bg}`}>
                      <Icon size={18} className={item.color} />
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-semibold">
                        {item.label}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.description}
                      </p>
                    </div>

                    {mode === item.label && (
                      <Check size={16} className="text-emerald-600" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Search */}
        <div className="order-last lg:order-none lg:mx-3">
          <div className="flex items-center gap-3 rounded-md border border-gray-200 bg-gray-50 px-4 py-2  dark:border-gray-800 dark:bg-gray-900 w-93 outline-none">
            <Search size={19} className="shrink-0 text-gray-400" />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search devices, usage, analytics..."
              className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-white"
            />

            <kbd className="hidden rounded border border-gray-200 bg-white px-2 py-1 text-xs text-gray-500 dark:border-gray-700 dark:bg-gray-800 sm:block">
              /
            </kbd>
          </div>
        </div>

        {/* Actions */}
        <div className="ml-auto flex shrink-0 items-center gap-1">

          {/* Theme */}
          <button
            onClick={toggleTheme}
            title="Toggle theme"
            aria-label="Toggle theme"
            className="rounded-xl p-3 text-gray-600 transition hover:bg-gray-100 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-900"
          >
            {darkMode ? <Sun size={19} /> : <Moon size={19} />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() =>
                setNotificationsOpen(!notificationsOpen)
              }
              title="Notifications"
              aria-label="Notifications"
              className="relative rounded-xl p-3 text-gray-600 transition hover:bg-gray-100 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-900"
            >
              <Bell size={19} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-gray-950" />
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 top-full mt-3 w-72 rounded-xl border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-800 dark:bg-gray-900">
                <h3 className="font-semibold">Notifications</h3>
                <p className="mt-2 text-sm text-gray-500">
                  You're all caught up. Device alerts will appear here.
                </p>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-gray-100 dark:hover:bg-gray-900"
              aria-label="Open user profile menu"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                <UserRound size={21} />
              </div>

              <ChevronDown
                size={15}
                className="hidden text-gray-500 sm:block"
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-3 w-48 rounded-xl border border-gray-200 bg-white p-2 shadow-xl dark:border-gray-800 dark:bg-gray-900">
                <div className="border-b border-gray-100 px-3 py-2 dark:border-gray-800">
                  <p className="text-sm font-semibold">Home Owner</p>
                  <p className="text-xs text-gray-500">
                    Personal account
                  </p>
                </div>

                <button
                  onClick={() => setProfileOpen(false)}
                  className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <UserRound size={16} /> My Profile
                </button>

                <button
                  onClick={() => setProfileOpen(false)}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Settings size={16} /> Account Settings
                </button>

                <button
                  onClick={() => setProfileOpen(false)}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
}
