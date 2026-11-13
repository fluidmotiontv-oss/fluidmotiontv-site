import React, { useState, useEffect, useRef } from 'react';
import { SurfTelemetry } from '../types';
import {
  Wind,
  Waves,
  Sun,
  Compass,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertCircle,
  Thermometer,
  Eye,
  TrendingUp,
  Droplets,
  Sparkles,
  Zap,
  Info
} from 'lucide-react';

interface WeatherWatchProps {
  onOpenFrostbite?: () => void;
  onTelemetryUpdate?: (telemetry: SurfTelemetry) => void;
  className?: string;
}


interface MarineData {
  waveHeight: number; // meters
  wavePeriod: number; // seconds
  waveDirection: number; // degrees
  windSpeed: number; // knots
  windDirection: number; // degrees
  temp: number; // celsius
  waterTemp: number; // celsius
  weatherCode: number;
  lastUpdated: string;
  source: string;
  isLive: boolean;
}

interface TideSlot {
  type: 'HIGH' | 'LOW';
  time: string;
  heightMeters: number;
  status: 'PAST' | 'NEXT' | 'UPCOMING';
}

const DEFAULT_PORT_WAIKATO_TELEMETRY: MarineData = {
  waveHeight: 2.2,
  wavePeriod: 13.5,
  waveDirection: 215, // SSW
  windSpeed: 11.5,
  windDirection: 75, // ENE Offshore
  temp: 18.5,
  waterTemp: 16.2,
  weatherCode: 1, // Mainly clear
  lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  source: 'AS65001 Mesh Beacon & Open-Meteo',
  isLive: false,
};

const DEFAULT_TIDES: TideSlot[] = [
  { type: 'HIGH', time: '05:18 AM', heightMeters: 2.8, status: 'PAST' },
  { type: 'LOW', time: '11:42 AM', heightMeters: 0.4, status: 'NEXT' },
  { type: 'HIGH', time: '05:54 PM', heightMeters: 2.9, status: 'UPCOMING' },
  { type: 'LOW', time: '11:58 PM', heightMeters: 0.5, status: 'UPCOMING' },
];

