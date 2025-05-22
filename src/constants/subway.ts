
import newBundangList from "@/new_bundang_list.json";
import bundangList from "@/bundang_list.json";

const NEW_BUNDANG_LIST = newBundangList;
const BUNDANG_LIST = bundangList;

export const NEW_BUNDANG_WAYPOINTS = NEW_BUNDANG_LIST.map((el) => ({
  id: el.id,
  longitude: Number(el.lot),
  latitude: Number(el.lat),
  name: el.bldn_nm,
}));
export const BUNDANG_WAYPOINTS = BUNDANG_LIST.map((el) => ({
  id: el.id,
  longitude: Number(el.lot),
  latitude: Number(el.lat),
  name: el.bldn_nm,
}));
export const NEW_BUNDANG_MAP = NEW_BUNDANG_WAYPOINTS.reduce(
  (acc, cur, index) => {
    if (cur.id) {
      const waypoint = { ...cur, index };
      acc[cur.id] = waypoint;
    }
    return acc;
  },
  {}
);
export const BUNDANG_MAP = NEW_BUNDANG_WAYPOINTS.reduce((acc, cur, index) => {
  if (cur.id) {
    const waypoint = { ...cur, index };
    acc[cur.id] = waypoint;
  }
  return acc;
}, {});