interface InfoBlock {
  title: string;
  descriptions: string[];
}

export interface Character {
  id: number;
  name: string;
  longitude: number;
  latitude: number;
  currentAdress: string;
  historicalAdress: string;
  author: string;
  fiction: string;
  details: InfoBlock[]
}

export type Characters = Character[];
