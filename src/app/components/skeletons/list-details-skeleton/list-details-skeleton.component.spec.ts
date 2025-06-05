import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDetailsSkeletonComponent } from './list-details-skeleton.component';

describe('ListDetailsSkeletonComponent', () => {
  let component: ListDetailsSkeletonComponent;
  let fixture: ComponentFixture<ListDetailsSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListDetailsSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListDetailsSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
