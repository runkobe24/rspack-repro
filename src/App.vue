<template>
  <div class="content">
    <h1>Rsbuild with Vue</h1>
    <p>1111</p>
    <i class="icon-product" style="font-size: 16px;color: red"></i>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Home",

  mounted() {
    console.log("Home mounted");
    this.sayHello('1')
  },

  methods: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sayHello(a: any) {
      console.log(a)
    },
  },
});
</script>

<style lang="stylus">
@require './lib/icomoon/style.css'
@require './lib/stylus/index.styl'

.content {
  display: flex;
  min-height: 100vh;
  line-height: 1.1;
  text-align: center;
  flex-direction: column;
  justify-content: center;
}

.content h1 {
  font-size: 3.6rem;
  font-weight: 700;
}

.content p {
  font-size: 1.2rem;
  font-weight: 400;
  opacity: 0.5;
}
</style>
