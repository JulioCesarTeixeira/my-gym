export type HistoryDTO = {
  id: number;
  name: string;
  user_id: number;
  group: string;
  hour: string;
  exercise_id: number;
  created_at: string;
};

export type HistoryByDayDTO = {
  title: string;
  data: HistoryDTO[];
};
