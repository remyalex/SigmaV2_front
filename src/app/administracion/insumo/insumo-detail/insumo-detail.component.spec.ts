import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsumoDetailComponent } from './insumo-detail.component';

describe('InsumoDetailComponent', () => {
  let component: InsumoDetailComponent;
  let fixture: ComponentFixture<InsumoDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsumoDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsumoDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
