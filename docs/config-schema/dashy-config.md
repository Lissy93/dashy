# Dashy Config Schema Schema

```txt
https://example.com/schemas/abstract
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                            |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :------------------------------------------------------------------------------------ |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [dashy-config.schema.json](../../out/dashy-config.schema.json "open original schema") |

## Dashy Config Schema Type

`object` ([Dashy Config Schema](dashy-config.md))

# Dashy Config Schema Properties

| Property                | Type     | Required | Nullable       | Defined by                                                                                                               |
| :---------------------- | :------- | :------- | :------------- | :----------------------------------------------------------------------------------------------------------------------- |
| [pageInfo](#pageinfo)   | `object` | Optional | cannot be null | [Dashy Config Schema](dashy-config-properties-pageinfo.md "https://example.com/schemas/abstract#/properties/pageInfo")   |
| [appConfig](#appconfig) | `object` | Optional | cannot be null | [Dashy Config Schema](dashy-config-properties-appconfig.md "https://example.com/schemas/abstract#/properties/appConfig") |
| [sections](#sections)   | `array`  | Required | cannot be null | [Dashy Config Schema](dashy-config-properties-sections.md "https://example.com/schemas/abstract#/properties/sections")   |

## pageInfo



`pageInfo`

*   is optional

*   Type: `object` ([Details](dashy-config-properties-pageinfo.md))

*   cannot be null

*   defined in: [Dashy Config Schema](dashy-config-properties-pageinfo.md "https://example.com/schemas/abstract#/properties/pageInfo")

### pageInfo Type

`object` ([Details](dashy-config-properties-pageinfo.md))

## appConfig

Application configuration

`appConfig`

*   is optional

*   Type: `object` ([Details](dashy-config-properties-appconfig.md))

*   cannot be null

*   defined in: [Dashy Config Schema](dashy-config-properties-appconfig.md "https://example.com/schemas/abstract#/properties/appConfig")

### appConfig Type

`object` ([Details](dashy-config-properties-appconfig.md))

## sections

Array of sections, containing items

`sections`

*   is required

*   Type: `object[]` ([Details](dashy-config-properties-sections-items.md))

*   cannot be null

*   defined in: [Dashy Config Schema](dashy-config-properties-sections.md "https://example.com/schemas/abstract#/properties/sections")

### sections Type

`object[]` ([Details](dashy-config-properties-sections-items.md))
