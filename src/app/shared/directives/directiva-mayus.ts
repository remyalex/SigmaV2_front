import { Directive, ElementRef, forwardRef, HostListener, Renderer2, Self, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[appUpper]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UpperDirective),
      multi: true,
    },
  ],
})
export class UpperDirective implements ControlValueAccessor {
  /** implements ControlValueAccessorInterface */
  _onChange: (_: any) => void;

  /** implements ControlValueAccessorInterface */
  _touched: () => void;

  @Input('appUpper') appUpper: boolean = true;

  constructor(@Self() private _el: ElementRef, private _renderer: Renderer2) { }

  /** Trata as teclas */
  @HostListener('input', ['$event'])
  onKeyDown(evt: KeyboardEvent) {
    if(this.appUpper !== false){
      this.appUpper = true;
    }

    if (this.appUpper) {
      let value = '';
      if (this._el.nativeElement.value) {
        value = this._el.nativeElement.value.toUpperCase();
      }
      this._renderer.setProperty(this._el.nativeElement, 'value', value);
      this._onChange(value);
      evt.preventDefault();
    }
  }

  @HostListener('blur', ['$event'])
  onBlur() {
    this._touched();
  }

  /** Implementation for ControlValueAccessor interface */
  writeValue(value: any): void {
    if(!value){
      value = '';
    }
    this._renderer.setProperty(this._el.nativeElement, 'value', value);
  }

  /** Implementation for ControlValueAccessor interface */
  registerOnChange(fn: (_: any) => void): void {
    this._onChange = fn;
  }

  /** Implementation for ControlValueAccessor interface */
  registerOnTouched(fn: () => void): void {
    this._touched = fn;
  }

  /** Implementation for ControlValueAccessor interface */
  setDisabledState(isDisabled: boolean): void {
    this._renderer.setProperty(this._el.nativeElement, 'disabled', isDisabled);
  }
}
