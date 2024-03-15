import { Routes } from '@angular/router';
import {AdminLayoutComponent} from "./layouts/admin-layout/admin-layout.component";
import {LiveStreamComponent} from "./streaming/live-stream/live-stream.component";
import {WatchComponent} from "./streaming/watch/watch.component";

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'live-stream', // Redirect to the live-stream path
    pathMatch: 'full' // Redirect only if the full URL matches
  },
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'live-stream',
        component: LiveStreamComponent,
        // loadComponent: () => import('./streaming/live-stream/live-stream.component')
        //   .then(m => m.LiveStreamComponent)
      },
      {
        path: 'watch/:id',
        component: WatchComponent
      }
    ]
  },

];
