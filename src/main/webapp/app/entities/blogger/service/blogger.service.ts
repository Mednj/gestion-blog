import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBlogger, NewBlogger } from '../blogger.model';

export type PartialUpdateBlogger = Partial<IBlogger> & Pick<IBlogger, 'id'>;

export type EntityResponseType = HttpResponse<IBlogger>;
export type EntityArrayResponseType = HttpResponse<IBlogger[]>;

@Injectable({ providedIn: 'root' })
export class BloggerService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/bloggers');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(blogger: NewBlogger): Observable<EntityResponseType> {
    return this.http.post<IBlogger>(this.resourceUrl, blogger, { observe: 'response' });
  }

  update(blogger: IBlogger): Observable<EntityResponseType> {
    return this.http.put<IBlogger>(`${this.resourceUrl}/${this.getBloggerIdentifier(blogger)}`, blogger, { observe: 'response' });
  }

  partialUpdate(blogger: PartialUpdateBlogger): Observable<EntityResponseType> {
    return this.http.patch<IBlogger>(`${this.resourceUrl}/${this.getBloggerIdentifier(blogger)}`, blogger, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IBlogger>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBlogger[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getBloggerIdentifier(blogger: Pick<IBlogger, 'id'>): number {
    return blogger.id;
  }

  compareBlogger(o1: Pick<IBlogger, 'id'> | null, o2: Pick<IBlogger, 'id'> | null): boolean {
    return o1 && o2 ? this.getBloggerIdentifier(o1) === this.getBloggerIdentifier(o2) : o1 === o2;
  }

  addBloggerToCollectionIfMissing<Type extends Pick<IBlogger, 'id'>>(
    bloggerCollection: Type[],
    ...bloggersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const bloggers: Type[] = bloggersToCheck.filter(isPresent);
    if (bloggers.length > 0) {
      const bloggerCollectionIdentifiers = bloggerCollection.map(bloggerItem => this.getBloggerIdentifier(bloggerItem)!);
      const bloggersToAdd = bloggers.filter(bloggerItem => {
        const bloggerIdentifier = this.getBloggerIdentifier(bloggerItem);
        if (bloggerCollectionIdentifiers.includes(bloggerIdentifier)) {
          return false;
        }
        bloggerCollectionIdentifiers.push(bloggerIdentifier);
        return true;
      });
      return [...bloggersToAdd, ...bloggerCollection];
    }
    return bloggerCollection;
  }
}
