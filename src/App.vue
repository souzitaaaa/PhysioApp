<template>
  <div class="card flex justify-center">
    <Button label="Submit" />
    <ToggleSwitch v-model="checked" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      checked: false
    }
  }
};
</script>
