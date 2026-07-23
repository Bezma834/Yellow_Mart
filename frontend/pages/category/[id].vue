<script setup lang="ts">

import { ref, computed, onMounted } from "vue"

import BusinessCard from "~/components/BusinessCard.vue"

import { GET_BUSINESSES_BY_CATEGORY } from "~/graphql/queries"


const route = useRoute()

const { $apollo } = useNuxtApp() as any


const businesses = ref<any[]>([])

const loading = ref(true)

const categoryName = ref("")

const sortType = ref("featured")



const loadCategoryBusinesses = async()=>{

  try{

    const result = await $apollo.query({

      query: GET_BUSINESSES_BY_CATEGORY,

      variables:{

        category_id: String(route.params.id)

      },

      fetchPolicy:"network-only"

    })


    businesses.value = result.data.businesses || []


    if(businesses.value.length){

      categoryName.value =
        businesses.value[0].category?.name || "Businesses"

    }


    console.log(
      "CATEGORY BUSINESSES:",
      businesses.value
    )


  }

  catch(error){

    console.error(
      "CATEGORY ERROR:",
      error
    )

  }

  finally{

    loading.value=false

  }

}





const sortedBusinesses = computed(()=>{

  const data = [...businesses.value]


  if(sortType.value === "popular"){

    return data.sort(
      (a,b)=>(b.views || 0)-(a.views || 0)
    )

  }


  if(sortType.value === "a-z"){

    return data.sort(
      (a,b)=>a.name.localeCompare(b.name)
    )

  }


  return data

})




onMounted(()=>{

  loadCategoryBusinesses()

})


</script><template>

<section class="category-page">


<div class="container">


<div class="category-header">


<h1>
  🏷️ {{ categoryName }} Businesses
</h1>


<p>
  Discover the best {{ categoryName }} businesses near you
</p>


</div>



<div class="toolbar">


<h2>
{{ businesses.length }} Businesses Found
</h2>



<div class="filters">


<button
:class="{active:sortType==='featured'}"
@click="sortType='featured'"
>
⭐ Featured
</button>


<button
:class="{active:sortType==='popular'}"
@click="sortType='popular'"
>
🔥 Popular
</button>


<button
:class="{active:sortType==='a-z'}"
@click="sortType='a-z'"
>
🔤 A-Z
</button>


</div>


</div>




<div
v-if="loading"
class="loading"
>

<div class="loader"></div>

Loading businesses...

</div>





<div
v-else-if="sortedBusinesses.length"
class="business-grid"
>


<BusinessCard

v-for="business in sortedBusinesses"

:key="business.id"

:business="business"

/>


</div>





<div
v-else
class="empty"
>

<h3>
😔 No businesses found
</h3>


<p>
Try another category
</p>


</div>



</div>


</section>


</template>

<style scoped>

.category-page{

  min-height:100vh;

  background:#f8fafc;

  padding:60px 20px;

}


.container{

  max-width:1200px;

  margin:auto;

}


/* CATEGORY HEADER */

.category-header{

  background:#facc15;

  padding:45px 30px;

  border-radius:30px;

  text-align:center;

  margin-bottom:40px;

  box-shadow:
  0 15px 35px rgba(0,0,0,.08);

}


.category-header h1{

  font-size:42px;

  font-weight:900;

  color:#111827;

  margin-bottom:10px;

}


.category-header p{

  color:#374151;

  font-size:18px;

}


/* TOOLBAR */

.toolbar{

  display:flex;

  justify-content:space-between;

  align-items:center;

  gap:20px;

  margin-bottom:35px;

}


.toolbar h2{

  font-size:26px;

  font-weight:800;

  color:#111827;

}


/* FILTER BUTTONS */

.filters{

  display:flex;

  gap:12px;

  flex-wrap:wrap;

}


.filters button{

  padding:10px 22px;

  border-radius:25px;

  border:1px solid #e5e7eb;

  background:white;

  font-weight:700;

  cursor:pointer;

  transition:.3s ease;

}


.filters button:hover{

  transform:translateY(-3px);

}


.filters button.active{

  background:#facc15;

  border-color:#facc15;

  color:#111827;

}


/* BUSINESS GRID */

.business-grid{

  display:grid;

  grid-template-columns:

  repeat(auto-fit,minmax(280px,1fr));

  gap:25px;

}


/* LOADING */

.loading{

  text-align:center;

  padding:60px;

  font-size:20px;

  color:#374151;

}


.loader{

  width:40px;

  height:40px;

  margin:0 auto 15px;

  border-radius:50%;

  border:4px solid #e5e7eb;

  border-top-color:#facc15;

  animation:spin 1s linear infinite;

}


@keyframes spin{

  to{

    transform:rotate(360deg);

  }

}



/* EMPTY */

.empty{

  background:white;

  padding:60px;

  border-radius:25px;

  text-align:center;

  box-shadow:

  0 10px 25px rgba(0,0,0,.08);

}


.empty h3{

  font-size:28px;

  font-weight:800;

  margin-bottom:10px;

}


.empty p{

  color:#64748b;

}



/* DARK MODE */

.dark .category-page{

  background:#111827;

}


.dark .toolbar h2{

  color:white;

}


.dark .filters button{

  background:#1f2937;

  color:white;

  border-color:#374151;

}


.dark .filters button.active{

  background:#facc15;

  color:#111827;

}


.dark .empty{

  background:#1f2937;

  color:white;

}


.dark .empty p{

  color:#d1d5db;

}


/* MOBILE */

@media(max-width:700px){


  .category-header h1{

    font-size:30px;

  }


  .toolbar{

    flex-direction:column;

    align-items:flex-start;

  }


  .filters{

    width:100%;

    overflow-x:auto;

  }


  .filters button{

    white-space:nowrap;

  }


}

</style>