export type StaffPost = {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  gender: "Male" | "Female";
  phoneNumber: string;
  birthYear: number;
  admissionYear: number;
};

export type StaffGet = {
  staffId: number;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  gender: "Male" | "Female" | "Other";
  phoneNumber: string;
  birthYear: number;
  admissionYear: number;
  role: "STAFF" | "ADMIN" | string; // allows flexibility if roles expand
};

export type Staff = {
  firstName: string;
  staffId: number;
  lastName: string;
  email: string;
  department: string;
  gender: string;
  phoneNumber: string;
  birthYear: number;
  admissionYear: number;
  role: string;
};

export type StaffList = StaffGet[];
