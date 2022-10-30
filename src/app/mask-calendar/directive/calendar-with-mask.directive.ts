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

@Directive({
  selector: '[appCalendarWithMask]',
})
export class CalendarWithMaskDirective
  implements OnInit, AfterViewInit, OnChanges
{
  constructor(
    private el: ElementRef,
    private calendar: Calendar,
    private control: NgControl
  ) {}

  // @HostListener('ngModelChange', ['$event'])
  // onModelChange(event: any) {
  //   console.log('ngModelChange');
  //   console.log(event);
  //   // this.onInputChange(event, false);
  // }

  // @HostListener('keydown.backspace', ['$event'])
  // keydownBackspace(event: any) {
  //   console.log('keydown.backspace');
  //   console.log(event);
  //   // this.onInputChange(event.target.value, true);
  // }

  @HostListener('keydown', ['$event'])
  keydown(event: KeyboardEvent) {
    console.log('keydown');
    console.log(event);
    const actualValue = this.getValue();

    if (event.code === 'Period' && actualValue.length > 8) {
      console.log(event);
    }

    // console.log(this.calendar.inputfieldViewChild.nativeElement.value);

    // this.calendar.
    // this.onInputChange(event.target.value, true);
  }

  @HostListener('keyup', ['$event'])
  keyup(event: KeyboardEvent) {
    console.log('keyup');
    console.log(event);
    const actualValue = this.getValue();

    if (event.code === 'Period' && actualValue.length > 8) {
      // replace '.' from end of string
      // const trimmedValue = actualValue.replace(/\.$/, '');
      // const pointIndex = trimmedValue.lastIndexOf('.');
      // const monthString = actualValue
      //   .substring(pointIndex + 1, actualValue.length)
      //   .replace('.', '');
      // const paddedValue =
      //   monthString.length && monthString.length < 2
      //     ? '0'.concat(monthString)
      //     : monthString;
      // const paddedActualValue = actualValue
      //   .substring(0, pointIndex + 1)
      //   .concat(paddedValue);
      // this.setValue(paddedActualValue);
      // this.el.nativeElement.value = paddedActualValue;
    }

    // if point is added, for day
  }

  // @HostBinding('value') value: any = 'test';

  // @HostBinding('attr.value') attrValue: any;

  ngOnInit() {
    // const test = this.calendar.inputfieldViewChild;
    // this.calendar.onShow.subscribe(() => { // <--- listen for datepicker shown
    //   this.addToggleButtonToButtonBar();
    // });
  }
  // listen value changes
  ngOnChanges(changes: SimpleChanges): void {
    console.log('ngOnChanges');
    console.log(changes);
  }
  ngAfterViewInit(): void {
    // const test = this.calendar.inputfieldViewChild;
    this.calendar.onInput.subscribe((event: InputEvent) => {
      console.log('onInput');
      console.log(event);
      // console.log(this.calendar.inputfieldViewChild.nativeElement.value);

      const actualValue = this.getValue();

      // if point is added, for day
      if (event.data === '.' && actualValue.length > 8) {
        // replace '.' from end of string
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

      this.formatAndtSetValue(actualValue);
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
    this.setValue(paddedActualValue + '.');
  }

  private treatPointForDay(actualValue: string) {
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
    this.setValue(paddedActualValue);
  }

  private formatAndtSetValue(atualValue: string) {
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
    this.setValue(formattedValue);
  }
  private getValue(): string {
    return this.calendar.inputfieldViewChild.nativeElement.value;
    // return this.el.nativeElement.value;
  }
  private setValue(val: any) {
    // this.calendar.updateModel(val);
    // this.el.nativeElement.value = val;

    this.calendar.inputfieldViewChild.nativeElement.value = val;
    try {
      let value = this.calendar.parseValueFromString(val);
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
}
