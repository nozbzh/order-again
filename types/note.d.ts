export interface NoteInterface {
  title: string;
  body: string;
  id: string;
  lastUpdatedAt: number;
}

export interface NoteInput {
  title: string;
  body: string;
}
