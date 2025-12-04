# Logging

We provide comprehensive logging functionality with the following features:

- Full transcription text with timestamps
- Detailed synonym resolution tracking (library vs API)
- Confidence scores for all matches
- Error messages for debugging
- JSON export capabilities for data analysis
- Multi-speaker support in online mode
- Suitable for researchers, developers, and analytics


## downloadLogsAsJSON()
:::note
This method only works in browser environments. For node.js, use 'getSessionLogsData()' instead
:::


|Parameters|Type|Description|
|:----------:|:-----:|:----------|
|filename|string|```Default is 'aac-session-log.json'```<br/><br/>Optional parameter that allows the developer to change the name of the file to be downloaded.|

Downloads session logs as a JSON file (browser only).
Triggers a browser download with the specified filename.


![Downloaded Logs](/img/getting-started/logs-saved.png)

[Example of Downloaded Logs](/aac-session-logs-example.json)


```ts
const voice = new AACVoiceAPI();

voice.downloadAsJSON('logged-text.json');
```
Will save the logs to a file called `logged-text.json`

## exportSessionLogs()

Use this method to get comprehensive analytics data including:
- Full transcription text with timestamps
- Matched commands with confidence scores
- Synonym resolution details (library vs API)
- Error messages for failed command executions
 - Speaker IDs (in multi-speaker mode)

 Returns - A pretty-printed JSON string of all session logs

```ts
const voice = new AACVoiceAPI();

const logs = voice.exportSessionLogs();
console.log(logs);
```
Then, in the console, it would display like this:

```ts
[
  {
    "id": 1,
    "timestamp": "2025-12-04T01:01:11.606Z",
    "transcriptionText": " blue",
    "matchedCommands": [
      {
        "commandName": "blue",
        "matchedWord": "blue",
        "synonymSource": "direct",
        "confidence": 1,
        "status": "success"
      }
    ],
    "finalized": true
  },
]
```

## getSessionLogsData()

Gets the raw log data as a Javascript object.
Useful for Node.js environments where a manual file operations are needed.

Returns an array of log entry objects

 ```ts
//Node.js usage
const fs = require('fs');
const logData = voice.getSessionLogsData();
fs.writeFileSync('session-logs.json', JSON.stringify(logData, null, 2));
```

## clearSessionLogs()

Clear all session logs.
Removes all stores transcriptions, matched commands, and resets the log counter.

:::note
This does NOT clear CommandHistory. Use displayCommandHistory() to access the separate command-only history.
:::

```ts
const voice = new AACVoiceAPI();

voice.clearSessionLogs();
```


