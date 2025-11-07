import React, { useState } from 'react';
import type { Personnel } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';

interface PersonnelInputProps {
  personnel: Personnel[];
  setPersonnel: React.Dispatch<React.SetStateAction<Personnel[]>>;
}

const PersonnelInput: React.FC<PersonnelInputProps> = ({ personnel, setPersonnel }) => {
  const [name, setName] = useState('');

  const addPersonnel = () => {
    if (name.trim() !== '') {
      setPersonnel([...personnel, { id: new Date().toISOString(), name: name.trim() }]);
      setName('');
    }
  };

  const removePersonnel = (id: string) => {
    setPersonnel(personnel.filter(p => p.id !== id));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <label className="block text-lg font-semibold text-slate-700 mb-2">รายชื่อบุคลากร</label>
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addPersonnel()}
          placeholder="เพิ่มชื่อและตำแหน่ง..."
          className="flex-grow p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          onClick={addPersonnel}
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center"
          aria-label="เพิ่มบุคลากร"
        >
          <PlusIcon />
        </button>
      </div>
      <ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
        {personnel.map(p => (
          <li key={p.id} className="flex justify-between items-center bg-slate-100 p-2 rounded-md">
            <span className="text-slate-800">{p.name}</span>
            <button
              onClick={() => removePersonnel(p.id)}
              className="text-red-500 hover:text-red-700 transition-colors"
              aria-label={`ลบ ${p.name}`}
            >
              <TrashIcon />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PersonnelInput;
