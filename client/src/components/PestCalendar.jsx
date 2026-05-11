import axios from "axios";
import { useEffect, useState } from "react";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  SubTitle,
} from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, Title, SubTitle);

const PestCalendar = () => {
  const [val, setVal] = useState([]);

  useEffect(() => {
    const getdata = async () => {
      const res = await axios.get("/data/pestJSON.json");
      setVal(res.data);
    };
    getdata();
  }, []);

  const colors = [
    "#ef4444",
    "#3b82f6",
    "#22c55e",
    "#f59e0b",
    "#a855f7",
    "#14b8a6",
  ];

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          font: {
            size: 10,
          },
        },
      },
      title: {
        display: false,
      },
      subtitle: {
        display: false,
      },
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 pb-16 bg-gray-100">
      {val?.map((item, i) => {
        const chartData = {
          labels: item.pests,
          datasets: [
            {
              data: item.pests.map(() => 1),
              backgroundColor: colors,
              borderWidth: 1,
            },
          ],
        };

        return (
          <div
            key={i}
            className="bg-white outline outline-gray-400 rounded-xl p-5 shadow-sm hover:shadow-lg transition h-full"
          >
            <h3 className="text-xl font-bold text-blue-600">
              {item.month.label}
            </h3>
            <div className="my-4 flex justify-center">
              <div className="w-48 h-40">
                <Pie data={chartData} options={options} />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 my-2">
              {item.pests.map((p, i) => (
                <span
                  key={i}
                  className="bg-slate-200 px-2 py-1 rounded text-xs"
                >
                  #{p}
                </span>
              ))}
            </div>

            <p className="italic text-gray-600 text-sm mb-4">"{item.tip}"</p>

            <ul className="space-y-1">
              {item.keys.map((key, i) => (
                <li key={i} className="text-sm flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  {key}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default PestCalendar;
