<script setup lang="ts">
import { ref, watch } from 'vue'

// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
// @ts-ignore
import HelloWorld from './components/HelloWorld.vue'

const alert = ref(true)

alert.value = true

const floating = {
  vertical: 'top',
  horizontal: 'left',
}
const reference = {
  vertical: 'bottom',
  horizontal: 'left',
}

// watch(floating.vertical, () => {
//   console.log('data')
// })
// watch(floating.horizontal, () => {
  
// })

// watch(reference.vertical, () => {

// })
// watch(reference.horizontal, () => {
  
// })

const placements: string[] = []
function onChangedPlacement(e: any, name: string, axis: string) {
  const placement = `${floating.vertical}-${floating.horizontal}-${reference.vertical}-${reference.horizontal}`
  if (!placements.includes(placement)) {
    placements.push(placement)
  }
}


function onChecDataPlacement() {
  console.log(placements, placements.length)
}

</script>

<template>
  <div class="px-6 py-4">
    <Alert
      v-model="alert"
      class="rounded bg-red-600 border-l-8 border-l-red-400 p-4 text-white"
      title="Header"
      close
    >
      <template #title="{ title }">
        <span class="text-base font-semibold">{{ title }}</span>
      </template>
      <span class="text-sm">Message</span>
    </Alert>
  </div>
  <div class="px-6 py-4">
    <Alert
      v-model="alert"
      class="rounded bg-red-600 p-4 text-white"
      title="Header"
      close
    >
      <template #title="{ title }">
        <span class="text-base font-semibold">{{ title }}</span>
      </template>
      <span class="text-sm">Message</span>
    </Alert>
  </div>

  <button @click="alert = !alert">Show Alert</button>

  <div class="overflow-auto h-96 w-96 mx-auto border static border-dashed border-gray-600 z-10">
    <div style="display: block;height: 500px;width: 1000px;"></div>
    <div style="display: block;height: 500px;width: 1000px;"></div>
    <div style="display: block;height: 500px;width: 1000px;"></div>
    <div class="flex items-center justify-center mt-96" style="margin-left: 500px;">
      <div class="py-2 px-3 !w-120 bg-purple-600 text-center">
        Test  Mantap
        <GenMenu>
          Is Menu
        </GenMenu>
      </div>
    </div>
    <div style="display: block;height: 300px;width: 1000px;"></div>
    <div style="display: block;height: 300px;width: 1000px;"></div>
    <div style="display: block;height: 300px;width: 1000px;"></div>
    <div style="display: block;height: 300px;width: 1000px;"></div>
  </div>
  <div>
    <div>
      Floating

      <div>
        Vertical

        <label>
          <input v-model="floating.vertical" type="radio" name="floating-vertical" value="top" @change="onChangedPlacement($event, 'floating', 'vertical')" />
          Top
        </label>
        <label>
          <input v-model="floating.vertical" type="radio" name="floating-vertical" value="center" @change="onChangedPlacement($event, 'floating', 'vertical')" />
          Center
        </label>
        <label>
          <input v-model="floating.vertical" type="radio" name="floating-vertical" value="bottom" @change="onChangedPlacement($event, 'floating', 'vertical')" />
          Bottom
        </label>
      </div>

      <div>
        Horizontal
        
        <label>
          <input v-model="floating.horizontal" type="radio" name="floating-horizontal" value="left" @change="onChangedPlacement($event, 'floating', 'horizontal')" />
          Left
        </label>
        <label>
          <input v-model="floating.horizontal" type="radio" name="floating-horizontal" value="middle" @change="onChangedPlacement($event, 'floating', 'horizontal')" />
          Middle
        </label>
        <label>
          <input v-model="floating.horizontal" type="radio" name="floating-horizontal" value="right" @change="onChangedPlacement($event, 'floating', 'horizontal')" />
          Right
        </label>
      </div>
    </div>
    <div>
      Reference

      <div>
        Vertical

        <label>
          <input v-model="reference.vertical" type="radio" name="reference-vertical" value="top" @change="onChangedPlacement($event, 'reference', 'vertical')" />
          Top
        </label>
        <label>
          <input v-model="reference.vertical" type="radio" name="reference-vertical" value="center" @change="onChangedPlacement($event, 'reference', 'vertical')" />
          Center
        </label>
        <label>
          <input v-model="reference.vertical" type="radio" name="reference-vertical" value="bottom" @change="onChangedPlacement($event, 'reference', 'vertical')" />
          Bottom
        </label>
      </div>

      <div>
        Horizontal
        
        <label>
          <input v-model="reference.horizontal" type="radio" name="reference-horizontal" value="left" @change="onChangedPlacement($event, 'reference', 'horizontal')" />
          Left
        </label>
        <label>
          <input v-model="reference.horizontal" type="radio" name="reference-horizontal" value="middle" @change="onChangedPlacement($event, 'reference', 'horizontal')" />
          Middle
        </label>
        <label>
          <input v-model="reference.horizontal" type="radio" name="reference-horizontal" value="right" @change="onChangedPlacement($event, 'reference', 'horizontal')" />
          Right
        </label>
      </div>
    </div>
  </div>
  <button type="button" @click="onChecDataPlacement">Check</button>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  padding: 20px;
}
</style>
