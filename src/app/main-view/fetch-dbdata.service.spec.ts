import { TestBed } from '@angular/core/testing';

import { FetchDBdataService } from './fetch-dbdata.service';

describe('FetchDBdataService', () => {
  let service: FetchDBdataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FetchDBdataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
