import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipocargueAdminComponent } from './tipocargue-admin.component';

describe('TipocargueAdminComponent', () => {
  let component: TipocargueAdminComponent;
  let fixture: ComponentFixture<TipocargueAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipocargueAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipocargueAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
