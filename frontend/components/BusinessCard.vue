<script setup lang="ts">

import { computed } from "vue"


const props = defineProps({

  business: {
    type: Object,
    required: true
  }

})


const categoryName = computed(()=>{


  if(
    typeof props.business.category === "object"
    &&
    props.business.category
  ){

    return props.business.category.name

  }


  return props.business.category || "Business"

})



const truncateText = (

  text:string,

  length:number

)=>{


  if(!text)

    return ""


  return text.length > length

    ? text.substring(0,length) + "..."

    : text


}

</script>



<template>

<div class="business-card">


  <NuxtLink
    :to="`/market/${business.id}`"
    class="card-link"
  >


    <!-- IMAGE -->

    <div class="image-wrapper">

      <img

        :src="
          business.image_url
          ||
          business.image
          ||
          'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=600'
        "

        :alt="business.name"

        loading="lazy"

      />


      <span class="category-badge">

        {{ categoryName }}

      </span>


    </div>





    <!-- CONTENT -->

    <div class="content">


      <h3>

        {{ business.name }}

      </h3>



      <p class="address">

        📍

        {{ business.address || "No Address" }}

        ,

        {{ business.city || "Ethiopia" }}

      </p>




      <p
        class="phone"
        v-if="business.phone"
      >

        📞 {{ business.phone }}

      </p>




      <p
        class="description"
        v-if="business.description"
      >

        {{ truncateText(business.description,80) }}

      </p>



    </div>



  </NuxtLink>


</div>


</template>

<style scoped>
.business-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
}

.business-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
}

.card-link {
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.image-wrapper {
  position: relative;
  height: 180px;
  overflow: hidden;
  background: #f1f5f9;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.business-card:hover img {
  transform: scale(1.06);
}

.category-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #facc15;
  color: black;
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: bold;
  box-shadow: 0 4px 10px rgba(250, 204, 21, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.content {
  padding: 18px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.content h3 {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.address {
  font-size: 13px;
  color: #64748b;
  margin: 0 0 6px 0;
}

.phone {
  font-size: 13px;
  color: #64748b;
  margin: 0 0 10px 0;
}

.description {
  font-size: 13px;
  color: #64748b;
  margin: 0 0 15px 0;
  line-height: 1.5;
  flex-grow: 1;
}

.stats {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #f1f5f9;
  padding-top: 12px;
  margin-top: auto;
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
}
</style>
