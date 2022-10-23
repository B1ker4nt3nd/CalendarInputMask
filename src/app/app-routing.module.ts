import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'components/mask-calendar-input', pathMatch: 'full' },
  {
    path: 'components',
    loadChildren: () =>
      import('./mask-calendar/mask-calendar.module').then(
        (m) => m.MaskCalendarModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
