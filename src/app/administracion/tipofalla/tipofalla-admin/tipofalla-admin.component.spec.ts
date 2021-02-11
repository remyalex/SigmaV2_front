import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipofallaAdminComponent } from './tipofalla-admin.component';

describe('TipofallaAdminComponent', () => {
  let component: TipofallaAdminComponent;
  let fixture: ComponentFixture<TipofallaAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipofallaAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipofallaAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
