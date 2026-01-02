import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffineCipherComponent } from './affine-cipher.component';

describe('AffineCipherComponent', () => {
  let component: AffineCipherComponent;
  let fixture: ComponentFixture<AffineCipherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AffineCipherComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AffineCipherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
