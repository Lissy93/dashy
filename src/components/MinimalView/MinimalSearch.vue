<template>
  <SearchBar
    ref="MinimalSearchBar"
    @user-is-searchin="userIsTypingSomething"
    :active="true"
    :minimalSearch="true"
  />
</template>

<script>
import SearchBar from '@/components/Settings/SearchBar';

export default {
  name: 'MinimalSearch',
  inject: ['config'],
  components: {
    SearchBar,
  },
  props: {
    active: Boolean,
  },
  data() {
    return {
      input: '', // Users current search term
    };
  },
  methods: {
    /* Emmits users's search term up to parent */
    userIsTypingSomething(searchValue) {
      this.input = searchValue;
      this.$emit('user-is-searchin', searchValue);
    },
    /* Emmits an event to reset state when user is finished searching */
    clearMinFilterInput() {
      this.$refs.MinimalSearchBar.clearFilterInput();
    },
  },
};
</script>
