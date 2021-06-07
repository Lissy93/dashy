# Untitled object in Dashy Config Schema Schema

```txt
https://example.com/schemas/abstract#/properties/sections/items
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                             |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [dashy-config.schema.json*](../../out/dashy-config.schema.json "open original schema") |

## items Type

`object` ([Details](dashy-config-properties-sections-items.md))

# items Properties

| Property                    | Type     | Required | Nullable       | Defined by                                                                                                                                                                       |
| :-------------------------- | :------- | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [name](#name)               | `string` | Required | cannot be null | [Dashy Config Schema](dashy-config-properties-sections-items-properties-name.md "https://example.com/schemas/abstract#/properties/sections/items/properties/name")               |
| [icon](#icon)               | `string` | Optional | cannot be null | [Dashy Config Schema](dashy-config-properties-sections-items-properties-icon.md "https://example.com/schemas/abstract#/properties/sections/items/properties/icon")               |
| [displayData](#displaydata) | `object` | Optional | cannot be null | [Dashy Config Schema](dashy-config-properties-sections-items-properties-displaydata.md "https://example.com/schemas/abstract#/properties/sections/items/properties/displayData") |
| [items](#items)             | `array`  | Required | cannot be null | [Dashy Config Schema](dashy-config-properties-sections-items-properties-items.md "https://example.com/schemas/abstract#/properties/sections/items/properties/items")             |

## name

Title/ heading for a section

`name`

*   is required

*   Type: `string`

*   cannot be null

*   defined in: [Dashy Config Schema](dashy-config-properties-sections-items-properties-name.md "https://example.com/schemas/abstract#/properties/sections/items/properties/name")

### name Type

`string`

## icon

Icon will be displayed next to title

`icon`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [Dashy Config Schema](dashy-config-properties-sections-items-properties-icon.md "https://example.com/schemas/abstract#/properties/sections/items/properties/icon")

### icon Type

`string`

## displayData

Optional meta data for customizing a section

`displayData`

*   is optional

*   Type: `object` ([Details](dashy-config-properties-sections-items-properties-displaydata.md))

*   cannot be null

*   defined in: [Dashy Config Schema](dashy-config-properties-sections-items-properties-displaydata.md "https://example.com/schemas/abstract#/properties/sections/items/properties/displayData")

### displayData Type

`object` ([Details](dashy-config-properties-sections-items-properties-displaydata.md))

## items

Array of items to display with a section

`items`

*   is required

*   Type: `object[]` ([Details](dashy-config-properties-sections-items-properties-items-items.md))

*   cannot be null

*   defined in: [Dashy Config Schema](dashy-config-properties-sections-items-properties-items.md "https://example.com/schemas/abstract#/properties/sections/items/properties/items")

### items Type

`object[]` ([Details](dashy-config-properties-sections-items-properties-items-items.md))
