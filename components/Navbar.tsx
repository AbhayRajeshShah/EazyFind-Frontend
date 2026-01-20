import React from "react";
import Image from "next/image";

const Navbar = () => {
  return (
    <nav className="px-12 py-6 bg-[#4a2e2a] rounded-b-lg">
      <img src={"./logo_bg.png"} alt="Logo" className="w-72" />
    </nav>
  );
};

export default Navbar;
