import { GoogleGenAI, Type } from "@google/genai";
import type { Personnel, Shift, ScheduleDay } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const scheduleSchema = {
  type: Type.ARRAY,
  description: "ตารางเวรสำหรับบุคลากรทางการแพทย์",
  items: {
    type: Type.OBJECT,
    properties: {
      date: {
        type: Type.STRING,
        description: "วันที่ในรูปแบบ YYYY-MM-DD",
      },
      shifts: {
        type: Type.ARRAY,
        description: "รายการกะงานสำหรับวันนั้นๆ",
        items: {
          type: Type.OBJECT,
          properties: {
            shiftName: {
              type: Type.STRING,
              description: "ชื่อกะงาน (เช่น 'เวรเช้า', 'เวรบ่าย', 'เวรดึก')",
            },
            personnel: {
              type: Type.ARRAY,
              description: "รายชื่อบุคลากรที่ได้รับมอบหมายในกะงานนี้",
              items: {
                type: Type.STRING,
              },
            },
          },
          required: ["shiftName", "personnel"],
        },
      },
    },
    required: ["date", "shifts"],
  },
};


export const generateSchedule = async (
  personnel: Personnel[], 
  shifts: Shift[], 
  constraints: string,
  startDate: string,
  endDate: string
): Promise<ScheduleDay[]> => {
  const personnelList = personnel.map(p => p.name).join(', ');
  const shiftList = shifts.map(s => s.name).join(', ');

  const prompt = `
    คุณคือผู้เชี่ยวชาญด้านการจัดตารางเวรสำหรับโรงพยาบาล
    
    โปรดสร้างตารางเวรสำหรับบุคลากรทางการแพทย์ตามข้อมูลต่อไปนี้:

    **ช่วงวันที่:**
    จาก ${startDate} ถึง ${endDate}

    **รายชื่อบุคลากรทั้งหมด:**
    ${personnelList}

    **ประเภทของกะงานในแต่ละวัน:**
    ${shiftList}

    **กฎและเงื่อนไข:**
    ${constraints}

    **กฎที่ต้องปฏิบัติตามอย่างเคร่งครัด:**
    1. กระจายกะงานให้มีความยุติธรรมและเท่าเทียมกันมากที่สุดสำหรับบุคลากรทุกคน
    2. ห้ามจัดให้บุคลากรคนใดทำงานในกะเช้าทันทีหลังจากที่เพิ่งออกกะดึกในวันก่อนหน้า
    3. ตรวจสอบให้แน่ใจว่าบุคลากรทุกคนมีเวลาพักผ่อนที่เพียงพอระหว่างกะงาน
    4. จัดบุคลากรให้ตรงตามเงื่อนไขที่ระบุไว้ในกฎและเงื่อนไข (เช่น จำนวนคนในแต่ละกะ)

    โปรดส่งคืนผลลัพธ์เป็น JSON object ที่มีโครงสร้างตรงตาม schema ที่กำหนดเท่านั้น ห้ามมีข้อความอธิบายใดๆ นอกเหนือจาก JSON
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: scheduleSchema,
      }
    });

    const jsonText = response.text.trim();
    const scheduleData = JSON.parse(jsonText);
    
    // Ensure the data matches the ScheduleDay[] type
    if (Array.isArray(scheduleData)) {
      return scheduleData as ScheduleDay[];
    } else {
      throw new Error("Invalid schedule format received from API");
    }

  } catch (error) {
    console.error("Error generating schedule with Gemini:", error);
    throw new Error("Failed to communicate with the scheduling AI.");
  }
};
