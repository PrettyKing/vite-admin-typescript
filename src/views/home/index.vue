<template>
    <!-- <hello-world msg="hello"></hello-world> -->
    <h2>Home{{isCollapse}}</h2>
</template>

<script lang="ts">
import { defineComponent,computed } from "vue";
import HelloWorld from '../../components/HelloWorld.vue'
import { useHStore } from "../../hooks/useStore";
export default defineComponent({
    components:{
        HelloWorld
    },
    setup() {
      const store = useHStore();
      const {state} = store;  
      return {
          isCollapse: computed(() => state.user.isCollapse),
      }
    },
});
</script>
