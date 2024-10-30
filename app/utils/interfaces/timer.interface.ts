export interface ITimer {
  id: number;
  userID: number;
  deviceID: number;
  action: string;
  date: Date;
  time: Date;
  status: string
  created_at: Date;
}

