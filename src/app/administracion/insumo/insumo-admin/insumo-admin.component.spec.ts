import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsumoAdminComponent } from './insumo-admin.component';

describe('InsumoAdminComponent', () => {
  let component: InsumoAdminComponent;
  let fixture: ComponentFixture<InsumoAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsumoAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsumoAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
