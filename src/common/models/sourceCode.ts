export type SourceCode = {
  id: number;
  name: string;
  content: string;
  createdAt: number;
  isSuccess: boolean;
  isFavourite: boolean;
  levelId: number;
  levelName: string;
  userId?: number;
};

export const initSourceCode = {
  id: 0,
  name: "",
  content: "",
  createdAt: 0,
  isSuccess: false,
  isFavourite: false,
  levelId: 1,
  levelName: "",
};
