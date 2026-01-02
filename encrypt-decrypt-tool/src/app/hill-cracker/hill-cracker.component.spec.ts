import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HillCrackerComponent } from './hill-cracker.component';

describe('HillCrackerComponent', () => {
  let component: HillCrackerComponent;
  let fixture: ComponentFixture<HillCrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HillCrackerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HillCrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
