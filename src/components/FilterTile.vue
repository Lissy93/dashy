<template>
    <div>
        <el-input
          placeholder="Start typing station name or code"
          v-model="input"
          v-on:input="userIsTypingSomething">
        </el-input>
    </div>
</template>

<script>

export default {
  name: 'FilterTile',
  data () {
    return {
      input: ''
    }
  },
  methods: {
    userIsTypingSomething (stuff) {
      this.$emit('user-is-searchin', stuff)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
