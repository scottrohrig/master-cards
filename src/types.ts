export type Concept = {
  id: string;
  concept: string;
  definition: string;
  categoryId: number;
};

export type Category = {
  id: number;
  title: string;
  description: string;
};
