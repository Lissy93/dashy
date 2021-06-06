# Untitled object in Dashy Config Schema Schema

```txt
https://example.com/schemas/abstract#/properties/pageInfo
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                             |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [dashy-config.schema.json*](../../out/dashy-config.schema.json "open original schema") |

## pageInfo Type

`object` ([Details](dashy-config-properties-pageinfo.md))

# pageInfo Properties

| Property                    | Type     | Required | Nullable       | Defined by                                                                                                                                                           |
| :-------------------------- | :------- | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [title](#title)             | `string` | Required | cannot be null | [Dashy Config Schema](dashy-config-properties-pageinfo-properties-title.md "https://example.com/schemas/abstract#/properties/pageInfo/properties/title")             |
| [description](#description) | `string` | Optional | cannot be null | [Dashy Config Schema](dashy-config-properties-pageinfo-properties-description.md "https://example.com/schemas/abstract#/properties/pageInfo/properties/description") |
| [navLinks](#navlinks)       | `array`  | Optional | cannot be null | [Dashy Config Schema](dashy-config-properties-pageinfo-properties-navlinks.md "https://example.com/schemas/abstract#/properties/pageInfo/properties/navLinks")       |
| [footerText](#footertext)   | `string` | Optional | cannot be null | [Dashy Config Schema](dashy-config-properties-pageinfo-properties-footertext.md "https://example.com/schemas/abstract#/properties/pageInfo/properties/footerText")   |

## title

Title and heading for the app

`title`

*   is required

*   Type: `string`

*   cannot be null

*   defined in: [Dashy Config Schema](dashy-config-properties-pageinfo-properties-title.md "https://example.com/schemas/abstract#/properties/pageInfo/properties/title")

### title Type

`string`

## description

Sub-title, displayed in header

`description`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [Dashy Config Schema](dashy-config-properties-pageinfo-properties-description.md "https://example.com/schemas/abstract#/properties/pageInfo/properties/description")

### description Type

`string`

## navLinks

Quick access links, displayed in header

`navLinks`

*   is optional

*   Type: `object[]` ([Details](dashy-config-properties-pageinfo-properties-navlinks-items.md))

*   cannot be null

*   defined in: [Dashy Config Schema](dashy-config-properties-pageinfo-properties-navlinks.md "https://example.com/schemas/abstract#/properties/pageInfo/properties/navLinks")

### navLinks Type

`object[]` ([Details](dashy-config-properties-pageinfo-properties-navlinks-items.md))

### navLinks Constraints

**maximum number of items**: the maximum number of items for this array is: `6`

## footerText



`footerText`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [Dashy Config Schema](dashy-config-properties-pageinfo-properties-footertext.md "https://example.com/schemas/abstract#/properties/pageInfo/properties/footerText")

### footerText Type

`string`
