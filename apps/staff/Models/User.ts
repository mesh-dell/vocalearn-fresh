export type UserProfileToken = {
  token: string;
  role: string;
  emailAddress: string;
};

export type UserProfile = {
  staffId: number;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  gender: "Male" | "Female";
  phoneNumber: string;
  birthYear: number;
  admissionYear: number;
  role: string;
};
