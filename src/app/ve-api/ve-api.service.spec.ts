import { TestBed, inject } from '@angular/core/testing';

import { VeApiService } from './ve-api.service';

describe('VeApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VeApiService]
    });
  });

  it('should be created', inject([VeApiService], (service: VeApiService) => {
    expect(service).toBeTruthy();
  }));
});
