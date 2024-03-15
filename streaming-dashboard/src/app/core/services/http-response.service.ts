import {throwError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {LiveStream} from "../models/live-stream/live-stream.model";

export function parseLiveStreamResponse(res: any): LiveStream {
  return {
    name: res.name,
    key: res.key,
    state: res.state,
    startAt: res.startAt,
    endAt: res.endAt
  }
}

export function handleError(error: Error) {
  console.error("[handleError] Error occur")
  // console.log(error)

  if (error instanceof HttpErrorResponse) {
    //add to other service
    if(error.error) {
      return throwError(() => {
        return new Error(error.error.message);
      });
    }
  } else {
    // Client Error
  }
  // Return an observable with a user-facing error message.

  return throwError(() => {
    return new Error('Something bad happened; please try again later.');
  });
}
