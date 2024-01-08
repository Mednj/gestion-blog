import dayjs from 'dayjs/esm';
import { IComment } from 'app/entities/comment/comment.model';
import { IBlogger } from 'app/entities/blogger/blogger.model';

export interface IBlog {
  id: number;
  title?: string | null;
  content?: string | null;
  date?: dayjs.Dayjs | null;
  mainImage?: string | null;
  mainImageContentType?: string | null;
  document?: string | null;
  documentContentType?: string | null;
  comments?: IComment[] | null;
  blogger?: IBlogger | null;
}

export type NewBlog = Omit<IBlog, 'id'> & { id: null };
