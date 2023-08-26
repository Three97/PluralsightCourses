import { Note } from "./note";

export class User {
  id?: number = -1;
  birthDate: Date = new Date(1900, 1, 1);
  name: string = "";
  avatar: string = "";
  bio: string = "";

  notes: Note[] = [];
}
