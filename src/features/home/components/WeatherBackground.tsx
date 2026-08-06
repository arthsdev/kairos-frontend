export function WeatherBackground() {
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {/* 1. Light Ambient Glow */}
            <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-sky-600/15 via-emerald-600/5 to-transparent blur-[140px] rounded-full" />

            {/* 2. Meteorological Radar Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b22_1px,transparent_1px),linear-gradient(to_bottom,#1e293b22_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_70%,transparent_100%)] opacity-80" />

            {/* 3. Atmospheric Rain Lines / Telemetry Streams */}
            <div className="absolute inset-0 opacity-25">
                <div className="weather-rain-line top-[-10%] left-[15%] h-32 w-[1px] bg-gradient-to-b from-transparent via-sky-400 to-transparent animate-rain-drop" />
                <div className="weather-rain-line top-[-10%] left-[38%] h-44 w-[1px] bg-gradient-to-b from-transparent via-emerald-400 to-transparent animate-rain-drop [animation-delay:1.2s] [animation-duration:3.2s]" />
                <div className="weather-rain-line top-[-10%] left-[62%] h-40 w-[1px] bg-gradient-to-b from-transparent via-sky-300 to-transparent animate-rain-drop [animation-delay:0.6s] [animation-duration:2.8s]" />
                <div className="weather-rain-line top-[-10%] left-[84%] h-36 w-[1px] bg-gradient-to-b from-transparent via-sky-400 to-transparent animate-rain-drop [animation-delay:2.1s] [animation-duration:3.5s]" />
            </div>

            {/* 4. Radial Vignette */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#07090e]/50 to-[#07090e]" />
        </div>
    )
}