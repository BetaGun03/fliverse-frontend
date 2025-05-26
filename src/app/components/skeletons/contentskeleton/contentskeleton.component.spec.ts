import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentskeletonComponent } from './contentskeleton.component';

describe('ContentskeletonComponent', () => {
  let component: ContentskeletonComponent;
  let fixture: ComponentFixture<ContentskeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentskeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentskeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
