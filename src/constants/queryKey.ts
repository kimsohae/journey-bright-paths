export const queryKeys = {
    arrival: (statnNm: string)=>['realtime-arrival', statnNm],
    position: (subwayNm: string) => ['realtime-position', subwayNm]
}