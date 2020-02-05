import '@ag-grid-community/core/dist/styles/ag-grid.css';
import '@ag-grid-community/core/dist/styles/ag-theme-material.css';
import {
  Grid,
  GridOptions,
  ModuleRegistry,
  ColDef,
  ColGroupDef
} from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';

import { Subject } from 'rxjs';

ModuleRegistry.register(ClientSideRowModelModule);

const columnDefs: (ColDef | ColGroupDef)[] = [
  { headerName: 'First name', field: 'first_name', width: 120 },
  { headerName: 'Last name', field: 'last_name', width: 120 },
  { headerName: 'Hours', field: 'hours_worked', width: 90 }
];

export class EmployeeGrid {
  selectedId = new Subject<number | null>();

  private gridOptions: GridOptions = {
    columnDefs,
    rowSelection: 'single',
    onSelectionChanged: this.onSelectionChanged.bind(this)
  };

  private onSelectionChanged() {
    const rows = this.gridOptions.api!.getSelectedRows();
    if (rows && rows.length == 1) {
      this.selectedId.next(rows[0].id);
    } else {
      this.selectedId.next(null);
    }
  }

  constructor(elem: HTMLElement) {
    new Grid(elem, this.gridOptions);
  }

  setData(data: any) {
    // ag-grid's way of providing API access is... unusual.
    this.gridOptions.api?.setRowData(data);
  }
}
