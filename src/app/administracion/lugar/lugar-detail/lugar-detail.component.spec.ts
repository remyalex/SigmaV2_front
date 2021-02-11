import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LugarDetailComponent } from './lugar-detail.component';

describe('LugarDetailComponent', () => {
  let component: LugarDetailComponent;
  let fixture: ComponentFixture<LugarDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LugarDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LugarDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
