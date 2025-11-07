import React from 'react';

interface ConstraintsInputProps {
  constraints: string;
  setConstraints: (value: string) => void;
}

const ConstraintsInput: React.FC<ConstraintsInputProps> = ({ constraints, setConstraints }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <label htmlFor="constraints" className="block text-lg font-semibold text-slate-700 mb-2">
        กฎและเงื่อนไขเพิ่มเติม
      </label>
      <textarea
        id="constraints"
        value={constraints}
        onChange={(e) => setConstraints(e.target.value)}
        rows={6}
        className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        placeholder="ใส่เงื่อนไขพิเศษที่นี่ (เช่น ขอลา, คำขอพิเศษ)"
      />
    </div>
  );
};

export default ConstraintsInput;
