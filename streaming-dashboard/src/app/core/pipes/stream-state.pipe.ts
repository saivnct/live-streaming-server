import { Pipe, PipeTransform } from '@angular/core';
import {StreamState} from "../constants/common.enum";

@Pipe({
  name: 'streamState',
  standalone: true
})
export class StreamStatePipe implements PipeTransform {

  transform(value: number): string {
    switch (value) {
      case StreamState.INACTIVE:
        return 'Inactive';
      case StreamState.ACTIVE:
        return 'Active';
      default:
        return 'Unknown';

    }

  }

}
