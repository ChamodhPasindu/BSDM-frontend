import { Status } from "../enums/Status.enum";

export interface IRoute {
  routeName: string;
  description: string;
  status: Status;
}
