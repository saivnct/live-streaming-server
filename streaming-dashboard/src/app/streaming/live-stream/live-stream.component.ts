import {Component, OnInit} from '@angular/core';
import {
  MatCell, MatCellDef,
  MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable,
  MatTableDataSource
} from "@angular/material/table";
import {MatCheckbox} from "@angular/material/checkbox";
import {SelectionModel} from '@angular/cdk/collections';
import {MatButton, MatIconButton, MatMiniFabButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatTooltip} from "@angular/material/tooltip";
import {LiveStreamService} from "../../core/services/live-stream.service";
import {LiveStream} from "../../core/models/live-stream/live-stream.model";
import {MatDialog} from "@angular/material/dialog";
import {
  DialogCreateLiveStreamComponent,
  LiveStreamDialogMode
} from "./dialog-create-live-stream/dialog-create-live-stream.component";
import {StreamStatePipe} from "../../core/pipes/stream-state.pipe";
import {DatePipe} from "@angular/common";
import moment from "moment";
import {Router} from "@angular/router";


@Component({
  selector: 'app-live-stream',
  standalone: true,
  imports: [
    MatTable,
    MatCheckbox,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCell,
    MatCellDef,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatHeaderRowDef,
    MatMiniFabButton,
    MatIcon,
    MatIconButton,
    MatTooltip,
    MatButton,
    StreamStatePipe,
    DatePipe,

  ],
  templateUrl: './live-stream.component.html',
  styleUrl: './live-stream.component.scss'
})
export class LiveStreamComponent implements OnInit {
  displayedColumns: string[] = ['select', 'name', 'key', 'state', 'startAt', 'endAt', 'actions'];
  dataSource = new MatTableDataSource<LiveStream>();
  selection = new SelectionModel<LiveStream>(true, []);

  dialogMode: LiveStreamDialogMode = 'Create';

  constructor(private liveStreamService: LiveStreamService,
              public dialog: MatDialog,
              public router: Router
  ) {
  }

  ngOnInit(): void {
    this.fetchData()
  }

  openDialog(item: any, mode: LiveStreamDialogMode): void {
    this.dialogMode = mode

    const dialogRef = this.dialog.open(DialogCreateLiveStreamComponent, {
      data: {
        mode: mode,
        liveStream: item
      },
      width: '50%'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);

      if (result) {
        let updateStartAt = 0
        if (result.startAt) {
          const date = moment(result.startAt)
          const currentOffsetMs = date.utcOffset() * 60 * 1000;
          result.startAt = date.valueOf() + currentOffsetMs;
          updateStartAt = result.startAt
        }
        let updateEndAt = 0
        if (result.endAt) {
          const date = moment(result.endAt)
          const currentOffsetMs = date.utcOffset() * 60 * 1000;
          result.endAt = date.valueOf() + currentOffsetMs;
          updateEndAt = result.endAt
        }

        if (this.dialogMode === 'Create') {
          this.liveStreamService.createLiveStream(result).subscribe({
            next: (result) => {
              console.log("Create Item")
              console.log(result)

              this.fetchData()
            },
            error: (error) => {
              console.log("Create Item Error")
              console.log(error)
            }
          })
        } else {
          const updateItem = {
            startAt: updateStartAt,
            endAt: updateEndAt
          }

          this.liveStreamService.updateLiveStream(item.name, updateItem).subscribe({
            next: (result) => {
              console.log("Edit Item")
              console.log(result)
              this.fetchData()
            },
            error: (error) => {
              console.log("Edit Item Error")
              console.log(error)
            }
          })
        }
      }

    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: LiveStream): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.name + 1}`;
  }

  fetchData() {
    this.liveStreamService.getListLiveStream().subscribe({
      next: (result) => {
        console.log("Fetch Data")
        console.log(result)
        this.dataSource.data = result
      },
      error: (error) => {
        console.log("Fetch Data Error")
        console.log(error)
      }
    })
  }

  createItem() {
    const liveStream: LiveStream = {
      name: "",
      key: "",
      state: 0,
      startAt: 0,
      endAt: 0
    }
    this.openDialog(null, 'Create')
  }

  viewStream(item: any) {
    console.log("View Stream")
    console.log(item)
    this.router.navigate(['/watch', item.name]).then()
  }

  viewItem(item: any) {
    console.log("View Item")
    console.log(item)
    this.liveStreamService.getLiveStreamInfo(item.name).subscribe({
      next: (result) => {
        console.log("View Item")
        console.log(result)
        this.openDialog(result, 'View')
      },
      error: (error) => {
        console.log("View Item Error")
        console.log(error)
      }
    })
  }

  editItem(item: any) {
    console.log("Edit Item")
    console.log(item)
    this.openDialog(item, 'Update')
  }

  deleteItem(item: any) {
    console.log("Delete Item")
    console.log(item)
    this.liveStreamService.deleteLiveStream(item.name).subscribe({
      next: (result) => {
        console.log("Delete Item")
        console.log(result)
        this.fetchData()
      },
      error: (error) => {
        console.log("Delete Item Error")
        console.log(error)
      }
    })
  }

  deleteListItems() {
    console.log("Delete List Items")
    console.log(this.selection.selected)
    this.liveStreamService.deleteListLiveStream(this.selection.selected.map(item => item.name)).subscribe({
      next: (result) => {
        console.log("Delete List Items")
        console.log(result)
        this.fetchData()
      },
      error: (error) => {
        console.log("Delete List Items Error")
        console.log(error)
      }
    })
  }

}
