import type { CaseFilter } from './caseFilter.ts';
import type { UserRole } from './user.ts';

declare global {
  namespace Express {
    interface Request {
      pagination?: {
        pageNum: number;
        limitNum: number;
        skip: number;
      };
      caseFilter?: CaseFilter;
      user?: {
        id: string;
        fullName: string;
        employeeId:string;
        role: UserRole;

      };
    }
  }
}
