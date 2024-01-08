import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'blogger',
    data: { pageTitle: 'blogMicroApp.blogger.home.title' },
    loadChildren: () => import('./blogger/blogger.routes'),
  },
  {
    path: 'blog',
    data: { pageTitle: 'blogMicroApp.blog.home.title' },
    loadChildren: () => import('./blog/blog.routes'),
  },
  {
    path: 'comment',
    data: { pageTitle: 'blogMicroApp.comment.home.title' },
    loadChildren: () => import('./comment/comment.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
