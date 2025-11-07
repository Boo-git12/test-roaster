import React, { useState, useCallback } from 'react';
import type { Personnel, Shift, ScheduleDay } from './types';
import { generateSchedule } from './services/geminiService';
import Header from './components/Header';
import PersonnelInput from './components/PersonnelInput';
import ShiftInput from './components/ShiftInput';
import ConstraintsInput from './components/ConstraintsInput';
import ScheduleView from './components/ScheduleView';
import { CalendarIcon } from './components/icons/CalendarIcon';

const App: React.FC = () => {
  const [personnel, setPersonnel] = useState<Personnel[]>([
    { id: '1', name: 'นพ. สมชาย (แพทย์)' },
    { id: '2', name: 'พญ. สมศรี (แพทย์)' },
    { id: '3', name: 'คุณมาลี (พยาบาล)' },
    { id: '4', name: 'คุณมานะ (พยาบาล)' },
    { id: '5', name: 'คุณปิติ (พยาบาล)' },
    { id: '6', name: 'คุณวิชัย (เทคนิคการแพทย์)' },
  ]);
  const [shifts, setShifts] = useState<Shift[]>([
    { id: 's1', name: 'เวรเช้า (8:00-16:00)' },
    { id: 's2', name: 'เวรบ่าย (16:00-00:00)' },
    { id: 's3', name: 'เวรดึก (00:00-8:00)' },
  ]);
  const [constraints, setConstraints] = useState<string>('- แพทย์ 1 คน และพยาบาล 2 คนในเวรเช้าและบ่าย\n- แพทย์ 1 คน พยาบาล 1 คน และเทคนิคการแพทย์ 1 คนในเวรดึก\n- นพ. สมชาย ไม่สามารถทำงานวันเสาร์-อาทิตย์ได้\n- คุณมาลี ขอลงเวรดึกเป็นหลัก\n- ทุกคนควรได้วันหยุดอย่างน้อย 2 วันต่อสัปดาห์\n- ห้ามจัดเวรเช้าต่อจากเวรดึกของวันก่อนหน้า');
  
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 6);
  
  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  const [startDate, setStartDate] = useState<string>(formatDate(today));
  const [endDate, setEndDate] = useState<string>(formatDate(nextWeek));
  
  const [schedule, setSchedule] = useState<ScheduleDay[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateSchedule = useCallback(async () => {
    if (personnel.length === 0 || shifts.length === 0 || !startDate || !endDate) {
      setError('กรุณากรอกข้อมูลบุคลากร, กะงาน, และช่วงวันที่ให้ครบถ้วน');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSchedule(null);

    try {
      const generated = await generateSchedule(personnel, shifts, constraints, startDate, endDate);
      setSchedule(generated);
    } catch (err) {
      console.error(err);
      setError('เกิดข้อผิดพลาดในการสร้างตารางเวร กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  }, [personnel, shifts, constraints, startDate, endDate]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Header />
      <main className="p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {/* Input Column */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-slate-700 border-b-2 border-blue-500 pb-2">ข้อมูลสำหรับจัดเวร</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-slate-600 mb-1">วันที่เริ่มต้น</label>
              <input 
                type="date" 
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-slate-600 mb-1">วันที่สิ้นสุด</label>
              <input 
                type="date" 
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <PersonnelInput personnel={personnel} setPersonnel={setPersonnel} />
          <ShiftInput shifts={shifts} setShifts={setShifts} />
          <ConstraintsInput constraints={constraints} setConstraints={setConstraints} />
          
          <button
            onClick={handleGenerateSchedule}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                กำลังประมวลผล...
              </>
            ) : (
              <>
                <CalendarIcon />
                สร้างตารางเวร
              </>
            )}
          </button>
        </div>

        {/* Output Column */}
        <div className="lg:col-span-2">
           <h2 className="text-2xl font-bold text-slate-700 border-b-2 border-green-500 pb-2 mb-6">ตารางเวรที่สร้างขึ้น</h2>
           {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4" role="alert">{error}</div>}
           <ScheduleView schedule={schedule} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
};

export default App;
