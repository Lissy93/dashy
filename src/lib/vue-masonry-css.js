/* eslint-disable */
// the component name `<masonry />`
// can be overridden with `Vue.use(Masonry, { name: 'the-masonry' });`
const componentName = 'masonry';

const props = {
  tag: {
    type: [String],
    default: 'div',
  },
  cols: {
    type: [Object, Number, String],
    default: 2,
  },
  gutter: {
    type: [Object, Number, String],
    default: 0,
  },
  css: {
    type: [Boolean],
    default: true,
  },
  columnTag: {
    type: [String],
    default: 'div',
  },
  columnClass: {
    type: [String, Array, Object],
    default: () => [],
  },
  columnAttr: {
    type: [Object],
    default: () => ({}),
  },
};

// Get the resulting value from  `:col=` prop
// based on the window width
const breakpointValue = (mixed, windowWidth) => {
  const valueAsNum = parseInt(mixed);

  if (valueAsNum > -1) {
    return mixed;
  } if (typeof mixed !== 'object') {
    return 0;
  }

  let matchedBreakpoint = Infinity;
  let matchedValue = mixed.default || 0;

  for (const k in mixed) {
    const breakpoint = parseInt(k);
    const breakpointValRaw = mixed[breakpoint];
    const breakpointVal = parseInt(breakpointValRaw);

    if (isNaN(breakpoint) || isNaN(breakpointVal)) {
      continue;
    }

    const isNewBreakpoint = windowWidth <= breakpoint && breakpoint < matchedBreakpoint;

    if (isNewBreakpoint) {
      matchedBreakpoint = breakpoint;
      matchedValue = breakpointValRaw;
    }
  }

  return matchedValue;
};

const component = {
  props,

  data() {
    return {
      displayColumns: 2,
      displayGutter: 0,
    };
  },

  mounted() {
    this.$nextTick(() => {
      this.reCalculate();
    });

    // Bind resize handler to page
    if (window) {
      window.addEventListener('resize', this.reCalculate);
    }
  },

  updated() {
    this.$nextTick(() => {
      this.reCalculate();
    });
  },

  beforeDestroy() {
    if (window) {
      window.removeEventListener('resize', this.reCalculate);
    }
  },

  methods: {
    // Recalculate how many columns to display based on window width
    // and the value of the passed `:cols=` prop
    reCalculate() {
      const previousWindowWidth = this.windowWidth;

      this.windowWidth = (window ? window.innerWidth : null) || Infinity;

      // Window resize events get triggered on page height
      // change which when loading the page can result in multiple
      // needless calculations. We prevent this here.
      if (previousWindowWidth === this.windowWidth) {
        return;
      }

      this._reCalculateColumnCount(this.windowWidth);

      this._reCalculateGutterSize(this.windowWidth);
    },

    _reCalculateGutterSize(windowWidth) {
      this.displayGutter = breakpointValue(this.gutter, windowWidth);
    },

    _reCalculateColumnCount(windowWidth) {
      let newColumns = breakpointValue(this.cols, windowWidth);

      // Make sure we can return a valid value
      newColumns = Math.max(1, Number(newColumns) || 0);

      this.displayColumns = newColumns;
    },

    _getChildItemsInColumnsArray() {
      const columns = [];
      let childItems = this.$slots.default || [];

      // This component does not work with a child <transition-group /> ..yet,
      // so for now we think it may be helpful to ignore until we can find a way for support
      if (childItems.length === 1 && childItems[0].componentOptions && childItems[0].componentOptions.tag == 'transition-group') {
        childItems = childItems[0].componentOptions.children;
      }

      // Loop through child elements
      for (let i = 0, visibleItemI = 0; i < childItems.length; i++, visibleItemI++) {
        // skip Vue elements without tags, which includes
        // whitespace elements and also plain text
        if (!childItems[i].tag) {
          visibleItemI--;

          continue;
        }

        // Get the column index the child item will end up in
        const columnIndex = visibleItemI % this.displayColumns;

        if (!columns[columnIndex]) {
          columns[columnIndex] = [];
        }

        columns[columnIndex].push(childItems[i]);
      }

      return columns;
    },
  },

  render(createElement) {
    const columnsContainingChildren = this._getChildItemsInColumnsArray();
    const isGutterSizeUnitless = parseInt(this.displayGutter) === this.displayGutter * 1;
    const gutterSizeWithUnit = isGutterSizeUnitless ? `${this.displayGutter}px` : this.displayGutter;

    const columnStyle = {
      boxSizing: 'border-box',
      backgroundClip: 'padding-box',
      width: `${100 / this.displayColumns}%`,
      border: '0 solid transparent',
      borderLeftWidth: gutterSizeWithUnit,
    };

    const columns = columnsContainingChildren.map((children, index) =>
      // / Create column element and inject the children
      createElement(this.columnTag, {
        key: `${index}-${columnsContainingChildren.length}`,
        style: this.css ? columnStyle : null,
        class: this.columnClass,
        attrs: this.columnAttr,
      }, children), // specify child items here
    );

    const containerStyle = {
      display: ['-webkit-box', '-ms-flexbox', 'flex'],
      marginLeft: `-${gutterSizeWithUnit}`,
    };

    // Return wrapper with columns
    return createElement(
      this.tag, // tag name
      this.css ? { style: containerStyle } : null, // element options
      columns, // column vue elements
    );
  },
};

const Plugin = function () {};

Plugin.install = function (Vue, options) {
  if (Plugin.installed) {
    return;
  }

  if (options && options.name) {
    Vue.component(options.name, component);
  } else {
    Vue.component(componentName, component);
  }
};

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(Plugin);
}

export default Plugin;
