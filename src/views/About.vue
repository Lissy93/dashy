<template>
  <article class="about">
    <h1>About Dashy</h1>
    <section>
      <h2>Project Overview</h2>
      <p>
        Dashy is a self-hosted startpage for keeping your running applications and
        services organised. The aim of Dashy is to provide an easy-to-deploy,
        highly customizable and functianl dashboard, in order to improvde productivity
        and enable easy organisation of running services or web links.
      </p>
    </section>

    <section>
      <h2>Source</h2>
      <p>
        Dashy's source is available through <a href="https://github.com/lissy93/dashy">GitHub</a>,
        and the Docker image is on <a href="https://hub.docker.com/r/lissy93/dashy">DockerHub</a>.
      </p>
    </section>

    <section>
      <h2>Reporting a Bug</h2>
      <p>
        If you've come across an bug in Dashy, please <a href="https://git.io/JnqPR">open an issue</a>,
        so that it can be fixed.
      </p>
    </section>

    <section>
      <h2>Getting Support</h2>
      <p>
        If you need any help deploying, using, or developing Dashy, feel free to
        <a href="https://git.io/JnqiA">open a support ticket</a> or start a
        <a href="https://github.com/Lissy93/dashy/discussions">discussion</a> on GitHub.
      </p>
    </section>

    <section>
      <h2>About the Author</h2>
      <a href="https://aliciasykes.com">
        <img class="aht-pic" src="https://i.ibb.co/FnxqTfx/aht-bot-round.png" alt="Alicia Sykes">
      </a>
      Dashy is developed an maintained by <a href="https://aliciasykes.com">Alicia Sykes</a>
      (<a href="https://github.com/lissy93">@Lissy93</a>), with support from the community.
      <ul>
        <li><b>PGP Key</b> - <a href="https://keybase.io/aliciasykes/pgp_keys.asc?fingerprint=0688f8d34587d954e9e51fb8fedb68f55c0283a7"><code>0688 F8D3 4587 D954 E9E5  1FB8 FEDB 68F5 5C02 83A7</code></a></li>
        <li><b>BTC Address</b> - <code>3853bSxupMjvxEYfwGDGAaLZhTKxB2vEVC</code></li>
        <li><b>Mail</b> - <code>alicia at omg dot lol</code></li>
        <li><b>Blog</b> - <a href="https://notes.aliciasykes.com">notes.aliciasykes.com</a></li>
      </ul>
    </section>

    <section class="license">
      <h2>License</h2>
      <code>
        Copyright © 2021 Alicia Sykes (https://aliciasykes.com)
      </code>
      <br><br>
      <code>
        Permission is hereby granted, free of charge, to any person obtaining a copy of this
        software and associated documentation files (the “Software”), to deal in the Software
        without restriction, including without limitation the rights to use, copy, modify, merge,
        publish, distribute, sublicense, and/or sell copies of the Software, and to permit
        persons to whom the Software is furnished to do so, subject to the following conditions:
      </code>
      <br><br>
      <code>
        The above copyright notice and this permission notice shall be included in all copies or
        substantial portions of the Software.
      </code>
      <br><br>
      <code>
        THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
        INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
        PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
        LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
        TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWAREOR THE USE
        OR OTHER DEALINGS IN THE SOFTWARE.
      </code>
    </section>
  </article>
</template>

<script>
document.getElementsByTagName('html')[0].setAttribute('data-theme', 'callisto');
</script>

<style scoped lang="scss">

article.about {
  background: var(--about-page-background);
  color: var(--about-page-color);
  width: 80%;
  max-width: 1000px;
  margin: 1rem auto 2.5rem auto;
  padding: 1rem;
  border: 1px solid var(--about-page-accent);
  border-radius: var(--curve-factor);
  h1, h2, h3, p, span, div, section {
    color: var(--about-page-color);
  }
  h1 {
    font-size: 2rem;
    text-align: center;
  }
  a, code {
    color: var(--about-page-accent);
  }
  section {
    padding-bottom: 1rem;
    &:not(:last-child) {
      border-bottom: 1px dashed var(--about-page-accent);
    }
  }
  p {
    line-height: 1.5rem;
    font-size: 1rem;
  }
  img.aht-pic {
    width: 100px;
    float: right;
  }
  section.license code {
    color: var(--about-page-color);
  }
}

</style>
