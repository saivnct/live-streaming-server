import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent, MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup} from "@angular/forms";
import {LiveStream} from "../../../core/models/live-stream/live-stream.model";
import {removeEmptyFields} from "../../../core/utils/utils";
import {JsonPipe} from "@angular/common";

export type LiveStreamDialogMode = 'Create' | 'Update' | 'View';
export interface LiveStreamDialogData {
  mode: LiveStreamDialogMode;
  liveStream?: LiveStream;
}

@Component({
  selector: 'app-dialog-create-live-stream',
  standalone: true,
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatLabel,
    MatFormField,
    MatDialogTitle,
    MatInput,
    MatButton,
    FormsModule,
    ReactiveFormsModule,
    JsonPipe
  ],
  templateUrl: './dialog-create-live-stream.component.html',
  styleUrl: './dialog-create-live-stream.component.scss'
})
export class DialogCreateLiveStreamComponent {

  form: UntypedFormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogCreateLiveStreamComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LiveStreamDialogData,
    private fb: UntypedFormBuilder,
  ) {
    this.form = fb.group({
      name: [data.liveStream?.name, []],
      startAt: ['', []],
      endAt: ['', []],
    })
  }

  get name() {
    return this.form.get('name')!;
  }

  get startAt() {
    return this.form.get('startAt')!;
  }

  get endAt() {
    return this.form.get('endAt')!;
  }

  submit() {
    const returnData = removeEmptyFields(this.form.value);
    this.dialogRef.close(returnData);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
