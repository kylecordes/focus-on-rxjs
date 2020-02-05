import { Observable } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { switchMap } from 'rxjs/operators';
import { delay } from 'rxjs/operators';

import { Employee } from './employee';

const apiUrl = 'https://api.angularbootcamp.com';

// Configure the amount of latency and jitter to simulate.
const apiLatency = 100;

// Set to 3000 to see that out-of-order replies don't cause any problem.
const apiJitter = 100;

export function getList(searchText: string): Observable<Employee[]> {
  const url = new URL(apiUrl + '/employees');
  url.searchParams.append('q', searchText);
  url.searchParams.append('_limit', '20');

  return fromFetch(url.href).pipe(
    delay(randomDelay()),
    switchMap(resp => resp.json())
  );
}

export function getDetails(employeeId: number): Observable<Employee> {
  const url = new URL(`${apiUrl}/employees/${employeeId}`);
  return fromFetch(url.href).pipe(
    delay(randomDelay()),
    switchMap(resp => resp.json())
  );
}

function randomDelay() {
  return Math.round(apiLatency + Math.random() * apiJitter);
}
