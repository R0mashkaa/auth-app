import { UsersResponse } from '../dto';

export function mapToUsersResponse(user): UsersResponse {
  return {
    id: user.id as string,
    firstName: user.firstName as string,
    lastName: user.lastName as string,
    role: user.role as string,
    email: user.email as string,
    password: user.password as string,
  };
}
