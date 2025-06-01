import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInfoSkeletonComponent } from './user-info-skeleton.component';

describe('UserInfoSkeletonComponent', () => {
  let component: UserInfoSkeletonComponent;
  let fixture: ComponentFixture<UserInfoSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserInfoSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserInfoSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
