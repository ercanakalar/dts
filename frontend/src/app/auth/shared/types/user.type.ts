export type SignupUser = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type SignUpRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type SignInResponse = {
  message: string;
  data: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  token: string;
};

export type SignInRequest = {
  email: string;
  password: string;
};
