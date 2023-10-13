export interface Account {
  email: string;
  username: string;
  role: string | null;
  legalEntityCode: string | null;
  departmentCode: string | null;
  teamCode: string | null;
}

export interface Member {
  id: string;
  email: string;
  username: string;
  role: string | null;
  legalEntityCode: string;
  departmentCode: string | null;
  departmentName: string | null;
  teamCode: string | null;
  teamName: string | null;
}

export interface TeamProps {
  id: string;
  teamCode: string;
  teamName: string;
}

export interface DepartmentProps {
  id: string;
  departmentCode: string;
  departmentName: string;
  teams: TeamProps[];
}
