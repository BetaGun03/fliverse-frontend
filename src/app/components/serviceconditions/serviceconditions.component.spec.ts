import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceconditionsComponent } from './serviceconditions.component';

describe('ServiceconditionsComponent', () => {
  let component: ServiceconditionsComponent;
  let fixture: ComponentFixture<ServiceconditionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceconditionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceconditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
