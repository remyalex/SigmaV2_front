import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SigmaFormSelectDescValorComponent } from './sigma-form-select-desc-valor.component';

describe('SigmaFormSelectDescValorComponent', () => {
  let component: SigmaFormSelectDescValorComponent;
  let fixture: ComponentFixture<SigmaFormSelectDescValorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SigmaFormSelectDescValorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SigmaFormSelectDescValorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
