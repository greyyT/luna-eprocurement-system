export interface Account {
  email: string;
  username: string;
  role: string | null;
  legalEntityCode: string | null;
  departmentCode: string | null;
  teamCode: string | null;
}

export interface Member {
  id: number;
  email: string;
  username: string;
  role: string | null;
  legalEntityCode: string;
  departmentCode: string | null;
  departmentName: string | null;
  teamCode: string | null;
  teamName: string | null;
}
