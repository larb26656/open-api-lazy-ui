import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./core/components/navigation/navigation.module')
      .then(m => m.NavigationModule),
  },
];

export const AppRoutes = RouterModule.forChild(routes);
