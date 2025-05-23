const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const PUBLIC_API_KEY = import.meta.env.VITE_PUBLIC_API_KEY;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `http://swopenapi.seoul.go.kr/api/subway/${PUBLIC_API_KEY}`;

if (!(PUBLIC_API_KEY && MAPBOX_TOKEN)) {
    throw new Error("Missing env! env를 확인해 주세요.");
}

export const Config = {
    MAPBOX_TOKEN,
    PUBLIC_API_KEY,
    API_BASE_URL
}
