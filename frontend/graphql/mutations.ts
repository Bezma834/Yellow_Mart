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