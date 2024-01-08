import dayjs from 'dayjs/esm';
import { IBlog } from 'app/entities/blog/blog.model';

export interface IComment {
  id: number;
  content?: string | null;
  date?: dayjs.Dayjs | null;
  blog?: IBlog | null;
}

export type NewComment = Omit<IComment, 'id'> & { id: null };
