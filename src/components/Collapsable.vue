<template>
  <div class="collapsable">
        <input :id="`collapsible-${uniqueKey}`" class="toggle" type="checkbox" checked>
        <label :for="`collapsible-${uniqueKey}`" class="lbl-toggle" tabindex="0">
            <h2>{{ title }}</h2>
        </label>
        <div class="collapsible-content">
            <div class="content-inner">
            <slot></slot>
            </div>
        </div>
  </div>
</template>

<script>
export default {
  name: 'CollapsableContainer',
  props: {
    uniqueKey: String,
    title: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

.collapsable {
    width: 310px;
    padding: 5px;
    margin: 10px;
    border-radius: 10px;
    background: #1CA8DD;
    background: -webkit-linear-gradient(to left top, #9F86FF, #1CA8DD, #007AE1);
    background: linear-gradient(to left top, #9F86FF, #1CA8DD, #007AE1);
    box-shadow: 1px 1px 2px #130f23;

    .wrap-collabsible {
        margin-bottom: 1.2rem 0;
    }

    input[type='checkbox'] {
        display: none;
    }

    label {
        outline: none;
    }

    .lbl-toggle {
        display: block;
        padding: 1rem;
        cursor: pointer;
        border-radius: 7px;
        transition: all 0.25s ease-out;
        text-align: left;
        color: #2f323ae6;

        h2 {
            margin: 0;
            padding: 0;
            display: inline;
        }
    }

    .lbl-toggle:hover {
        color: #2f323a;
    }

    .lbl-toggle::before {
        content: ' ';
        display: inline-block;
        border-top: 5px solid transparent;
        border-bottom: 5px solid transparent;
        border-left: 5px solid currentColor;
        vertical-align: middle;
        margin-right: .7rem;
        transform: translateY(-2px);

        transition: transform .2s ease-out;
    }

    .toggle:checked + .lbl-toggle::before {
        transform: rotate(90deg) translateX(-3px);
    }

    .collapsible-content {
        max-height: 0px;
        overflow: hidden;
        transition: max-height .25s ease-in-out;
        background: #2f323ae6;
        border-radius: 0 0 10px 10px;
    }

    .toggle:checked + .lbl-toggle + .collapsible-content {
        max-height: 350px;
    }

    .toggle:checked + .lbl-toggle {
        border-bottom-right-radius: 0;
        border-bottom-left-radius: 0;
    }

    .collapsible-content .content-inner {
        padding: 0.5rem;
    }
}
</style>
