import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductUnitComponent } from './product-unit.component';

describe('ProductUnitComponent', () => {
  let component: ProductUnitComponent;
  let fixture: ComponentFixture<ProductUnitComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductUnitComponent ]
    })
    .compileComponents();
    ;

    fixture = TestBed.createComponent(ProductUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
