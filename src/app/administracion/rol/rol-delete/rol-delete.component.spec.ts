import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RolDeleteComponent } from './rol-delete.component';

describe('RolDeleteComponent', () => {
  let component: RolDeleteComponent;
  let fixture: ComponentFixture<RolDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RolDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
