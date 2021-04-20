<template>
    <nav id="nav">
        <router-link
            v-for="(link, index) in links"
            :key="index"
            :to="link.path"
            :href="link.path"
            :target="isUrl(link.path) ? '_blank' : ''"
            rel="noopener noreferrer"
            class="nav-item"
        >{{link.title}}</router-link>
    </nav>
</template>

<script>
export default {
  name: 'Nav',
  props: {
    links: Array,
  },
  methods: {
    isUrl: (str) => new RegExp(/(http|https):\/\/(\S+)(:[0-9]+)?/).test(str),
  },
};
</script>

<style scoped lang="scss">

nav {
    display: flex;
    align-items: center;
    .nav-item {
        display: inline-block;
        padding: 0.75rem 0.5rem;
        margin: 0.5rem;
        outline: none;
        border: none;
        border-radius: var(--curve-factor);
        background: #607d8b33;
        -webkit-box-shadow: 1px 1px 2px #232323;
        box-shadow: 1px 1px 2px #232323;
        color: var(--primary);
        text-decoration: none;
        &:hover {
            background: #607d8b1c;
            box-shadow: 1px 4px 3px #232323;
        }
    }
    .router-link-active {
        border: 1px solid var(--primary);
    }
}
</style>
