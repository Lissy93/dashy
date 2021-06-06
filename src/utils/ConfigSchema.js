/**
 * This is the schema for the main app configuration (usually ./public/conf.yml)
 * It enables the users data to be validated when making changes,
 * and detailed warnings shown, to avoid any unexpected errors or issues
 */
module.exports = {
  type: 'object',
  required: ['sections'],
  additionalProperties: false,
  properties: {

    /* Page Info */
    pageInfo: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Title and heading for the app',
        },
        description: {
          type: 'string',
          description: 'Sub-title, displayed in header',
        },
        navLinks: {
          type: 'array',
          maxItems: 6,
          description: 'Quick access links, displayed in header',
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['title', 'path'],
            properties: {
              title: {
                type: 'string',
              },
              path: {
                type: 'string',
              },
            },
          },
        },
        footerText: { type: 'string' },
      },
      required: ['title'],
      additionalProperties: false,
    },

    /* App Config */
    appConfig: {
      type: 'object',
      description: 'Application configuration',
      properties: {
        backgroundImg: {
          type: 'string',
          description: 'A URL to an image asset to be displayed as background',
        },
        theme: {
          type: 'string',
          default: 'Callisto',
          description: 'A theme to be applied by default on first load',
        },
        enableFontAwesome: {
          type: 'boolean',
          default: true,
          description: 'Should load font-awesome assets',
        },
        fontAwesomeKey: {
          type: 'string',
          pattern: '^[a-z0-9]{10}$',
          description: 'API key for font-awesome',
        },
        cssThemes: {
          type: 'array',
          description: 'Theme names to be added to the dropdown',
          items: {
            type: 'string',
          },
        },
        externalStyleSheet: {
          description: 'URL or URLs of external stylesheets to add to dropdown/ load',
          type: [
            'string', 'array',
          ],
          items: {
            type: 'string',
          },
        },
        customCss: {
          type: 'string',
          description: 'Any custom CSS overides, must be minified',
        },
        forceRootFavicon: {
          type: 'boolean',
          default: false,
          description: 'When fetching favicon, always use websites icon and not Google API',
        },
        itemFaviconLocation: {
          type: 'string',
          default: '/favicon.ico',
          description: 'The path to look for website favicons',
        },
      },
      additionalProperties: false,
    },

    /* Sections */
    sections: {
      type: 'array',
      description: 'Array of sections, containing items',
      items: {
        type: 'object',
        required: ['name', 'items'],
        additionalProperties: false,
        properties: {
          name: {
            type: 'string',
            description: 'Title/ heading for a section',
          },
          icon: {
            type: 'string',
            description: 'Icon will be displayed next to title',
          },
          /* Section Display Data */
          displayData: {
            type: 'object',
            additionalProperties: false,
            description: 'Optional meta data for customizing a section',
            properties: {
              collapsed: {
                type: 'boolean',
                default: false,
                description: 'If true, section needs to be clicked to open',
              },
              color: {
                type: 'string',
                description: 'Hex code, or HTML color for section fill',
              },
              customStyles: {
                type: 'string',
                description: 'CSS overides for section container',
              },
              itemSize: {
                enum: ['small', 'medium', 'large'],
                default: 'medium',
                description: 'Size of items within the section',
              },
              rows: {
                type: 'number',
                minimum: 1,
                maximum: 5,
                default: 1,
                description: 'The amount of space that the section spans vertically',
              },
              cols: {
                type: 'number',
                minimum: 1,
                maximum: 5,
                default: 1,
                description: 'The amount of space that the section spans horizontally',
              },
              layout: {
                enum: ['grid', 'auto'],
                default: 'auto',
                description: 'If set to grid, items have uniform width, and itemCount can be set',
              },
              itemCountX: {
                type: 'number',
                minimum: 1,
                maximum: 12,
                description: 'Number of items per column',
              },
              itemCountY: {
                type: 'number',
                minimum: 1,
                maximum: 12,
                description: 'Number of items per row',
              },
            },
          },
          /* Items within a section */
          items: {
            type: 'array',
            description: 'Array of items to display with a section',
            items: {
              type: 'object',
              additionalProperties: false,
              required: ['title'],
              properties: {
                title: {
                  type: 'string',
                  description: 'Text shown on the item',
                },
                description: {
                  type: 'string',
                  nullable: true,
                  description: 'Short description, shown on hover or in a tooltip',
                },
                icon: {
                  type: 'string',
                  nullable: true,
                  description: 'An icon, either as a font-awesome identifier, local or remote URL, or auto-fetched favicon',
                },
                url: {
                  type: 'string',
                  description: 'The destination to navigate to when item is clicked',
                },
                target: {
                  enum: ['newtab', 'sametab', 'iframe'],
                  default: 'newtab',
                  description: 'Opening method, when item is clicked',
                },
                color: {
                  type: 'string',
                  description: 'A custom fill color of the item',
                },
                provider: {
                  type: 'string',
                  description: 'Provider name, e.g. Microsoft',
                },
              },
            },
          },
        },
      },
    },
  },
};
