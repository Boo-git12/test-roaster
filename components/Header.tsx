import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-blue-600">เวรยาม - Medical Shift Scheduler</h1>
            <p className="text-slate-500 text-sm">ผู้ช่วยจัดตารางเวรอัจฉริยะด้วย Gemini AI</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
