import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBlog, NewBlog } from '../blog.model';

export type PartialUpdateBlog = Partial<IBlog> & Pick<IBlog, 'id'>;

type RestOf<T extends IBlog | NewBlog> = Omit<T, 'date'> & {
  date?: string | null;
};

export type RestBlog = RestOf<IBlog>;

export type NewRestBlog = RestOf<NewBlog>;

export type PartialUpdateRestBlog = RestOf<PartialUpdateBlog>;

export type EntityResponseType = HttpResponse<IBlog>;
export type EntityArrayResponseType = HttpResponse<IBlog[]>;

@Injectable({ providedIn: 'root' })
export class BlogService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/blogs');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(blog: NewBlog): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(blog);
    return this.http.post<RestBlog>(this.resourceUrl, copy, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(blog: IBlog): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(blog);
    return this.http
      .put<RestBlog>(`${this.resourceUrl}/${this.getBlogIdentifier(blog)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(blog: PartialUpdateBlog): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(blog);
    return this.http
      .patch<RestBlog>(`${this.resourceUrl}/${this.getBlogIdentifier(blog)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestBlog>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestBlog[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getBlogIdentifier(blog: Pick<IBlog, 'id'>): number {
    return blog.id;
  }

  compareBlog(o1: Pick<IBlog, 'id'> | null, o2: Pick<IBlog, 'id'> | null): boolean {
    return o1 && o2 ? this.getBlogIdentifier(o1) === this.getBlogIdentifier(o2) : o1 === o2;
  }

  addBlogToCollectionIfMissing<Type extends Pick<IBlog, 'id'>>(
    blogCollection: Type[],
    ...blogsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const blogs: Type[] = blogsToCheck.filter(isPresent);
    if (blogs.length > 0) {
      const blogCollectionIdentifiers = blogCollection.map(blogItem => this.getBlogIdentifier(blogItem)!);
      const blogsToAdd = blogs.filter(blogItem => {
        const blogIdentifier = this.getBlogIdentifier(blogItem);
        if (blogCollectionIdentifiers.includes(blogIdentifier)) {
          return false;
        }
        blogCollectionIdentifiers.push(blogIdentifier);
        return true;
      });
      return [...blogsToAdd, ...blogCollection];
    }
    return blogCollection;
  }

  protected convertDateFromClient<T extends IBlog | NewBlog | PartialUpdateBlog>(blog: T): RestOf<T> {
    return {
      ...blog,
      date: blog.date?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restBlog: RestBlog): IBlog {
    return {
      ...restBlog,
      date: restBlog.date ? dayjs(restBlog.date) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestBlog>): HttpResponse<IBlog> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestBlog[]>): HttpResponse<IBlog[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
