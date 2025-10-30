[**aac-voice-api**](../../../api-specification.md)

***

# Interface: WhisperModule

Defined in: [whisper/libstream.d.ts:3](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/681b1bef6f4d46f8f7614169d87f151ce783205a/src/whisper/libstream.d.ts#L3)

## Methods

### free()

> **free**(`index`): `void`

Defined in: [whisper/libstream.d.ts:16](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/681b1bef6f4d46f8f7614169d87f151ce783205a/src/whisper/libstream.d.ts#L16)

Free resources associated with a specific index.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | Resource index |

#### Returns

`void`

***

### FS\_createDataFile()

> **FS\_createDataFile**(`parent`, `name`, `data`, `canRead`, `canWrite`, `canOwn?`): `void`

Defined in: [whisper/libstream.d.ts:44](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/681b1bef6f4d46f8f7614169d87f151ce783205a/src/whisper/libstream.d.ts#L44)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `parent` | `string` |
| `name` | `string` |
| `data` | `ArrayBuffer` \| `Uint8Array`\<`ArrayBufferLike`\> |
| `canRead` | `boolean` |
| `canWrite` | `boolean` |
| `canOwn?` | `boolean` |

#### Returns

`void`

***

### FS\_createPath()

> **FS\_createPath**(`parent`, `path`, `canRead?`, `canWrite?`): `string`

Defined in: [whisper/libstream.d.ts:58](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/681b1bef6f4d46f8f7614169d87f151ce783205a/src/whisper/libstream.d.ts#L58)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `parent` | `string` |
| `path` | `string` |
| `canRead?` | `boolean` |
| `canWrite?` | `boolean` |

#### Returns

`string`

***

### FS\_preloadFile()

> **FS\_preloadFile**(`localPath`, `url`, `onload?`, `onerror?`): `void`

Defined in: [whisper/libstream.d.ts:53](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/681b1bef6f4d46f8f7614169d87f151ce783205a/src/whisper/libstream.d.ts#L53)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `localPath` | `string` |
| `url` | `string` |
| `onload?` | () => `void` |
| `onerror?` | () => `void` |

#### Returns

`void`

***

### FS\_unlink()

> **FS\_unlink**(`path`): `void`

Defined in: [whisper/libstream.d.ts:55](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/681b1bef6f4d46f8f7614169d87f151ce783205a/src/whisper/libstream.d.ts#L55)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `path` | `string` |

#### Returns

`void`

***

### get\_status()

> **get\_status**(): `string`

Defined in: [whisper/libstream.d.ts:36](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/681b1bef6f4d46f8f7614169d87f151ce783205a/src/whisper/libstream.d.ts#L36)

Get the current module status.

#### Returns

`string`

Status string ("loading" | "ready" | "error")

***

### get\_transcribed()

> **get\_transcribed**(): `string`

Defined in: [whisper/libstream.d.ts:30](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/681b1bef6f4d46f8f7614169d87f151ce783205a/src/whisper/libstream.d.ts#L30)

Get the latest transcribed string from the module.

#### Returns

`string`

Transcribed text

***

### init()

> **init**(`urlToPath`, `langCode`): `number`

Defined in: [whisper/libstream.d.ts:10](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/681b1bef6f4d46f8f7614169d87f151ce783205a/src/whisper/libstream.d.ts#L10)

Initialize the module with a model path and language code.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `urlToPath` | `string` | Path or URL to the model binary |
| `langCode` | `string` | Language code (e.g., "en", "fr") |

#### Returns

`number`

number (usually success/error code)

***

### set\_audio()

> **set\_audio**(`index`, `audio`): `number`

Defined in: [whisper/libstream.d.ts:24](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/681b1bef6f4d46f8f7614169d87f151ce783205a/src/whisper/libstream.d.ts#L24)

Set audio data for a specific index.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | Resource index |
| `audio` | `number`[] \| `Float32Array`\<`ArrayBufferLike`\> | JavaScript array of audio samples (Float32Array, number[]) |

#### Returns

`number`

number (success/error code)

***

### set\_status()

> **set\_status**(`status`): `void`

Defined in: [whisper/libstream.d.ts:42](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/681b1bef6f4d46f8f7614169d87f151ce783205a/src/whisper/libstream.d.ts#L42)

Update the module status.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `status` | `string` | Status string ("loading" | "ready" | "error") |

#### Returns

`void`
