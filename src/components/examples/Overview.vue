<script setup lang="ts">
import { VisAxis, VisStackedBar, VisXYContainer } from '@unovis/vue'

type Data = typeof data[number]
const data = [
  { name: '1', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: '2', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: '3', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: '4', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: '5', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: '6', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: '7', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: '8', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: '9', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: '10', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: '11', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: '12', total: Math.floor(Math.random() * 5000) + 1000 },
]
</script>

<template>
  <VisXYContainer height="350px" :margin="{ left: 20, right: 20 }" :data="data">
    <VisStackedBar
      :x="(d: Data, i: number) => i"
      :y="(d: Data) => d.total"
      color="#41b883"
      :rounded-corners="4"
      :bar-padding="0.15"
    />
    <VisAxis
      type="x"
      :num-ticks="data.length"
      :tick-format="(index: number) => data[index]?.name"
      :grid-line="false"
      :tick-line="false" color="#888888"
    />
    <VisAxis
      type="y"
      :num-ticks="data.length"
      :tick-format="(index: number) => data[index]?.name"
      :grid-line="false"
      :tick-line="false"
      :domain-line="false" color="#888888"
    />
  </VisXYContainer>
</template>