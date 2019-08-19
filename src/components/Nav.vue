<template>
    <nav id="nav">
        <router-link to="/" class="nav-item">Home</router-link>
        <router-link to="/about" class="nav-item">About</router-link>
    </nav>

</template>

<script>
export default {
  name: 'Nav'
}
</script>

<style scoped lang="scss">
nav {
    display: flex;
    align-items: center;
    .nav-item {
        display: inline-block;
        padding: 0.75em 0.5em;
        margin: 0.5em;
        outline: none;
        border: none;
        border-radius: 5px;
        background: #607d8b33;
        -webkit-box-shadow: 1px 1px 2px #232323;
        box-shadow: 1px 1px 2px #232323;
        color: #1CA8DD;
        font-family: "Comfortaa", cursive;
        text-decoration: none;
        &:hover {
            background: #607d8b1c;
            box-shadow: 1px 4px 3px #232323;
        }
    }
    .router-link-active {
        border: 1px solid #1CA8DD;
    }
}
</style>
