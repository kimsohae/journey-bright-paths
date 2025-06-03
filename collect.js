// const fetch = require('axios');
const fs = require('fs');
const path = require('path');


const listPath = path.join(__dirname, 'bundang_list.json');

const A_API_URL = 'http://swopenapi.seoul.go.kr/api/subway/sample/xml/realtimeStationArrival/0/5/';

async function enrichBundangList() {
    const bundangList = JSON.parse(fs.readFileSync(listPath, 'utf-8'));
  
    for (let i = 0; i < bundangList.length; i++) {
      const item = bundangList[i];
      try {
        const url = `http://swopenapi.seoul.go.kr/api/subway/sample/json/realtimeStationArrival/0/5/${encodeURIComponent(item.bldn_nm)}`;
        const res = (await fetch(
            url,
            ).then(res => res.json()));
        const dataList = res.realtimeArrivalList;            
        const matched = dataList.find(station => station.statnNm === item.bldn_nm);

        if (matched) item.id = matched.statnId;
      } catch (err) {
        console.error(err)
        console.error(`Error fetching for ${item.bldn_nm}:`, err.message);
      }
    }
  
    fs.writeFileSync(listPath, JSON.stringify(bundangList, null, 2));
    console.log('Updated bundang_list.json with IDs.');
  }
  
  enrichBundangList();