export const signInMutation = `
  mutation SignInMutation($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      message
      data {
        id
        firstName
        lastName
        email
      }
      token
    }
  }
`;

export const signUpMutation = `
  mutation Mutation ( $firstName: String, $lastName: String, $email: String, $password: String, $confirmPassword: String ) {
    signUp(firstName: $firstName, lastName: $lastName, email: $email, password: $password, confirmPassword: $confirmPassword) 
    {
      message
      data {
        id
        firstName
        lastName
        email
      }
      token
    }
  }
`;
