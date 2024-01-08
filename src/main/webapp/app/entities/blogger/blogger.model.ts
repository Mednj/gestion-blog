import { IBlog } from 'app/entities/blog/blog.model';

export interface IBlogger {
  id: number;
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  profileImage?: string | null;
  profileImageContentType?: string | null;
  blogs?: IBlog[] | null;
}

export type NewBlogger = Omit<IBlogger, 'id'> & { id: null };
