import { gql } from "@apollo/client"
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