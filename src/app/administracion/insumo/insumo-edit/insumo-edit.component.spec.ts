import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsumoEditComponent } from './insumo-edit.component';

describe('InsumoEditComponent', () => {
  let component: InsumoEditComponent;
  let fixture: ComponentFixture<InsumoEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsumoEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsumoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
