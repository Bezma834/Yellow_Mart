
<script setup lang="ts">

import { ref, computed, onMounted } from "vue"
import { useRouter } from "vue-router"
import { GET_CATEGORIES } from "~/graphql/queries"

const router = useRouter()
const { $apollo } = useNuxtApp() as any

const showAll = ref(false)
const categories = ref<any[]>([])

const loadCategories = async () => {

  try {

    const result = await $apollo.query({

      query: GET_CATEGORIES,

      fetchPolicy: "network-only"

    })

    categories.value = result.data.categories || []

    console.log("Categories:", categories.value)

  }

  catch (error) {

    console.error("CATEGORY ERROR:", error)

  }

}

onMounted(() => {

  loadCategories()

})

const visibleCategories = computed(() => {

  return showAll.value

    ? categories.value

    : categories.value.slice(0, 8)

})

const toggleCategories = () => {

  showAll.value = !showAll.value

}
const openCategory = (categoryId:string)=>{

  router.push(`/category/${categoryId}`)

}

</script>
<template>

<section class="category-section">


  <div class="category-header">

    <div>

      <h2>
        Explore Categories
      </h2>

      <p>
        Discover businesses by category
      </p>

    </div>


    <button @click="toggleCategories">

      {{ showAll ? "Show Less ↑" : "View More →" }}

    </button>


  </div>



  <div class="category-grid">


    <div

      v-for="category in visibleCategories"

      :key="category.id"

      class="category-card"
@click="openCategory(category.id)"

    >


      <div class="icon">

        {{ category.icon }}

      </div>



      <h3>

        {{ category.name }}

      </h3>



      <p>

        Discover {{ category.name }} businesses

      </p>



      <span>

        Explore →

      </span>



    </div>


  </div>


</section>


</template>


<style scoped>


.category-section{


padding:80px 20px;

background:#f8fafc;


}




.category-header{


max-width:1200px;

margin:auto;

margin-bottom:40px;

display:flex;

justify-content:space-between;

align-items:center;


}



.category-header h2{


font-size:38px;

font-weight:700;


}



.category-header p{


color:#64748b;

font-size:18px;


}




.category-header button{


background:#facc15;

border:none;

padding:12px 25px;

border-radius:12px;

font-weight:bold;

cursor:pointer;

transition:.3s;


}



.category-header button:hover{


transform:translateY(-3px);

background:#eab308;


}







.category-grid{


max-width:1200px;

margin:auto;


display:grid;

grid-template-columns:

repeat(auto-fit,minmax(220px,1fr));


gap:25px;


}







.category-card{

background:white;

padding:30px 20px;

border-radius:22px;

cursor:pointer;

text-align:center;

border:1px solid #e5e7eb;

transition:all .35s ease;

position:relative;

overflow:hidden;

}



.category-card:hover{

transform:translateY(-8px);

border-color:#facc15;

box-shadow:

0 18px 35px rgba(0,0,0,.12);

}


.category-card:hover{


transform:translateY(-10px);


box-shadow:

0 20px 40px rgba(0,0,0,.15);


}






.icon{

width:70px;

height:70px;

margin:0 auto 18px;

display:flex;

align-items:center;

justify-content:center;

border-radius:20px;

background:#fef3c7;

font-size:42px;

transition:.3s ease;

}


.category-card:hover .icon{

transform:scale(1.1);

}


.category-card h3{

font-size:20px;

font-weight:800;

color:#111827;

margin-bottom:8px;

}



.category-card p{


color:#64748b;


}




.category-card span{


display:block;

margin-top:15px;

color:#eab308;

font-weight:bold;


}

.dark .category-card{

background:#1f2937;

border-color:#374151;

}


.dark .category-card h3{

color:white;

}


.dark .category-card p{

color:#d1d5db;

}


.dark .icon{

background:#374151;

}

</style>