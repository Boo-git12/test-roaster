import React from 'react';
import type { ScheduleDay } from '../types';

interface ScheduleViewProps {
  schedule: ScheduleDay[] | null;
  isLoading: boolean;
}

const LoadingSkeleton: React.FC = () => (
  <div className="animate-pulse space-y-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="bg-slate-200 rounded-lg p-4">
        <div className="h-6 bg-slate-300 rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-300 rounded p-3 h-24"></div>
          <div className="bg-slate-300 rounded p-3 h-24"></div>
          <div className="bg-slate-300 rounded p-3 h-24"></div>
        </div>
      </div>
    ))}
  </div>
);

const EmptyState: React.FC = () => (
    <div className="text-center py-16 px-6 bg-white rounded-lg shadow">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 className="mt-2 text-xl font-medium text-slate-800">รอการสร้างตารางเวร</h3>
        <p className="mt-1 text-slate-500">กรอกข้อมูลด้านซ้ายแล้วกด "สร้างตารางเวร" เพื่อเริ่มต้น</p>
    </div>
);

const ScheduleView: React.FC<ScheduleViewProps> = ({ schedule, isLoading }) => {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!schedule || schedule.length === 0) {
    return <EmptyState />;
  }
  
  // Get all unique shift names for table headers
  const shiftNames = schedule.length > 0 
    ? schedule[0].shifts.map(shift => shift.shiftName) 
    : [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white p-1 md:p-4 rounded-lg shadow-md overflow-x-auto">
      <table className="w-full min-w-[600px] border-collapse text-left">
        <thead className="border-b-2 border-slate-200">
          <tr>
            <th className="p-3 text-sm font-semibold text-slate-700 bg-slate-100 rounded-tl-lg">
              วันที่
            </th>
            {shiftNames.map((name) => (
              <th key={name} className="p-3 text-sm font-semibold text-slate-700 bg-slate-100 last:rounded-tr-lg">
                {name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {schedule.map((day) => (
            <tr key={day.date} className="border-b border-slate-200 last:border-b-0 hover:bg-slate-50 transition-colors">
              <td className="p-3 font-medium text-slate-800 whitespace-nowrap">
                {formatDate(day.date)}
              </td>
              {shiftNames.map((shiftName) => {
                const shift = day.shifts.find(s => s.shiftName === shiftName);
                return (
                  <td key={shiftName} className="p-3 align-top">
                    {shift && shift.personnel.length > 0 ? (
                      <ul className="space-y-1 text-sm text-slate-700">
                        {shift.personnel.map((person, pIndex) => (
                          <li key={pIndex}>{person}</li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-slate-400 italic text-sm">ไม่มีผู้ปฏิบัติงาน</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleView;
