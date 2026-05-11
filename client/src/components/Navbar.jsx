import React, { useRef, useState } from "react";
import { FaMosquito } from "react-icons/fa6";
import { motion } from "motion/react";

function Navbar() {
  const [isHovered, setIsHovered] = useState(false);
  const btnRef = useRef(null);

  // const handleIn = () => {
  //   btnRef.current.textContent = "📞 9999999999";
  //   btnRef.current.style.transition = `all .5s ease`
  // };

  // const handleLeave = () => {
  //   btnRef.current.textContent = "Book Now";
  // };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-700 shadow-lg">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 place-items-center px-6 py-4 text-white relative">

        {/* Logo */}
        <div className="text-2xl md:text-3xl font-bold tracking-wide flex items-center mr-auto">
          <FaMosquito className="text-green-400" />
          <span className="text-green-400 ml-2">Pest</span>-Index
        </div>

        {/* Navigation */}
        <ul className="hidden md:flex gap-8 text-sm font-medium">
          <li className="cursor-pointer hover:text-green-400 transition">
            Home
          </li>

          <li className="cursor-pointer hover:text-green-400 transition">
            Services
          </li>

          <li className="cursor-pointer hover:text-green-400 transition">
            Contact
          </li>
        </ul>
        <div className="relative">
          <motion.button
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="min-w-35 px-4 py-2 ml-auto rounded-lg font-semibold bg-linear-to-r from-green-500 to-emerald-400 text-slate-900 shadow-md"
          >
            <motion.span
              key={isHovered ? "phone" : "book"}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {isHovered ? "📞 9999999999" : "Book Now"}
            </motion.span>
          </motion.button>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;