import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployerHomePage } from './employer-home.page';

describe('EmployerHomePage', () => {
  let component: EmployerHomePage;
  let fixture: ComponentFixture<EmployerHomePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployerHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
