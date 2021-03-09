# Server Landing Page

> A static site linking to all running services for networking, management and monitoring

---

## Developing 🧱

Project structure is fairly standard, to run it locally, just `git clone`, `cd` into it, `yarn install` the dependencies, and then run one of the following:

- `yarn run dev` - Starts dev server, with hot-reload, and diff-linting
- `yarn run build` - Compiles and minifies for production
- `yarn run start` - Will serve up the **built**  production app from the `dist` dir
- `yarn run lint` - Lints and fixes files
- `yarn run test` - Runs all tests

---

## Configuring

- Data for the tiles is specified in [`src/data/item-data.json`](https://github.com/Lissy93/server-start-page/blob/master/src/data/item-data.json).
- Image assets are stored in [`public/img/item-icons/`](https://github.com/Lissy93/server-start-page/tree/master/public/img/item-icons), you can either use font-awesome, the pre-configured gradient icons, or add your own.
- The color scheme is defined as SCSS variables in [`src/styles/color-pallet.scss`](https://github.com/Lissy93/server-start-page/blob/master/src/styles/color-pallet.scss).

---

## License 📜

```
Copyright © 2021 Alicia Sykes <https://aliciasykes.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
associated documentation files (the “Software”), to deal in the Software without restriction, 
including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial
portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWAREOR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```