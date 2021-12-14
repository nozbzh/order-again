export interface NoteInterface {
  title: string;
  body: string;
  id: number;
  lastUpdatedAt: Date;
}

export interface NoteInput {
  title: string;
  body: string;
}
