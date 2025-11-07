import React, { useState } from 'react';
import type { Shift } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';

interface ShiftInputProps {
  shifts: Shift[];
  setShifts: React.Dispatch<React.SetStateAction<Shift[]>>;
}

const ShiftInput: React.FC<ShiftInputProps> = ({ shifts, setShifts }) => {
  const [name, setName] = useState('');

  const addShift = () => {
    if (name.trim() !== '') {
      setShifts([...shifts, { id: new Date().toISOString(), name: name.trim() }]);
      setName('');
    }
  };

  const removeShift = (id: string) => {
    setShifts(shifts.filter(s => s.id !== id));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <label className="block text-lg font-semibold text-slate-700 mb-2">กะงาน</label>
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addShift()}
          placeholder="เพิ่มกะงาน..."
          className="flex-grow p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          onClick={addShift}
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center"
          aria-label="เพิ่มกะงาน"
        >
          <PlusIcon />
        </button>
      </div>
      <ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
        {shifts.map(s => (
          <li key={s.id} className="flex justify-between items-center bg-slate-100 p-2 rounded-md">
            <span className="text-slate-800">{s.name}</span>
            <button
              onClick={() => removeShift(s.id)}
              className="text-red-500 hover:text-red-700 transition-colors"
              aria-label={`ลบ ${s.name}`}
            >
              <TrashIcon />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShiftInput;
