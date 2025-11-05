[**aac-voice-api**](../api-specification.md)

***

Defined in: [SpeechConverterInterface.ts:15](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/8ef19aa1ae76b73971ed5e6f21dc113d3ead9745/src/SpeechConverterInterface.ts#L15)

## Methods

### getStatus()

```ts
getStatus(): string;
```

Defined in: [SpeechConverterInterface.ts:27](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/8ef19aa1ae76b73971ed5e6f21dc113d3ead9745/src/SpeechConverterInterface.ts#L27)

#### Returns

`string`

***

### getTextLog()

```ts
getTextLog(): string[];
```

Defined in: [SpeechConverterInterface.ts:25](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/8ef19aa1ae76b73971ed5e6f21dc113d3ead9745/src/SpeechConverterInterface.ts#L25)

#### Returns

`string`[]

***

### getTranscribed()

```ts
getTranscribed(): string;
```

Defined in: [SpeechConverterInterface.ts:23](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/8ef19aa1ae76b73971ed5e6f21dc113d3ead9745/src/SpeechConverterInterface.ts#L23)

#### Returns

`string`

***

### init()

```ts
init(modelPath, lang): Promise<void>;
```

Defined in: [SpeechConverterInterface.ts:17](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/8ef19aa1ae76b73971ed5e6f21dc113d3ead9745/src/SpeechConverterInterface.ts#L17)

#### Parameters

<table>
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`modelPath`

</td>
<td>

`string`

</td>
</tr>
<tr>
<td>

`lang`

</td>
<td>

`string`

</td>
</tr>
</tbody>
</table>

#### Returns

`Promise`\<`void`\>

***

### startListening()

```ts
startListening(): void;
```

Defined in: [SpeechConverterInterface.ts:19](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/8ef19aa1ae76b73971ed5e6f21dc113d3ead9745/src/SpeechConverterInterface.ts#L19)

#### Returns

`void`

***

### stopListening()

```ts
stopListening(): void;
```

Defined in: [SpeechConverterInterface.ts:21](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/8ef19aa1ae76b73971ed5e6f21dc113d3ead9745/src/SpeechConverterInterface.ts#L21)

#### Returns

`void`
