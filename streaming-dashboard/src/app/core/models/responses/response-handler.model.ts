import { BaseResponse } from "./base-response.model";
import {ResponseMessage, ResponseStatus} from "../../constants/common.enum";

export class ResponseHandler<T extends BaseResponse> {
  constructor(private response: T) {
  }

  isSuccess(): boolean {
    return this.response.status === ResponseStatus.OK && this.response.message === ResponseMessage.OK;
  }

  getData(): T {
    return this.response as T;
  }

  private extractDynamicFields(response: T): Record<string, any> {
    const { status, message, ...dynamicFields } = response;
    return dynamicFields;
  }

  getError(): () => Error {
    console.log("getError")
    return () => new Error(`Error! Status: ${this.response.status}, Message: ${this.response.message}`);

  }
}
