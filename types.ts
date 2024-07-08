export type EventType = {
  id: string;
  name: string;
  category: string;
  rules?: string[];
  date?: string;
  location: string;
  description: string;
  time: string;
  roomNo: number;
  image: string;
  registerEnabled: boolean;
  HeadsAndEvents: { headId: string }[];
};

export type HeadType = {
  name: string;
  image: string;
  phoneNumber: String;
};
