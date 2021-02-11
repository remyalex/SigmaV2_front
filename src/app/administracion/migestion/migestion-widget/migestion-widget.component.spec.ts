import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MiGestionWidgetComponent } from './migestion-widget.component';

describe('MiGestionWidgetComponent', () => {
  let component: MiGestionWidgetComponent;
  let fixture: ComponentFixture<MiGestionWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiGestionWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiGestionWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
