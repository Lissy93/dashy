<template>
  <div class="collapsable">
        <input id="collapsible" class="toggle" type="checkbox">
        <label for="collapsible" class="lbl-toggle" tabindex="0">More Info</label>
        <div class="collapsible-content">
            <div class="content-inner">
            <p>
                QUnit is by calling one of the object that are embedded in JavaScript, and faster JavaScript program could also used with
                its elegant, well documented, and functional programming using JS, HTML pages Modernizr is a popular browsers without
                plug-ins. Test-Driven Development.
            </p>
            </div>
        </div>
  </div>
</template>

<script>
export default {
  name: 'Footer',
  props: {
   
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

.collapsable {
    border: 2px dashed red;

    .wrap-collabsible {
        margin-bottom: 1.2rem 0;
    }

    input[type='checkbox'] {
        display: none;
    }

    .lbl-toggle {
        display: block;

        font-weight: bold;
        font-family: monospace;
        font-size: 1.2rem;
        text-transform: uppercase;
        text-align: center;

        padding: 1rem;

        color: #A77B0E;
        background: #FAE042;

        cursor: pointer;

        border-radius: 7px;
        transition: all 0.25s ease-out;
    }

    .lbl-toggle:hover {
        color: #7C5A0B;
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
    }

    .toggle:checked + .lbl-toggle + .collapsible-content {
        max-height: 350px;
    }

    .toggle:checked + .lbl-toggle {
        border-bottom-right-radius: 0;
        border-bottom-left-radius: 0;
    }

    .collapsible-content .content-inner {
        background: rgba(250, 224, 66, .2);
        border-bottom: 1px solid rgba(250, 224, 66, .45);
        border-bottom-left-radius: 7px;
        border-bottom-right-radius: 7px;
        padding: .5rem 1rem;
    }
}
</style>
