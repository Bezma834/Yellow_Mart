import gql from "graphql-tag"
export const REJECT_BUSINESS = gql`

mutation RejectBusiness($id:uuid!){

  update_businesses_by_pk(
    pk_columns:{
      id:$id
    }

    _set:{
      status:"rejected"
    }

  ){

    id
    status

  }

}

`
export const DELETE_BUSINESS = gql`

mutation DeleteBusiness($id:uuid!){

  delete_businesses_by_pk(
    id:$id
  ){
    id
    name
  }

}

`
export const APPROVE_BUSINESS = gql`

mutation ApproveBusiness($id:uuid!){

  update_businesses_by_pk(
    pk_columns:{
      id:$id
    }

    _set:{
      status:"approved"
    }

  ){

    id
    status

  }

}

`
// ==============================
// AUTH ACTIONS (via Hasura Actions)
// Frontend -> Hasura -> Action webhook -> backend
// ==============================

export const SIGNUP_MUTATION = gql`

mutation Signup($username: String!, $name: String!, $email: String!, $password: String!, $phone: String, $avatar: String) {

  signup(
    username: $username
    name: $name
    email: $email
    password: $password
    phone: $phone
    avatar: $avatar
  ) {
    user {
      id
      username
      fullname
      email
      phone
      avatar
      role
    }
    emailVerified
    message
  }

}

`

export const CHECK_EMAIL_MUTATION = gql`

mutation CheckEmail($email: String!) {

  checkEmail(email: $email) {
    valid
    message
  }

}

`

export const FORGOT_PASSWORD_MUTATION = gql`

mutation ForgotPassword($username: String!, $email: String!) {

  forgotPassword(username: $username, email: $email) {
    message
  }

}

`

export const RESET_PASSWORD_MUTATION = gql`

mutation ResetPassword($token: String!, $password: String!) {

  resetPassword(token: $token, password: $password) {
    message
  }

}

`

export const CHANGE_PASSWORD_MUTATION = gql`

mutation ChangePassword($oldPassword: String!, $newPassword: String!) {

  changePassword(oldPassword: $oldPassword, newPassword: $newPassword) {
    message
  }

}

`

export const DELETE_ACCOUNT_MUTATION = gql`

mutation DeleteAccount($password: String!) {

  deleteAccount(password: $password) {
    message
  }

}

`
