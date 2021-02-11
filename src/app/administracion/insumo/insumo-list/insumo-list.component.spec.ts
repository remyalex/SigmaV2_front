import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsumoListComponent } from './insumo-list.component';

describe('InsumoListComponent', () => {
  let component: InsumoListComponent;
  let fixture: ComponentFixture<InsumoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsumoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsumoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
