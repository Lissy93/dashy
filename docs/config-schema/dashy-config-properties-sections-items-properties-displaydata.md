# Untitled object in Dashy Config Schema Schema

```txt
https://example.com/schemas/abstract#/properties/sections/items/properties/displayData
```

Optional meta data for customizing a section

| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                             |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [dashy-config.schema.json*](../../out/dashy-config.schema.json "open original schema") |

## displayData Type

`object` ([Details](dashy-config-properties-sections-items-properties-displaydata.md))

# displayData Properties

| Property                      | Type          | Required | Nullable       | Defined by                                                                                                                                                                                                                       |
| :---------------------------- | :------------ | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [collapsed](#collapsed)       | `boolean`     | Optional | cannot be null | [Dashy Config Schema](dashy-config-properties-sections-items-properties-displaydata-properties-collapsed.md "https://example.com/schemas/abstract#/properties/sections/items/properties/displayData/properties/collapsed")       |
| [color](#color)               | `string`      | Optional | cannot be null | [Dashy Config Schema](dashy-config-properties-sections-items-properties-displaydata-properties-color.md "https://example.com/schemas/abstract#/properties/sections/items/properties/displayData/properties/color")               |
| [customStyles](#customstyles) | `string`      | Optional | cannot be null | [Dashy Config Schema](dashy-config-properties-sections-items-properties-displaydata-properties-customstyles.md "https://example.com/schemas/abstract#/properties/sections/items/properties/displayData/properties/customStyles") |
| [itemSize](#itemsize)         | Not specified | Optional | cannot be null | [Dashy Config Schema](dashy-config-properties-sections-items-properties-displaydata-properties-itemsize.md "https://example.com/schemas/abstract#/properties/sections/items/properties/displayData/properties/itemSize")         |
| [rows](#rows)                 | `number`      | Optional | cannot be null | [Dashy Config Schema](dashy-config-properties-sections-items-properties-displaydata-properties-rows.md "https://example.com/schemas/abstract#/properties/sections/items/properties/displayData/properties/rows")                 |
| [cols](#cols)                 | `number`      | Optional | cannot be null | [Dashy Config Schema](dashy-config-properties-sections-items-properties-displaydata-properties-cols.md "https://example.com/schemas/abstract#/properties/sections/items/properties/displayData/properties/cols")                 |
| [layout](#layout)             | Not specified | Optional | cannot be null | [Dashy Config Schema](dashy-config-properties-sections-items-properties-displaydata-properties-layout.md "https://example.com/schemas/abstract#/properties/sections/items/properties/displayData/properties/layout")             |
| [itemCountX](#itemcountx)     | `number`      | Optional | cannot be null | [Dashy Config Schema](dashy-config-properties-sections-items-properties-displaydata-properties-itemcountx.md "https://example.com/schemas/abstract#/properties/sections/items/properties/displayData/properties/itemCountX")     |
| [itemCountY](#itemcounty)     | `number`      | Optional | cannot be null | [Dashy Config Schema](dashy-config-properties-sections-items-properties-displaydata-properties-itemcounty.md "https://example.com/schemas/abstract#/properties/sections/items/properties/displayData/properties/itemCountY")     |

## collapsed

If true, section needs to be clicked to open

`collapsed`

*   is optional

*   Type: `boolean`

*   cannot be null

*   defined in: [Dashy Config Schema](dashy-config-properties-sections-items-properties-displaydata-properties-collapsed.md "https://example.com/schemas/abstract#/properties/sections/items/properties/displayData/properties/collapsed")

### collapsed Type

`boolean`

## color

Hex code, or HTML color for section fill

`color`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [Dashy Config Schema](dashy-config-properties-sections-items-properties-displaydata-properties-color.md "https://example.com/schemas/abstract#/properties/sections/items/properties/displayData/properties/color")

### color Type

`string`

## customStyles

CSS overides for section container

`customStyles`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [Dashy Config Schema](dashy-config-properties-sections-items-properties-displaydata-properties-customstyles.md "https://example.com/schemas/abstract#/properties/sections/items/properties/displayData/properties/customStyles")

### customStyles Type

`string`

## itemSize

Size of items within the section

`itemSize`

*   is optional

*   Type: unknown

*   cannot be null

*   defined in: [Dashy Config Schema](dashy-config-properties-sections-items-properties-displaydata-properties-itemsize.md "https://example.com/schemas/abstract#/properties/sections/items/properties/displayData/properties/itemSize")

### itemSize Type

unknown

### itemSize Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value      | Explanation |
| :--------- | :---------- |
| `"small"`  |             |
| `"medium"` |             |
| `"large"`  |             |

### itemSize Default Value

The default value is:

```json
"medium"
```

## rows

The amount of space that the section spans vertically

`rows`

*   is optional

*   Type: `number`

*   cannot be null

*   defined in: [Dashy Config Schema](dashy-config-properties-sections-items-properties-displaydata-properties-rows.md "https://example.com/schemas/abstract#/properties/sections/items/properties/displayData/properties/rows")

### rows Type

`number`

### rows Constraints

**maximum**: the value of this number must smaller than or equal to: `5`

**minimum**: the value of this number must greater than or equal to: `1`

### rows Default Value

The default value is:

```json
1
```

## cols

The amount of space that the section spans horizontally

`cols`

*   is optional

*   Type: `number`

*   cannot be null

*   defined in: [Dashy Config Schema](dashy-config-properties-sections-items-properties-displaydata-properties-cols.md "https://example.com/schemas/abstract#/properties/sections/items/properties/displayData/properties/cols")

### cols Type

`number`

### cols Constraints

**maximum**: the value of this number must smaller than or equal to: `5`

**minimum**: the value of this number must greater than or equal to: `1`

### cols Default Value

The default value is:

```json
1
```

## layout

If set to grid, items have uniform width, and itemCount can be set

`layout`

*   is optional

*   Type: unknown

*   cannot be null

*   defined in: [Dashy Config Schema](dashy-config-properties-sections-items-properties-displaydata-properties-layout.md "https://example.com/schemas/abstract#/properties/sections/items/properties/displayData/properties/layout")

### layout Type

unknown

### layout Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value    | Explanation |
| :------- | :---------- |
| `"grid"` |             |
| `"auto"` |             |

### layout Default Value

The default value is:

```json
"auto"
```

## itemCountX

Number of items per column

`itemCountX`

*   is optional

*   Type: `number`

*   cannot be null

*   defined in: [Dashy Config Schema](dashy-config-properties-sections-items-properties-displaydata-properties-itemcountx.md "https://example.com/schemas/abstract#/properties/sections/items/properties/displayData/properties/itemCountX")

### itemCountX Type

`number`

### itemCountX Constraints

**maximum**: the value of this number must smaller than or equal to: `12`

**minimum**: the value of this number must greater than or equal to: `1`

## itemCountY

Number of items per row

`itemCountY`

*   is optional

*   Type: `number`

*   cannot be null

*   defined in: [Dashy Config Schema](dashy-config-properties-sections-items-properties-displaydata-properties-itemcounty.md "https://example.com/schemas/abstract#/properties/sections/items/properties/displayData/properties/itemCountY")

### itemCountY Type

`number`

### itemCountY Constraints

**maximum**: the value of this number must smaller than or equal to: `12`

**minimum**: the value of this number must greater than or equal to: `1`
