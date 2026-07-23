import { gql } from "@apollo/client"


// ===============================
// Featured Businesses
// ===============================

export const GET_FEATURED_BUSINESSES = gql`

query GetFeaturedBusinesses {

  businesses(
    where:{
      featured:{
        _eq:true
      }
    }
    limit:6
  ){

    id
    name
    description

    category {
      id
      name
    }

    phone
    address
    city
    image
    lat
    lng

  }

}

`


// ===============================
// Business By ID
// ===============================

export const GET_BUSINESS_BY_ID = gql`

query GetBusinessById($id: uuid!) {

  businesses_by_pk(id:$id){

    id
    name
    description

    phone
    address
    city
    image

    lat
    lng

    category {

      id
      name
      icon

    }

  }

}

`

// ===============================
// All Businesses
// ===============================

export const GET_ALL_BUSINESSES = gql`

query GetAllBusinesses {

  businesses(
    where: {
      status: {
        _eq: "approved"
      }
    }
  ) {

    id
    name
    description

    category {
      id
      name
    }

    phone
    address
    city
    image
    lat
    lng
    featured
    status

  }

}

`

// ===============================
// Categories
// ===============================

export const GET_CATEGORIES = gql`
query GetCategories {

  categories {

    id
    name
    icon

  }

}
`


// ===============================
// Search Businesses
// ===============================

export const SEARCH_BUSINESSES = gql`

query SearchBusinesses($search:String!) {

  businesses(

   where:{

status:{
_eq:"approved"
}

_or:[

{
name:{
_ilike:$search
}
},

{
city:{
_ilike:$search
}
},

{
description:{
_ilike:$search
}
}

]

}

  ){

    id
    name
    description

    category {

      id
      name

    }

    phone
    address
    city
    image
    lat
    lng

  }

}

`


// ===============================
// Create Business
// ===============================
export const CREATE_BUSINESS = gql`

mutation CreateBusiness(

$category_id: uuid!,
$owner_id: uuid!,
$name: String!,
$description: String,
$phone: String!,
$address: String!,
$city: String!,
$image: String!,
$lat: numeric,
$lng: numeric

){

  insert_businesses_one(
    object:{

      category_id:$category_id,
      owner_id:$owner_id,

      name:$name,
      description:$description,

      phone:$phone,
      address:$address,
      city:$city,

      image:$image,

      lat:$lat,
      lng:$lng,

      status:"pending"

    }
  ){

    id
    name
    image
    status

  }

}

`
// ===============================
// Add Favorite
// ===============================

export const ADD_FAVORITE = gql`
mutation AddFavorite(
  $user_id: uuid!,
  $business_id: uuid!
) {
  insert_favorites_one(
    object: {
      user_id: $user_id
      business_id: $business_id
    }
  ) {
    id
    user_id
    business_id
  }
}
`

// ===============================
// Remove Favorite
// ===============================

export const REMOVE_FAVORITE = gql`
mutation RemoveFavorite(
  $user_id: uuid!,
  $business_id: uuid!
) {
  delete_favorites(
    where: {
      user_id: { _eq: $user_id }
      business_id: { _eq: $business_id }
    }
  ) {
    affected_rows
  }
}
`

// ===============================
// Get User Favorites
// ===============================

export const GET_USER_FAVORITES = gql`

query GetUserFavorites($user_id: uuid!) {

  favorites(
    where:{
      user_id:{
        _eq:$user_id
      }
    }
  ){

    id

    business {

      id
      name
      description
      image
      phone
      address
      city
      lat
      lng
      views
      likes

      category {

        id
        name

      }

    }

  }

}

`
const GET_PROFILE_STATS = gql`

query GetProfileStats($owner_id: uuid!) {

  businesses(
    where: {
      owner_id: {
        _eq: $owner_id
      }
    }
  ) {

    id
    views

    favorites_aggregate {
      aggregate {
        count
      }
    }

  }

}

`

export const GET_BUSINESSES_BY_CATEGORY = gql`
query GetBusinessesByCategory($category_id: uuid!) {
  businesses(
    where:{
  category_id:{
    _eq:$category_id
  }
  status:{
    _eq:"approved"
  }
}
  ) 
    {
    id
    name
    description
    phone
    address
    city
    image
    lat
    lng
    featured
    views

    category {
      id
      name
    }
  }
}
`
export const GET_PENDING_BUSINESSES = gql`

query GetPendingBusinesses {

  businesses(
    where:{
      status:{
        _eq:"pending"
      }
    }
  ){

    id
    name
    description
    phone
    address
    city
    image
    status

    category{
      name
    }

  }

}

`
// ===============================
// Admin Dashboard Stats
// ===============================

export const GET_ADMIN_STATS = gql`

query GetAdminStats {

  businesses_aggregate {
    aggregate {
      count
    }
  }


  pending_businesses: businesses_aggregate(
    where:{
      status:{
        _eq:"pending"
      }
    }
  ){
    aggregate{
      count
    }
  }


  approved_businesses: businesses_aggregate(
    where:{
      status:{
        _eq:"approved"
      }
    }
  ){
    aggregate{
      count
    }
  }


  rejected_businesses: businesses_aggregate(
    where:{
      status:{
        _eq:"rejected"
      }
    }
  ){
    aggregate{
      count
    }
  }


  categories_aggregate {

    aggregate{
      count
    }

  }


  users_aggregate {

    aggregate{
      count
    }

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
// ===============================
// ADMIN CATEGORY MANAGEMENT
// ===============================


export const GET_ALL_CATEGORIES_ADMIN = gql`

query GetAllCategoriesAdmin {

categories {


id

name

icon



businesses_aggregate {


aggregate{

count

}


}



}


}


`



export const CREATE_CATEGORY = gql`

mutation CreateCategory(
$name:String!,
$icon:String
){

insert_categories_one(
object:{
name:$name
icon:$icon
}
){

id
name
icon

}

}

`



export const DELETE_CATEGORY = gql`

mutation DeleteCategory(
$id:uuid!
){

delete_categories_by_pk(
id:$id
){

id

}

}

`
// ===============================
// Update Category
// ===============================

export const UPDATE_CATEGORY = gql`

mutation UpdateCategory(
$id:uuid!,
$name:String!,
$icon:String
){

update_categories_by_pk(

pk_columns:{
id:$id
}

_set:{

name:$name
icon:$icon

}

){

id
name
icon

}

}

`
// ===============================
// ADMIN USERS
// ===============================


export const GET_ALL_USERS = gql`

query GetAllUsers {

users {

id

email

fullname

username

avatar

phone

role

created_at

}

}

`



export const UPDATE_USER_ROLE = gql`

mutation UpdateUserRole(
$id:uuid!,
$role:String!
){

update_users_by_pk(

pk_columns:{
id:$id
}

_set:{

role:$role

}

){

id
role

}

}

`



export const DELETE_USER = gql`

mutation DeleteUser(
$id:uuid!
){

delete_users_by_pk(
id:$id
){

id

}

}

`
export const LOGIN_USER = gql`

query Login(
$email:String!,
$password:String!
){

users(
where:{
email:{
_eq:$email
}
password:{
_eq:$password
}
}
){

id
email

}

}

`