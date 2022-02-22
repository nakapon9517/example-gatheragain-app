import { Station } from '@/entities';
import { SectionStation } from '@/screens';

type routeSection = {
  routeNames: string;
  stations: Station[];
};

const tokyoMetros: routeSection[] = [
  require('@/routes/tokyoMetros/tokyoMetros-marunouchi'),
  require('@/routes/tokyoMetros/tokyoMetros-marunouchi-bunki'),
  require('@/routes/tokyoMetros/tokyoMetros-yurakucho'),
  require('@/routes/tokyoMetros/tokyoMetros-ginza'),
  require('@/routes/tokyoMetros/tokyoMetros-chiyoda'),
  require('@/routes/tokyoMetros/tokyoMetros-tozai'),
  require('@/routes/tokyoMetros/tokyoMetros-nanboku'),
  require('@/routes/tokyoMetros/tokyoMetros-hibiya'),
  require('@/routes/tokyoMetros/tokyoMetros-hanzomon'),
  require('@/routes/tokyoMetros/tokyoMetros-hukutoshin'),
];

const tobus: routeSection[] = [
  require('@/routes/tobus/tobus-tojo'),
  require('@/routes/tobus/tobus-isezaki'),
  require('@/routes/tobus/tobus-utunomiya'),
  require('@/routes/tobus/tobus-ogose'),
  require('@/routes/tobus/tobus-kidogawa'),
  require('@/routes/tobus/tobus-kameido'),
  require('@/routes/tobus/tobus-kiryu'),
  require('@/routes/tobus/tobus-sano'),
  require('@/routes/tobus/tobus-koizumi'),
  require('@/routes/tobus/tobus-daishi'),
  require('@/routes/tobus/tobus-nikko'),
  require('@/routes/tobus/tobus-noda'),
];

const osakaMetros: routeSection[] = [
  require('@/routes/osakaMetros/osaka-metro-midosuji'),
  require('@/routes/osakaMetros/osaka-metro-imazatosuji'),
  require('@/routes/osakaMetros/osaka-metro-sakaisuji'),
  require('@/routes/osakaMetros/osaka-metro-yotsubashi'),
  require('@/routes/osakaMetros/osaka-metro-sennichimae'),
  require('@/routes/osakaMetros/osaka-metro-tanimachi'),
  require('@/routes/osakaMetros/osaka-metro-tyuo'),
  require('@/routes/osakaMetros/osaka-metro-nagahoriturumiryokuchi'),
  require('@/routes/osakaMetros/osaka-metro-nanko-porttown'),
];

const jrWest: routeSection[] = [
  require('@/routes/jrWest/jr-west-kanjosen'),
  require('@/routes/jrWest/jr-west-kansai-airport'),
  require('@/routes/jrWest/jr-west-tozai'),
];

enum CompanyType {
  JR_EAST = 'JR東日本',
  TOKYO_METRO = '東京メトロ',
  TOBU = '東武鉄道',
  JR_WEST = 'JR西日本',
  OSAKA_METRO = '大阪メトロ',
}

const getStationsByCompany = (companyName: string) => {
  switch (companyName) {
    case CompanyType.TOKYO_METRO:
      return tokyoMetros;
    case CompanyType.TOBU:
      return tobus;
    case CompanyType.OSAKA_METRO:
      return osakaMetros;
    case CompanyType.JR_WEST:
      return jrWest;
    default:
      return [];
  }
};

export const sectionStations = Object.values(CompanyType).reduce((prev, companyName, index) => {
  const stations = getStationsByCompany(companyName);
  if (stations.length == 0) return prev;
  return [
    ...prev,
    {
      companyId: `company-${index}`,
      companyName,
      data: stations.map((station, i) => ({
        routeId: `route-${index}-${i}`,
        routeName: station.routeNames,
        stations: station.stations.filter((v) => v.routeName === station.routeNames),
      })),
    },
  ];
}, [] as SectionStation[]);
