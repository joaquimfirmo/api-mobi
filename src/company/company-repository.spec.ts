import { CompanyRepository } from './company-repository';

describe('CompanyRepository', () => {
  it('should be defined', () => {
    expect(new CompanyRepository()).toBeDefined();
  });
});
