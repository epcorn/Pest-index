/*eslint-disable */
import { useEffect, useMemo, useState } from "react";
import { debounce } from 'lodash'
import { useMyStore } from "../store/store";

function Livedata() {
  const [value, setValue] = useState("");
  const getCurrWeather = useMyStore((state) => state.getCurrWeather);
  const weather = useMyStore((state) => state.weather);
  const err = useMyStore((state) => state.err);
  const loading = useMyStore((state) => state.loading);

  useEffect(() => {
    if (!value) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          getCurrWeather(null, { lat: latitude, lon: longitude });
        },
        (error) => console.error("Geolocation Error:", error)
      );
    }
  }, []);

  const weatherMetrics = [
    { label: 'Temperature', value: weather?.data?.temp, unit: '°C', score: weather?.environment?.tempScore, color: 'bg-amber-400' },
    { label: 'Humidity', value: weather?.data?.humidity, unit: '%', score: weather?.environment?.humidityScore, color: 'bg-blue-400' },
    { label: 'Rain', value: weather?.data?.rain || 0, unit: 'mm', score: weather?.environment?.rainScore, color: 'bg-indigo-400' },
    { label: 'Wind Speed', value: weather?.data?.wind, unit: 'km/h', score: weather?.environment?.windScore, color: 'bg-teal-400' },
  ];

  const debouncedFetch = useMemo(
    () => debounce((city) => {
      if (city && city.length > 1) {
        getCurrWeather(city);
      }
    }, 500),
    [getCurrWeather]
  );
  console.log(weather)

  const handleChange = (e) => {
    const nextValue = e.target.value;
    setValue(nextValue);
    debouncedFetch(nextValue);
  };

  // Helper for color coding based on risk level
  const getRiskColor = (level) => {
    switch (level) {
      case "Very High": return "text-red-600 border-red-200 bg-red-50";
      case "High": return "text-orange-600 border-orange-200 bg-orange-50";
      case "Moderate": return "text-yellow-600 border-yellow-200 bg-yellow-50";
      default: return "text-green-600 border-green-200 bg-green-50";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 min-h-screen">
      {/* --- Header & Search Section --- */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Pest Forecast</h2>
          <p className="text-gray-500 flex items-center gap-1">
            {err ? err : (loading ? "Detecting location..." : `${weather?.data?.name}, ${weather?.data?.country}`)}
          </p>
        </div>
        <div className="relative">
          <input
            type="text"
            value={value}
            placeholder="Search city..."
            onChange={handleChange}
            className="w-full md:w-80 pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>

      {err && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center font-medium border border-red-100">
          {err}
        </div>
      )}

      {weather?.pests && (
        <div className="flex flex-col gap-8">
          {/* --- TOP SECTION: PPI & PESTS --- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* LEFT: PPI Hero Gauge */}
            <div className="lg:col-span-4 bg-zinc-900 rounded-3xl p-8 text-center text-white flex flex-col justify-center items-center shadow-xl border border-white/5">
              <h4 className="text-zinc-500 uppercase tracking-widest text-[10px] font-bold mb-4">Overall Risk (PPI)</h4>
              <div className="relative flex flex-col items-center justify-center">
                <span className="text-7xl font-black">{weather.ppi?.score}</span>
                <span className="mt-4 text-xs font-bold px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md uppercase tracking-wider">
                  {weather.ppi?.level}
                </span>
              </div>
              <p className="mt-8 text-zinc-500 text-[11px] italic leading-relaxed max-w-50">
                "Based on current temperature, humidity, and wind patterns."
              </p>
            </div>

            {/* RIGHT: Pest Grid */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {weather.pests.map((pest) => (
                <div
                  key={pest.name}
                  className={`p-5 rounded-2xl border transition-all hover:shadow-lg flex flex-col items-center justify-center text-center ${getRiskColor(pest.level)}`}
                >
                  <img
                    src={pest.icon}
                    alt={pest.name}
                    className={`h-12 w-12 mb-3 transition-opacity duration-500 ${pest.level === "Low" ? "opacity-30 grayscale" : "opacity-100"}`}
                  />
                  <span className="text-[10px] uppercase tracking-tighter opacity-60 font-bold">{pest.name}</span>
                  <div className="text-2xl font-black leading-none my-1">{pest.score}</div>
                  <div className="text-[9px] font-bold uppercase tracking-widest">{pest.level}</div>
                </div>
              ))}
            </div>
          </div>

          {/* --- BOTTOM SECTION: WEATHER METRICS --- */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {weatherMetrics.map((metric) => (
              <div key={metric.label} className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-all">
                <p className="text-[10px] uppercase tracking-wider font-bold text-zinc-400 mb-2">{metric.label}</p>
                <div className="flex flex-col gap-3">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-zinc-800">{metric.value}</span>
                    <span className="text-xs font-bold text-zinc-400">{metric.unit}</span>
                  </div>
                  <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${metric.color} rounded-full transition-all duration-1000 ease-out`}
                      style={{ width: `${metric.score}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

export default Livedata;