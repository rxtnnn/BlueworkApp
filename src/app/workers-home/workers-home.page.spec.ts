import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkersHomePage } from './workers-home.page';

describe('WorkersHomePage', () => {
  let component: WorkersHomePage;
  let fixture: ComponentFixture<WorkersHomePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkersHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
