import React, { useEffect, useState } from "react";
import ChartComponent from "./ChartComponent";
import { useMyStore } from "../store/store";


function PestTrend({ children }) {

  const [value, setValue] = useState("");

  const setJsonData = useMyStore((state) => state.setJsonData);
  const jsonData = useMyStore((state) => state.jsonData);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    setJsonData();
  }, []);

  const selectedCity = jsonData?.find((city) => city.city === value);
  return (
    <>
      {children}
      <div className="flex items-center gap-4 mb-8 justify-center">
        <label className="font-semibold text-slate-700">Select city:</label>

        <select
          onChange={handleChange}
          className="px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white" >
          <option value="">--Select--</option>

          {jsonData?.map((city, i) => (
            <option key={i} value={city.city}>
              {city.city}
            </option>
          ))}
        </select>
      </div>

      <section className="grid gap-6 place-items-center w-full">

        {selectedCity && <ChartComponent data={selectedCity} />}

      </section>

    </>
  );
}

export default PestTrend;