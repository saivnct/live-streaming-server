import { Injectable } from '@angular/core';
import {catchError, map} from "rxjs";
import {ResponseHandler} from "../models/responses/response-handler.model";
import {HttpClient} from "@angular/common/http";
import {ItemsResponse} from "../models/responses/items-response.model";
import {environment} from "../../../environments/environment";
import {LiveStreamResponse} from "../models/responses/live-stream-response.model";
import {BaseResponse} from "../models/responses/base-response.model";
import {handleError, parseLiveStreamResponse} from "./http-response.service";
import {LiveStream} from "../models/live-stream/live-stream.model";

@Injectable({
  providedIn: 'root'
})
export class LiveStreamService {

  constructor(private http: HttpClient) { }

  //region Live Stream
  getListLiveStream() {
    return this.http.get<ItemsResponse>(`${environment.apiUrl}/stream/`)
      .pipe(
        map(result => {
          const responseHandler = new ResponseHandler<ItemsResponse>(result);
          if (responseHandler.isSuccess()) {
            const items: LiveStream[] = responseHandler.getData().items.map((res: any) => {
              return parseLiveStreamResponse(res)
            })

            return items;
          } else {
            throw responseHandler.getError()
          }
        }),
        catchError(handleError)
      )
  }

  getLiveStreamInfo(id: string) {
    return this.http.get<LiveStreamResponse>(`${environment.apiUrl}/stream/${id}`)
      .pipe(
        map(result => {
          const responseHandler = new ResponseHandler<LiveStreamResponse>(result);
          if (responseHandler.isSuccess()) {
            return parseLiveStreamResponse(responseHandler.getData().gStream)
          } else {
            throw responseHandler.getError()
          }
        }),
        catchError(handleError)
      )
  }

  createLiveStream(body: any) {
    return this.http.post<LiveStreamResponse>(`${environment.apiUrl}/stream/`, body).pipe(
      map(result => {
        const responseHandler = new ResponseHandler<LiveStreamResponse>(result);
        if (responseHandler.isSuccess()) {
          return parseLiveStreamResponse(responseHandler.getData().gStream)
        } else {
          throw responseHandler.getError()
        }
      }),
      catchError(handleError)
    )
  }

  updateLiveStream(id: string, body: any) {
    console.log("UpdateLiveStream")
    console.log(body)
    return this.http.patch<LiveStreamResponse>(`${environment.apiUrl}/stream/${id}`, body).pipe(
      map(result => {
        const responseHandler = new ResponseHandler<LiveStreamResponse>(result);
        if (responseHandler.isSuccess()) {
          return parseLiveStreamResponse(responseHandler.getData().gStream)
        } else {
          throw responseHandler.getError()
        }
      }),
      catchError(handleError)
    )
  }

  deleteLiveStream(id: string) {
    return this.http.delete<BaseResponse>(`${environment.apiUrl}/stream/${id}`)
      .pipe(
        map(result => {
          const responseHandler = new ResponseHandler<BaseResponse>(result);
          if (responseHandler.isSuccess()) {
            return true;
          } else {
            throw responseHandler.getError()
          }
        }),
        catchError(handleError)
      )
  }

  deleteListLiveStream(ids: string[]) {
    return this.http.delete<BaseResponse>(`${environment.apiUrl}/stream/`, {
      body: {
        names: ids
      }
    })
      .pipe(
        map(result => {
          const responseHandler = new ResponseHandler<BaseResponse>(result);
          if (responseHandler.isSuccess()) {
            return true;
          } else {
            throw responseHandler.getError()
          }
        }),
        catchError(handleError)
      )
  }

  //endregion Live Stream


}
