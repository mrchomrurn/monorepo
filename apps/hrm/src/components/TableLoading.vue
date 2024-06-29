<script setup lang="ts">
const spinnerStyle = {
  height: '25px',
  width: '4px',
  margin: '2px',
  borderRadius: '2px',
  display: 'inline-block',
  animationName: 'v-scaleStretchDelay',
  animationDuration: '1s',
  animationIterationCount: 'infinite',
  animationTimingFunction: 'cubic-bezier(.2,.68,.18,1.08)',
  animationFillMode: 'both',
}
const spinnerDelay1 = {
  animationDelay: '0.1s',
}
const spinnerDelay2 = {
  animationDelay: '0.2s',
}
const spinnerDelay3 = {
  animationDelay: '0.3s',
}
const spinnerDelay4 = {
  animationDelay: '0.4s',
}
const spinnerDelay5 = {
  animationDelay: '0.5s',
}
</script>

<template>
  <div class="v-spinner [&>*]:bg-primary">
    <div class="v-scale v-scale1" :style="[spinnerStyle, spinnerDelay1]" />
    <div class="v-scale v-scale2" :style="[spinnerStyle, spinnerDelay2]" />
    <div class="v-scale v-scale3" :style="[spinnerStyle, spinnerDelay3]" />
    <div class="v-scale v-scale4" :style="[spinnerStyle, spinnerDelay4]" />
    <div class="v-scale v-scale5" :style="[spinnerStyle, spinnerDelay5]" />
  </div>
</template>

<style>
@-webkit-keyframes v-scaleStretchDelay
{
  0%
  {
    -webkit-animation-name: inherit;
    -webkit-animation-duration: inherit;
    -webkit-animation-iteration-count: inherit;
    -webkit-animation-direction: inherit;
  }
  100%
  {
    -webkit-transform: scaleY(1);
    transform: scaleY(1);
  }
  50%
  {
    -webkit-transform: scaleY(0.4);
    transform: scaleY(0.4);
  }
}

@keyframes v-scaleStretchDelay
{
  0%
  {
    -webkit-animation-name: inherit;
    -webkit-animation-duration: inherit;
    -webkit-animation-iteration-count: inherit;
    -webkit-animation-direction: inherit;
  }
  100%
  {
      -webkit-transform: scaleY(1);
      transform: scaleY(1);
  }
  50%
  {
      -webkit-transform: scaleY(0.4);
      transform: scaleY(0.4);
  }
}
</style>