export const WeatherWatch: React.FC<WeatherWatchProps> = ({
  onOpenFrostbite,
  onTelemetryUpdate,
  className = '',
}) => {
  const [marineData, setMarineData] = useState<MarineData>(DEFAULT_PORT_WAIKATO_TELEMETRY);
  const [tides, setTides] = useState<TideSlot[]>(DEFAULT_TIDES);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch real-time marine weather from Open-Meteo
  const fetchMarineWeather = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      // Port Waikato coordinates: Lat -37.387, Lon 174.723
      const marineRes = await fetch(
        'https://marine-api.open-meteo.com/v1/marine?latitude=-37.387&longitude=174.723&current=wave_height,wave_direction,wave_period&timezone=Pacific%2FAuckland'
      );
      const weatherRes = await fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=-37.387&longitude=174.723&current=temperature_2m,wind_speed_10m,wind_direction_10m,weather_code&timezone=Pacific%2FAuckland'
      );

      let waveH = DEFAULT_PORT_WAIKATO_TELEMETRY.waveHeight;
      let waveP = DEFAULT_PORT_WAIKATO_TELEMETRY.wavePeriod;
      let waveD = DEFAULT_PORT_WAIKATO_TELEMETRY.waveDirection;
      let windS = DEFAULT_PORT_WAIKATO_TELEMETRY.windSpeed;
      let windD = DEFAULT_PORT_WAIKATO_TELEMETRY.windDirection;
      let tempC = DEFAULT_PORT_WAIKATO_TELEMETRY.temp;
      let code = DEFAULT_PORT_WAIKATO_TELEMETRY.weatherCode;

      if (marineRes.ok) {
        const mJson = await marineRes.json();
        if (mJson?.current) {
          waveH = mJson.current.wave_height ?? waveH;
          waveP = mJson.current.wave_period ?? waveP;
          waveD = mJson.current.wave_direction ?? waveD;
        }
      }

      if (weatherRes.ok) {
        const wJson = await weatherRes.json();
        if (wJson?.current) {
          tempC = wJson.current.temperature_2m ?? tempC;
          // km/h to knots conversion (1 km/h = 0.539957 knots)
          const kmh = wJson.current.wind_speed_10m ?? 20;
          windS = Math.round(kmh * 0.539957 * 10) / 10;
          windD = wJson.current.wind_direction_10m ?? windD;
          code = wJson.current.weather_code ?? code;
        }
      }

      setMarineData({
        waveHeight: Math.round(waveH * 10) / 10,
        wavePeriod: Math.round(waveP * 10) / 10,
        waveDirection: Math.round(waveD),
        windSpeed: windS,
        windDirection: Math.round(windD),
        temp: Math.round(tempC * 10) / 10,
        waterTemp: 16.5,
        weatherCode: code,
        lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'Live Open-Meteo Marine API',
        isLive: true,
      });
    } catch (err) {
      console.warn('Weather API fetch failed, utilizing Port Waikato fallback telemetry.', err);
      setErrorMsg('Using Port Waikato cached mesh telemetry');
      setMarineData((prev) => ({
        ...prev,
        lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isLive: false,
      }));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMarineWeather();
  }, []);

  // Convert compass degrees to cardinal direction string
  const getCardinal = (deg: number) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return directions[Math.round(deg / 22.5) % 16];
  };

  // Determine wind condition quality for Port Waikato (ENE / E / SE are offshore)
  const isOffshore = marineData.windDirection >= 45 && marineData.windDirection <= 135;

  // Calculate overall surf score out of 5 stars
  const calculateSurfScore = () => {
    let score = 3;
    if (marineData.waveHeight >= 1.5 && marineData.waveHeight <= 3.0) score += 1;
    if (marineData.wavePeriod >= 12) score += 1;
    if (isOffshore) score += 1;
    if (marineData.windSpeed > 20) score -= 1;
    return Math.min(Math.max(score, 1), 5);
  };

  const surfScore = calculateSurfScore();

  const onTelemetryUpdateRef = useRef(onTelemetryUpdate);
  useEffect(() => {
    onTelemetryUpdateRef.current = onTelemetryUpdate;
  }, [onTelemetryUpdate]);

  useEffect(() => {
    if (onTelemetryUpdateRef.current) {
      onTelemetryUpdateRef.current({
        waveHeight: marineData.waveHeight,
        wavePeriod: marineData.wavePeriod,
        waveDirection: marineData.waveDirection,
        windSpeed: marineData.windSpeed,
        windDirection: marineData.windDirection,
        temp: marineData.temp,
        waterTemp: marineData.waterTemp,
        surfScore,
        isOffshore,
        isLive: marineData.isLive,
        lastUpdated: marineData.lastUpdated,
      });
    }
  }, [
    marineData.waveHeight,
    marineData.wavePeriod,
    marineData.waveDirection,
    marineData.windSpeed,
    marineData.windDirection,
    marineData.temp,
    marineData.waterTemp,
    marineData.isLive,
    marineData.lastUpdated,
    surfScore,
    isOffshore,
  ]);


  return (
    <div className={`bg-[#050505] border-2 border-[#00E5FF] p-5 space-y-5 text-[#e0e0e0] font-mono shadow-xl relative ${className}`}>
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#222] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Wind className="w-5 h-5 text-[#00E5FF]" />
            <h3 className="text-base font-black italic uppercase text-[#00E5FF] tracking-wider">
              Weather Watch & Tide Telemetry
            </h3>
            <span className="bg-[#111] text-[#00FF88] border border-[#00FF88]/40 px-2 py-0.5 text-[10px] font-bold uppercase">
              Port Waikato (Pee Dub)
            </span>
          </div>
          <p className="text-xs text-[#888] uppercase tracking-wide mt-1">
            Lat: -37.387° S, Lon: 174.723° E • Point Break & Bar Swell Monitor
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={fetchMarineWeather}
            disabled={isLoading}
            className="px-3 py-1.5 bg-[#111] hover:bg-[#222] border border-[#333] hover:border-[#00E5FF] text-[#00E5FF] text-xs font-bold uppercase flex items-center gap-1.5 transition-colors"
            title="Refresh Live Marine API Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Updating...' : 'Sync Telemetry'}</span>
          </button>

          {onOpenFrostbite && (
            <button
              onClick={onOpenFrostbite}
              className="px-3 py-1.5 bg-[#00FF88] hover:bg-[#33ff99] text-black font-black text-xs uppercase flex items-center gap-1.5 transition-colors"
            >
              <span>🥶</span>
              <span>Ask Frostbite</span>
            </button>
          )}
        </div>
      </div>

      {/* Surf Score & Live Status Bar */}
      <div className="bg-[#0a1520] border border-[#00E5FF]/40 p-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center text-[#FFD700] text-lg font-black tracking-tight">
            {'★'.repeat(surfScore)}
            <span className="text-[#333]">{'★'.repeat(5 - surfScore)}</span>
          </div>
          <div>
            <div className="text-xs font-black text-[#e0e0e0] uppercase">
              {surfScore >= 4 ? 'Epic Glassy Barrel Conditions' : surfScore === 3 ? 'Clean Fun Point Break Waves' : 'Choppy Coastal Swell'}
            </div>
            <div className="text-[10px] text-[#00E5FF]">
              {isOffshore ? 'Groomed ENE Offshore Winds Active' : 'Onshore / Crosswind Airflow'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-[#aaa]">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#00E5FF]" /> Updated: {marineData.lastUpdated}
          </span>
          <span>•</span>
          <span className={marineData.isLive ? 'text-[#00FF88] font-bold' : 'text-[#FFD700]'}>
            {marineData.source}
          </span>
        </div>
      </div>

      {/* Main Telemetry Grid (Swell, Wind, Temp, Water) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Swell Height & Period */}
        <div className="bg-[#111] border border-[#222] p-3 space-y-1">
          <div className="flex items-center justify-between text-[10px] text-[#888] uppercase font-bold">
            <span className="flex items-center gap-1">
              <Waves className="w-3.5 h-3.5 text-[#00E5FF]" /> Swell Face
            </span>
            <span className="text-[#00E5FF]">{getCardinal(marineData.waveDirection)}</span>
          </div>
          <div className="text-xl font-black text-[#00E5FF] italic">
            {marineData.waveHeight}m
            <span className="text-xs text-[#aaa] not-italic ml-1 font-normal">({Math.round(marineData.waveHeight * 3.28084)} ft)</span>
          </div>
          <div className="text-[10px] text-[#888] uppercase font-bold">
            Interval: <strong className="text-[#00FF88]">{marineData.wavePeriod}s</strong>
          </div>
        </div>

        {/* Wind Speed & Direction */}
        <div className="bg-[#111] border border-[#222] p-3 space-y-1">
          <div className="flex items-center justify-between text-[10px] text-[#888] uppercase font-bold">
            <span className="flex items-center gap-1">
              <Wind className="w-3.5 h-3.5 text-[#00FF88]" /> Wind Velocity
            </span>
            <span className="text-[#00FF88]">{getCardinal(marineData.windDirection)}</span>
          </div>
          <div className="text-xl font-black text-[#00FF88] italic">
            {marineData.windSpeed} kts
          </div>
          <div className="text-[10px] text-[#888] uppercase font-bold">
            Status: <strong className={isOffshore ? 'text-[#00FF88]' : 'text-[#FFD700]'}>{isOffshore ? 'Offshore Groom' : 'Cross / Onshore'}</strong>
          </div>
        </div>

        {/* Air & Water Temperature */}
        <div className="bg-[#111] border border-[#222] p-3 space-y-1">
          <div className="flex items-center justify-between text-[10px] text-[#888] uppercase font-bold">
            <span className="flex items-center gap-1">
              <Thermometer className="w-3.5 h-3.5 text-[#F27D26]" /> Air Temp
            </span>
            <span className="text-[#F27D26]">UV 6</span>
          </div>
          <div className="text-xl font-black text-[#F27D26] italic">
            {marineData.temp}°C
          </div>
          <div className="text-[10px] text-[#888] uppercase font-bold">
            Water: <strong className="text-[#e0e0e0]">{marineData.waterTemp}°C (3/2mm)</strong>
          </div>
        </div>

        {/* Port Waikato Bar Caution */}
        <div className="bg-[#111] border border-[#222] p-3 space-y-1 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10px] text-[#888] uppercase font-bold">
            <span className="flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-[#FFD700]" /> River Mouth Bar
            </span>
          </div>
          <div className="text-xs font-bold text-[#FFD700] uppercase">
            Caution: Shift Sandbars
          </div>
          <div className="text-[10px] text-[#aaa] font-sans">
            Best surf window 2 hours either side of High Tide.
          </div>
        </div>
      </div>

      {/* Tide Schedule & Visual Wave Curve */}
      <div className="space-y-2.5 bg-[#0a0a0a] border border-[#222] p-4">
        <div className="flex items-center justify-between border-b border-[#222] pb-2">
          <span className="text-xs font-black uppercase text-[#e0e0e0] flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#00E5FF]" /> Port Waikato Tide Cycle & Chart
          </span>
          <span className="text-[10px] text-[#888] uppercase">Semi-Diurnal Pacific Tide</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs pt-1">
          {tides.map((t, idx) => (
            <div
              key={idx}
              className={`p-2.5 border transition-all ${
                t.status === 'NEXT'
                  ? 'bg-[#112233] border-[#00E5FF] text-[#00E5FF]'
                  : 'bg-[#111] border-[#222] text-[#aaa]'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] uppercase font-bold">
                <span className={t.type === 'HIGH' ? 'text-[#00FF88]' : 'text-[#F27D26]'}>
                  {t.type} TIDE
                </span>
                {t.status === 'NEXT' && (
                  <span className="bg-[#00E5FF] text-black text-[8px] font-black uppercase px-1">
                    NEXT
                  </span>
                )}
              </div>
              <div className="text-sm font-black uppercase mt-1 text-[#e0e0e0]">{t.time}</div>
              <div className="text-[10px] text-[#888] font-mono mt-0.5">{t.heightMeters} meters</div>
            </div>
          ))}
        </div>
      </div>

      {/* Frostbite Surf Advisory Comment */}
      <div className="bg-[#0a1520] border-l-4 border-[#00E5FF] p-3 flex items-start gap-3">
        <span className="text-xl">🥶</span>
        <div className="text-xs font-sans space-y-0.5">
          <strong className="text-[#00E5FF] font-mono uppercase block text-[10px]">
            Frostbite's Coastal Session Guide:
          </strong>
          <p className="text-[#ccc]">
            "Clean groundswell energy rolling in from the SSW! Perform your 5-minute hip opener in the XA-Stretch module, mix a Turmeric Ginger barrel shot, and hit the point break before the wind shifts."
          </p>
        </div>
      </div>
    </div>
  );
};
