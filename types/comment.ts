export interface Comment {
  id: string;
  text: string;
  parentId: string | null;
  replies: Comment[];
}
