---
layout: ../../layouts/Docs.astro
title: "VelocityCore"
url: "/docs/core.md"
---

# `VelocityCore`
Core is the first of two APIs that Velocity exposes. It is defined in the preload and exposed via `electron.contextBridge` to the renderer process.

## Methods
### `request(url, options?, callback?) => Promise<any>`
This method is a wrapper for `https` and aims to replace the `request` module. It is a promise based method that returns a promise if no callback is provided.

#### Parameters

| Name | Type | Description |
| :--- | :--- | :--- |
| `url` | `string` | The URL to request. |
| `options?` | `object` | The options to pass to the request. When provided as a function it will be used instead of the callback. |
| `callback?` | `function` | The callback to call when the request is complete. |

#### Returns
`Promise<any>` - The response from the request.

---

### `pseudoRequire(module) => any`
This method is a wrapper for `require` that allows you to require node modules in the renderer process.

#### Parameters

| Name | Type | Description |
| :--- | :--- | :--- |
| `module` | `string` | The module to require. |

##### Special Modules
There is one unique string that can be passed to this method that will return a special value, `v:dir`. This will return the directory that Velocity is installed in.

#### Returns
`any` - The module that was required.

---

## Properties
### `baseDir`
The directory that Velocity is installed in.

---

### `Meta`
An object containing metadata about the current version of Velocity.