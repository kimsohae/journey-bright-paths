import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getBearing(lat1, lon1, lat2, lon2, isReversed) {
  try{
    const toRad = (deg) => (deg * Math.PI) / 180;
    const toDeg = (rad) => (rad * 180) / Math.PI;
  
    const dLon = toRad(lon2 - lon1);
    const y = Math.sin(dLon) * Math.cos(toRad(lat2));
    const x =
      Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
      Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLon);
    const brng = Math.atan2(y, x);
    let deg = (toDeg(brng) + 360) % 360;
  
    if (isReversed) {
      deg = (deg + 180) % 360;
    }
    return deg.toFixed(0);

  } catch(e){
    console.log(e);
  }
  return 0; 
}

export function formatKoreanDateTime(datetimeStr) {
  const date = new Date(datetimeStr);

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  let hour = date.getHours();
  const minute = date.getMinutes().toString().padStart(2, "0");
  const second = date.getSeconds().toString().padStart(2, "0");

  const period = hour < 12 ? "오전" : "오후";
  hour = hour % 12 || 12;

  return `${year}-${month}-${day} ${period} ${hour}시 ${minute}분 ${second}초`;
}