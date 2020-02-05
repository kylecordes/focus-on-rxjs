// Surprisingly, this still brings in 43KB of Lodash code:
import orderBy from 'lodash-es/orderBy';

import { of, combineLatest, fromEvent } from 'rxjs';
import { debounceTime, map, startWith, switchMap } from 'rxjs/operators';

import { getList, getDetails } from './employee-loader';
import './style.css';
import { EmployeeGrid } from './employee-grid';
import { showEmployee } from './employee-detail';

const gridEl = document.querySelector('#myGrid') as HTMLElement;
const nameFilterEl = document.getElementById('nameFilter') as HTMLInputElement;
const sortEl = document.getElementById('sort') as HTMLInputElement;
const detailEl = document.getElementById('detail');

type SortDir = 'asc' | 'desc';

if (gridEl && nameFilterEl && sortEl && detailEl) {
  const grid = new EmployeeGrid(gridEl);

  const nameFilterChange = fromEvent(nameFilterEl, 'input');
  const sortChange = fromEvent(sortEl, 'input');

  const nameFilter = nameFilterChange.pipe(
    map(evt => evt && evt.target && evt.target.value),
    startWith<string>(nameFilterEl.value as string)
  );

  const sort = sortChange.pipe(
    map(evt => evt && evt.target && evt.target.value),
    startWith<string>(sortEl.value as string)
  );

  // List reacts to filter and sort changes
  const filteredList = combineLatest([
    nameFilter.pipe(
      debounceTime(250),
      switchMap(x => getList(x))
    ),
    sort
  ]).pipe(
    map(([list, sortSpec]) => {
      const [sortKey, direction] = sortSpec.split(';');
      return orderBy(list, [sortKey], [direction as SortDir]);
    })
  );

  filteredList.subscribe(data => grid.setData(data));

  // Detail reacts to selected employee changes
  grid.selectedId
    .pipe(switchMap(id => (id ? getDetails(id) : of(undefined))))
    .subscribe(detail => showEmployee(detail, detailEl));
}
