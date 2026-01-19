import React from "react";
import Image from "next/image";

const Navbar = () => {
  return (
    <nav className="px-12 py-6 bg-white rounded-lg">
      <img src={"./logo.png"} alt="Logo" className="w-72" />
    </nav>
  );
};

export default Navbar;
