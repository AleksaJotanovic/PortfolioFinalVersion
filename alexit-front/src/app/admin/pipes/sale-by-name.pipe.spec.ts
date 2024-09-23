import { SaleByNamePipe } from './sale-by-name.pipe';

describe('SaleByNamePipe', () => {
  it('create an instance', () => {
    const pipe = new SaleByNamePipe();
    expect(pipe).toBeTruthy();
  });
});
