export const queryKeys = {
    arrival: (statnNm: string)=>['realtime-arrival', statnNm] as const,
    position: (subwayNm: string) => ['realtime-position', subwayNm] as const
}