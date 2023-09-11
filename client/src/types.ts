export type Concept = {
  id: string;
  concept: string;
  definition: string;
  categoryId: string;
};

export type Category = {
  id: string;
  title: string;
  description: string;
};

export type Stat = {
  id: number;
  conceptId: string;
  countAccurate: number;
  totalAttempts: number;
}
