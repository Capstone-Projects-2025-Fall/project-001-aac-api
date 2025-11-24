[**aac-voice-api**](../api-specification.md)

***

Defined in: [SynonymResolver.ts:17](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/a499d4999cefb5304bcc22b147407d7750156d6f/src/SynonymResolver.ts#L17)

SynonymResolver provides synonym matching capabilities using the DataMuse API.

This is the basic version that includes:
- Singleton pattern
- Basic synonym fetching from DataMuse API
- Simple in-memory caching
- Error handling

## Example

```ts
const resolver = SynonymResolver.getInstance();
const synonyms = await resolver.getSynonyms('jump');
// Returns: ['leap', 'hop', 'spring', 'bound', ...]
```

## Methods

### areSynonyms()

```ts
areSynonyms(word1, word2): Promise`<boolean>`;
```

Defined in: [SynonymResolver.ts:158](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/a499d4999cefb5304bcc22b147407d7750156d6f/src/SynonymResolver.ts#L158)

Checks if two words are synonyms of each other.

This method checks if word2 appears in word1's synonym list.

#### Parameters

<table>
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`word1`

</td>
<td>

`string`

</td>
<td>

First word to compare

</td>
</tr>
<tr>
<td>

`word2`

</td>
<td>

`string`

</td>
<td>

Second word to compare

</td>
</tr>
</tbody>
</table>

#### Returns

`Promise`\<`boolean`\>

True if the words are synonyms, false otherwise

#### Example

```ts
const resolver = SynonymResolver.getInstance();
const areSynonyms = await resolver.areSynonyms('jump', 'leap');
console.log(areSynonyms); // true
```

***

### clearCache()

```ts
clearCache(): void;
```

Defined in: [SynonymResolver.ts:128](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/a499d4999cefb5304bcc22b147407d7750156d6f/src/SynonymResolver.ts#L128)

Clears the entire synonym cache.
Useful for testing or if you want to force fresh API calls.

#### Returns

`void`

***

### getCacheSize()

```ts
getCacheSize(): number;
```

Defined in: [SynonymResolver.ts:138](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/a499d4999cefb5304bcc22b147407d7750156d6f/src/SynonymResolver.ts#L138)

Returns the number of words currently cached.

#### Returns

`number`

Number of words in the cache

***

### getSynonyms()

```ts
getSynonyms(word): Promise<string[]>;
```

Defined in: [SynonymResolver.ts:64](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/a499d4999cefb5304bcc22b147407d7750156d6f/src/SynonymResolver.ts#L64)

Fetches synonyms for a given word from the DataMuse API.
Results are cached in memory to avoid repeated API calls for the same word.

The DataMuse API parameter 'ml' means "means like" which returns synonyms.
API is free and doesn't require authentication.

#### Parameters

<table>
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`word`

</td>
<td>

`string`

</td>
<td>

The word to find synonyms for

</td>
</tr>
</tbody>
</table>

#### Returns

`Promise`\<`string`[]\>

Array of synonym words (lowercase), empty array on error

#### Example

```ts
const resolver = SynonymResolver.getInstance();
const synonyms = await resolver.getSynonyms('jump');
console.log(synonyms); // ['leap', 'hop', 'spring', 'bound', ...]
```

***

### isCached()

```ts
isCached(word): boolean;
```

Defined in: [SynonymResolver.ts:186](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/a499d4999cefb5304bcc22b147407d7750156d6f/src/SynonymResolver.ts#L186)

Checks if synonyms for a specific word are already cached.

#### Parameters

<table>
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`word`

</td>
<td>

`string`

</td>
<td>

The word to check

</td>
</tr>
</tbody>
</table>

#### Returns

`boolean`

True if synonyms are cached, false otherwise

#### Example

```ts
const resolver = SynonymResolver.getInstance();
if (resolver.isCached('jump')) {
  console.log('Synonyms for "jump" are already cached');
}
```

***

### prefetchSynonyms()

```ts
prefetchSynonyms(words): Promise`<void>`;
```

Defined in: [SynonymResolver.ts:205](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/a499d4999cefb5304bcc22b147407d7750156d6f/src/SynonymResolver.ts#L205)

Pre-fetches and caches synonyms for multiple words at once.
Useful for initializing the cache with commonly used words.

#### Parameters

<table>
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`words`

</td>
<td>

`string`[]

</td>
<td>

Array of words to pre-fetch synonyms for

</td>
</tr>
</tbody>
</table>

#### Returns

`Promise`\<`void`\>

Resolves when all synonyms are fetched

#### Example

```ts
const resolver = SynonymResolver.getInstance();
await resolver.prefetchSynonyms(['jump', 'run', 'walk']);
// All synonyms are now cached and ready for instant lookup
```

***

### getInstance()

```ts
static getInstance(): SynonymResolver;
```

Defined in: [SynonymResolver.ts:40](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/a499d4999cefb5304bcc22b147407d7750156d6f/src/SynonymResolver.ts#L40)

Returns the singleton instance of SynonymResolver.

#### Returns

`SynonymResolver`

The single shared instance
