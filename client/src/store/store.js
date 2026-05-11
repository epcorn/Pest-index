import { create } from "zustand";
import axios from "axios";
import { calculatePestIndex } from "../../../utils/dataCalculator";

export const useMyStore = create((set, get) => ({
  weather: {},
  mosqIndex: [],
  pestIndices: {},
  pestData: {},

  loading: false,
  err: null,

  getCurrWeather: async (city, coords) => {
    let url = "v1/weather?";

    try {
      set({ loading: true, err: null });
      if (city) {
        url += `city=${city}`;
      } else if (coords?.lat && coords?.lon) {
        url += `lat=${coords.lat}&lon=${coords.lon}`;
      }
      const res = await axios.get(url);
      const data = res.data;

      const weatherData = {
        temp: data?.main?.temp,
        humidity: data?.main?.humidity,
        wind: Number((data?.wind?.speed * 3.6).toFixed(2)),
        rain: data?.rain?.["1h"] || 0,
        condition: data?.weather?.[0].main,
        cloud: data?.clouds?.all,
        country: data?.sys?.country,
        name: data?.name,
      };
      set({ loading: false, err: null });
      get().setWeather(weatherData);
    } catch (error) {
      const errorMessage =
        error.response?.data?.msg || error.message || "Something went wrong";
      set({ err: errorMessage, loading: false });
    }
  },
  setWeather: (data) => {
    const pestData = calculatePestIndex({
      temp: data.temp,
      humidity: data.humidity,
      rain: data.rain || 0,
      rain7d: data.rain7d || 0,
      wind: data.wind || 0,
      clouds: data.cloud,
      areaType: 'mixed'
    });

    set({
      weather: { ...pestData, data },
    });
  },

  jsonData: [],
  setJsonData: async () => {
    const res = await axios.get(`/data/pestData.json`);
    const data = res.data;
    set({ jsonData: data });
  },

  debounce: (fn, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  },
}));
