import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBlogger } from '../blogger.model';
import { BloggerService } from '../service/blogger.service';

export const bloggerResolve = (route: ActivatedRouteSnapshot): Observable<null | IBlogger> => {
  const id = route.params['id'];
  if (id) {
    return inject(BloggerService)
      .find(id)
      .pipe(
        mergeMap((blogger: HttpResponse<IBlogger>) => {
          if (blogger.body) {
            return of(blogger.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default bloggerResolve;
