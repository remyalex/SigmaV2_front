import { Directive, Output, EventEmitter, OnInit, HostListener, Input } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Directive({
  selector: '[appPrevenirMultiplesClicks]'
})
export class PrevenirMultiplesClicksDirective implements OnInit {

  @Input() debounceTime = 500;
  @Output() clearClick = new EventEmitter();
  private clicks = new Subject();
  private subscription: Subscription;

  constructor() { }

  ngOnInit() {
    this.subscription = this.clicks.pipe(
      debounceTime(this.debounceTime)
    ).subscribe(e => this.clearClick.emit(e));
  }

  /** Método que se ejecuta una vez invocada la destrucción del componente */
  ngOnDestroy() {   this.subscription.unsubscribe();
  }

  @HostListener('click', ['$event'])
  clickEvent(event) {
    event.preventDefault();
    event.stopPropagation();
    this.clicks.next(event);
  }

}
