import { Routes, RouterModule } from '@angular/router';
import { NavigationComponent } from './navigation.component';

const routes: Routes = [
  {
    path: '',
    component: NavigationComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: '',
        loadChildren: () => import('../../../page/home/home.module')
          .then(m => m.HomeModule),
      }
    ],
  },
];

export const NavigationRoutes = RouterModule.forChild(routes);
