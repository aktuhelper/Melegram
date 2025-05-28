import React from 'react';

const Header = () => {
  return (
    <div className="w-full bg-[#0F0F0F] text-white p-4 flex justify-start items-center fixed top-0 z-10 md:hidden">
      <h1 className="text-2xl font-bold text-[#FF6F61]" style={{ fontFamily: 'Pacifico, cursive' }}>
        ChatSphere
      </h1>
    </div>
  );
};

export default Header;
