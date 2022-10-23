import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaskCalendarRoutingModule } from './mask-calendar-routing.module';
import { MaskCalendarInputComponent } from './mask-calendar-input/mask-calendar-input.component';
import { InputMaskModule } from 'primeng/inputmask';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { OverlayPanelModule } from 'primeng/overlaypanel';

@NgModule({
  declarations: [MaskCalendarInputComponent],
  imports: [
    CommonModule,
    MaskCalendarRoutingModule,
    FormsModule,
    InputMaskModule,
    CalendarModule,
    OverlayPanelModule,
  ],
})
export class MaskCalendarModule {}
