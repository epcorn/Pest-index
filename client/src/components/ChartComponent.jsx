import {
 Chart as ChartJS,
 CategoryScale,
 LinearScale,
 BarElement,
 Title,
 Tooltip,
 Legend,
} from "chart.js";
import { FaMosquito } from "react-icons/fa6";
import { GiAnt } from "react-icons/gi";
import { SiCockroachlabs } from "react-icons/si";
import { MdOutlinePestControlRodent } from "react-icons/md";

import { Bar } from "react-chartjs-2";


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const months = [
 "Jan", "Feb", "Mar", "Apr", "May", "Jun",
 "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

function ChartComponent({ data }) {

 const pests = data?.pests || [];

 const colors = {
  mosquito: "rgba(255,99,132,0.5)",
  termite: "rgba(54,162,235,0.5)",
  cockroach: "rgba(255,206,86,0.5)",
  rodent: "rgba(75,192,192,0.5)",
 };

 function icons(name) {
  if (name == "mosquito") {
   return (<><FaMosquito /> {name}</>);
  }
  if (name == "termite") {
   return (<><GiAnt /> {name}</>);
  }
  if (name == "cockroach") {
   return (<><SiCockroachlabs /> {name}</>);
  }
  if (name == "rodent") {
   return (<><MdOutlinePestControlRodent /> {name}</>);
  }
 }

 return (
  <>
   <h2 className="text-2xl font-semibold underline mb-3 text-center">{data.city}</h2>
   <div className="">
    <CurrentRisk pests={pests} />
   </div>

   <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 rounded-2xl shadow-xl border border-gray-200">
    {pests.map((pest, i) => {
     const chartData = {
      labels: months,
      datasets: [
       {
        label: pest.name,
        data: pest.data,
        backgroundColor: colors[pest.name] || "rgba(100,100,100,0.5)",
        borderWidth: 1,
       },
      ],
     };

     return (
      <div key={i} className="p-4 rounded-xl transition bg-white hover:shadow-lg hover:scale-[1.02]">
       <h3 className="text-sm font-semibold capitalize text-center mb-2 flex justify-center items-center gap-3 ">
        {icons(pest.name)} Activity
       </h3>

       <Bar data={chartData} />
      </div>
     );
    })}
   </div>
  </>
 );
}

export default ChartComponent;

export function CurrentRisk({ pests }) {
 const now = new Date()
 const currentMonth = now.getMonth();

 const currentValues = pests.map(p => ({ name: p.name, value: p.data[currentMonth] }))
 const highest = Math.max(...currentValues.map(p => p.value));
 const highestArr = currentValues.filter(c => c.value === highest ? c.name : "");
 return (
  <div className="flex items-center gap-5 mb-6">
   <h3 className="text-lg font-semibold text-slate-700">
    Current Month Pest Trend
   </h3>
   <div
    className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-1 rounded-full font-semibold shadow-sm" >
    {highestArr?.[0].name}
    <span className="text-sm">
     {highestArr?.[0].value}%
    </span>
   </div>
  </div>
 )
}