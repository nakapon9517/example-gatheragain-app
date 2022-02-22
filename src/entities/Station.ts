export type Transfer = {
  companyName: string;
  routeName: string;
};

export type Station = {
  companyName: string;
  routeName: string;
  stationName: string;
  stationHiragana: string | null;
  latitude: number;
  longitude: number;
  transfers: Transfer[];
};
