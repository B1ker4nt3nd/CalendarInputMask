import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { Calendar } from 'primeng/calendar';

interface cursorLastPosition {
  selectionStart: number;
  selectionEnd: number;
  code: 'Backspace' | 'Delete';
}

@Directive({
  selector: '[appCalendarWithMask]',
})
export class CalendarWithMaskDirective implements AfterViewInit {
  constructor(
    private el: ElementRef,
    private calendar: Calendar,
    private control: NgControl
  ) {}

  cursorLastPosition: cursorLastPosition | null = null;

  @HostListener('keydown.backspace', ['$event'])
  keydownBackspace(event: KeyboardEvent) {
    this.setSelectionWhenDelete(event);
  }

  @HostListener('keydown.delete', ['$event'])
  keydownDelete(event: KeyboardEvent) {
    this.setSelectionWhenDelete(event);
  }

  ngAfterViewInit(): void {
    this.calendar.onInput.subscribe((event: InputEvent) => {
      const actualValue = this.getValue();

      // if point is added, for day
      if (event.data === '.' && actualValue.length > 8) {
        this.treatPointForDay(actualValue);
        return;
      }

      // if point is added, for month
      if (event.data === '.' && actualValue.length > 6) {
        this.treatPointForMonth(actualValue);
        return;
      }

      if (event.data === '.' && [5, 8].includes(actualValue.length)) {
        return;
      }

      if (this.cursorLastPosition) {
        this.setValueToCalendar(actualValue);
        return;
      }

      this.formatAndSetValue(actualValue); // TODO CSAK AKKOR ÁLLTÍSUNK BÁRMIT HA VAN ÉRTELME
    });
  }

  private treatPointForMonth(actualValue: string) {
    const pointIndex = actualValue.indexOf('.');
    const dayString = actualValue
      .substring(pointIndex + 1, actualValue.length)
      .replace('.', '');
    // add '0' to the start of the string if needed
    const paddedValue =
      dayString.length && dayString.length < 2
        ? '0'.concat(dayString)
        : dayString;

    const paddedActualValue = actualValue
      .substring(0, pointIndex + 1)
      .concat(paddedValue);
    this.setValueToCalendar(paddedActualValue + '.');
  }

  private treatPointForDay(actualValue: string) {
    // replace '.' from end of string
    const trimmedValue = actualValue.replace(/\.$/, '');
    const pointIndex = trimmedValue.lastIndexOf('.');

    const monthString = actualValue
      .substring(pointIndex + 1, actualValue.length)
      .replace('.', '');

    const paddedValue =
      monthString.length && monthString.length < 2
        ? '0'.concat(monthString)
        : monthString;
    const paddedActualValue = actualValue
      .substring(0, pointIndex + 1)
      .concat(paddedValue);
    this.setValueToCalendar(paddedActualValue);
  }

  private formatAndSetValue(atualValue: string) {
    // regex to replace everything except numbers, regex trim to 8 characters
    const trimmedValue = atualValue.replace(/[^0-9]/g, '').substring(0, 8);

    // regex to add points after 4 and 6 characters and trim to 10 characters
    const formattedValue = trimmedValue
      .replace(/^(\d{4})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{2})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{2})(\d)/, '.$1.$2')
      .replace(/(\d{4})\.(\d{2})\.(\d{2})/, '$1.$2.$3')
      .substring(0, 10);

    // set the new value
    this.setValueToCalendar(formattedValue);
  }
  private getValue(): string {
    return this.calendar.inputfieldViewChild.nativeElement.value;
  }
  /**
   * Set value to the input field
   * @param val
   */
  private setValueToCalendar(val: any) {
    if (this.calendar.inputfieldViewChild.nativeElement.value !== val) {
      this.calendar.inputfieldViewChild.nativeElement.value = val;
      try {
        let value = this.calendar.parseValueFromString(val);
        // valid date
        if (this.calendar.isValidSelection(value)) {
          this.calendar.updateModel(value);
          this.calendar.updateUI();
        }
      } catch (err) {
        //invalid date
        let value = this.calendar.keepInvalid ? val : null;
        this.calendar.updateModel(value);
      }
      this.calendar.filled = val != null && val.length;
    }
    if (
      this.cursorLastPosition &&
      val.length > this.cursorLastPosition.selectionEnd
    ) {
      this.calendar.inputfieldViewChild.nativeElement.setSelectionRange(
        this.cursorLastPosition.code === 'Backspace'
          ? this.cursorLastPosition.selectionEnd - 1
          : this.cursorLastPosition.selectionEnd,
        this.cursorLastPosition.code === 'Backspace'
          ? this.cursorLastPosition.selectionEnd - 1
          : this.cursorLastPosition.selectionEnd
      );
    }
    this.cursorLastPosition = null;
  }
  private setSelectionWhenDelete(event: KeyboardEvent) {
    if (event?.target) {
      this.cursorLastPosition = {
        selectionStart: (event.target as any).selectionStart,
        selectionEnd: (event.target as any).selectionEnd,
        code: event.code as any,
      };
    }
  }
}
