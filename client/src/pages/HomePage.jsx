import HeroImg from "../components/HeroImg";
import HowItWorks from "../components/HowItWorks";
import Livedata from "../components/Livedata";
import Navbar from "../components/Navbar";
import PestCalendar from "../components/PestCalendar";
import PestTrend from "../components/PestTrend";

function HomePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* hero image */}
        <HeroImg />
        {/* hero image */}

        <Livedata />
        <section className="relative z-10 py-12 px-5">
          <div className="mx-auto bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-5 pb-10">
            <PestTrend>
              <h2 className="text-3xl font-semibold text-center text-slate-800">
                Monthly Pest Trend
              </h2>
              <p className="mx-5 mb-10 text-center">
                Pest trend is about which insects are actively high currently.
                And it is calculated based on current temperature and humidity.
              </p>
            </PestTrend>
          </div>
        </section>

        <PestCalendar />
        <section className="bg-primary-light">
          <HowItWorks />
        </section>
      </main>
    </>
  );
}

export default HomePage;
