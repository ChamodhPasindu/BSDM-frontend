import { Status } from '../enums/Status.enum';
import { UserRole } from '../enums/UserRole.enum';

export interface IEmployee {
  username: string;
  name: string;
  nic: string;
  email: string;
  password: string;
  role: UserRole;
  status: Status;
  mobileNumber: string;
  profileImage: string;
}
