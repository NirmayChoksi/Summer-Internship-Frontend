import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KitchenSinkPage } from './kitchen-sink.page';

describe('KitchenSinkPage', () => {
  let component: KitchenSinkPage;
  let fixture: ComponentFixture<KitchenSinkPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(KitchenSinkPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
