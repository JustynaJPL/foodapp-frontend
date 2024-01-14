import { TestBed } from '@angular/core/testing';

import { MySettingsDataService } from './my-settings-data.service';

describe('MySettingsDataService', () => {
  let service: MySettingsDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MySettingsDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
