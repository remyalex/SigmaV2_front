import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ResgistroMezclaInsumosListComponent } from './registro-mezcla-insumos-list.component';

describe('ResgistroMezclaInsumosListComponent', () => {
  let component: ResgistroMezclaInsumosListComponent;
  let fixture: ComponentFixture<ResgistroMezclaInsumosListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResgistroMezclaInsumosListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResgistroMezclaInsumosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});