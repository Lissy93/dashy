# Untitled object in Dashy Config Schema Schema

```txt
https://example.com/schemas/abstract#/properties/sections/items/properties/items/items
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                             |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [dashy-config.schema.json*](../../out/dashy-config.schema.json "open original schema") |

## items Type

`object` ([Details](dashy-config-properties-sections-items-properties-items-items.md))

# items Properties

| Property                    | Type          | Required | Nullable       | Defined by                                                                                                                                                                                                                     |
| :-------------------------- | :------------ | :------- | :------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [title](#title)             | `string`      | Required | cannot be null | [Dashy Config Schema](dashy-config-properties-sections-items-properties-items-items-properties-title.md "https://example.com/schemas/abstract#/properties/sections/items/properties/items/items/properties/title")             |
| [description](#description) | `string`      | Optional | cannot be null | [Dashy Config Schema](dashy-config-properties-sections-items-properties-items-items-properties-description.md "https://example.com/schemas/abstract#/properties/sections/items/properties/items/items/properties/description") |
| [icon](#icon)               | `string`      | Optional | cannot be null | [Dashy Config Schema](dashy-config-properties-sections-items-properties-items-items-properties-icon.md "https://example.com/schemas/abstract#/properties/sections/items/properties/items/items/properties/icon")               |
| [url](#url)                 | `string`      | Optional | cannot be null | [Dashy Config Schema](dashy-config-properties-sections-items-properties-items-items-properties-url.md "https://example.com/schemas/abstract#/properties/sections/items/properties/items/items/properties/url")                 |
| [target](#target)           | Not specified | Optional | cannot be null | [Dashy Config Schema](dashy-config-properties-sections-items-properties-items-items-properties-target.md "https://example.com/schemas/abstract#/properties/sections/items/properties/items/items/properties/target")           |
| [color](#color)             | `string`      | Optional | cannot be null | [Dashy Config Schema](dashy-config-properties-sections-items-properties-items-items-properties-color.md "https://example.com/schemas/abstract#/properties/sections/items/properties/items/items/properties/color")             |
| [provider](#provider)       | `string`      | Optional | cannot be null | [Dashy Config Schema](dashy-config-properties-sections-items-properties-items-items-properties-provider.md "https://example.com/schemas/abstract#/properties/sections/items/properties/items/items/properties/provider")       |

## title

Text shown on the item

`title`

*   is required

*   Type: `string`

*   cannot be null

*   defined in: [Dashy Config Schema](dashy-config-properties-sections-items-properties-items-items-properties-title.md "https://example.com/schemas/abstract#/properties/sections/items/properties/items/items/properties/title")

### title Type

`string`

## description

Short description, shown on hover or in a tooltip

`description`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [Dashy Config Schema](dashy-config-properties-sections-items-properties-items-items-properties-description.md "https://example.com/schemas/abstract#/properties/sections/items/properties/items/items/properties/description")

### description Type

`string`

## icon

An icon, either as a font-awesome identifier, local or remote URL, or auto-fetched favicon

`icon`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [Dashy Config Schema](dashy-config-properties-sections-items-properties-items-items-properties-icon.md "https://example.com/schemas/abstract#/properties/sections/items/properties/items/items/properties/icon")

### icon Type

`string`

## url

The destination to navigate to when item is clicked

`url`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [Dashy Config Schema](dashy-config-properties-sections-items-properties-items-items-properties-url.md "https://example.com/schemas/abstract#/properties/sections/items/properties/items/items/properties/url")

### url Type

`string`

## target

Opening method, when item is clicked

`target`

*   is optional

*   Type: unknown

*   cannot be null

*   defined in: [Dashy Config Schema](dashy-config-properties-sections-items-properties-items-items-properties-target.md "https://example.com/schemas/abstract#/properties/sections/items/properties/items/items/properties/target")

### target Type

unknown

### target Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value       | Explanation |
| :---------- | :---------- |
| `"newtab"`  |             |
| `"sametab"` |             |
| `"iframe"`  |             |

### target Default Value

The default value is:

```json
"newtab"
```

## color

A custom fill color of the item

`color`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [Dashy Config Schema](dashy-config-properties-sections-items-properties-items-items-properties-color.md "https://example.com/schemas/abstract#/properties/sections/items/properties/items/items/properties/color")

### color Type

`string`

## provider

Provider name, e.g. Microsoft

`provider`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [Dashy Config Schema](dashy-config-properties-sections-items-properties-items-items-properties-provider.md "https://example.com/schemas/abstract#/properties/sections/items/properties/items/items/properties/provider")

### provider Type

`string`
