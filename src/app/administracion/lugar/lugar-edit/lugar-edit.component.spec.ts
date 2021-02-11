import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LugarEditComponent } from './lugar-edit.component';

describe('LugarEditComponent', () => {
  let component: LugarEditComponent;
  let fixture: ComponentFixture<LugarEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LugarEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LugarEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
