import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[numericInput]'
})
export class NumericInputDirective {

    constructor(private el: ElementRef) { }

    @Input() numericInput: boolean;
    @Input() latestInputValue: number;

    @HostListener('keydown', ['$event']) onKeyDown(event) {
        let e = <KeyboardEvent> event;
        if (this.numericInput) {
            if (this.latestInputValue < 0 || this.latestInputValue > 100) {
              e.preventDefault();
            } else if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
            // Allow: Ctrl+A
            (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
            // Allow: Ctrl+C
            (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
            // Allow: Ctrl+V
            // (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
            // Allow: Ctrl+X
            (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) ||
            // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
              // let it happen, don't do anything
              return;
            }
            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }            
        }
    }
}