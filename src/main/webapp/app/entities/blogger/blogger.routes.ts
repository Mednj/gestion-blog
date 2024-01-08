import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { BloggerComponent } from './list/blogger.component';
import { BloggerDetailComponent } from './detail/blogger-detail.component';
import { BloggerUpdateComponent } from './update/blogger-update.component';
import BloggerResolve from './route/blogger-routing-resolve.service';

const bloggerRoute: Routes = [
  {
    path: '',
    component: BloggerComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BloggerDetailComponent,
    resolve: {
      blogger: BloggerResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BloggerUpdateComponent,
    resolve: {
      blogger: BloggerResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BloggerUpdateComponent,
    resolve: {
      blogger: BloggerResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default bloggerRoute;
