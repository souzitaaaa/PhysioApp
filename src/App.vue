<template>
  <div class="card flex justify-center">
    <Button label="Submit" />
    <Button label="Ferreira" />
    <ToggleSwitch v-model="checked" />
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
