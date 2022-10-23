import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaskCalendarInputComponent } from './mask-calendar-input/mask-calendar-input.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'mask-calendar-input', component: MaskCalendarInputComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaskCalendarRoutingModule {}
