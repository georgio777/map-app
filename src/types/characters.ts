export interface Character {
  id: number;
  name: string;
  img: string;
  longitude: number;
  latitude: number;
  currentAdress: string;
  historicalAdress: string;
  information: string;
  author: string;
  fiction: string;
}

export type Characters = Character[];
