import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsumoDeleteComponent } from './insumo-delete.component';

describe('InsumoDeleteComponent', () => {
  let component: InsumoDeleteComponent;
  let fixture: ComponentFixture<InsumoDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsumoDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsumoDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
