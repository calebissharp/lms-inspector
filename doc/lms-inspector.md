<a name="LMSInspector"></a>

## LMSInspector : <code>object</code>
**Kind**: global namespace  

* [LMSInspector](#LMSInspector) : <code>object</code>
    * [.convertFileToArrayBuffer(file)](#LMSInspector.convertFileToArrayBuffer) ⇒ <code>Promise.&lt;ArrayBuffer&gt;</code>
    * [.determineCompression(arrayBuffer)](#LMSInspector.determineCompression) ⇒ <code>String</code>
    * [.uncompressZip(arrayBuffer)](#LMSInspector.uncompressZip) ⇒ <code>Promise.&lt;Array.&lt;String&gt;&gt;</code>
    * [.uncompressGzip(arrayBuffer)](#LMSInspector.uncompressGzip) ⇒ <code>Promise.&lt;Array.&lt;String&gt;&gt;</code>
    * [.checkForLMS(filenames)](#LMSInspector.checkForLMS) ⇒ <code>Promise.&lt;String&gt;</code>
    * [.inspect(file)](#LMSInspector.inspect) ⇒ <code>Promise.&lt;String&gt;</code>

<a name="LMSInspector.convertFileToArrayBuffer"></a>

### LMSInspector.convertFileToArrayBuffer(file) ⇒ <code>Promise.&lt;ArrayBuffer&gt;</code>
Reads a File into an `ArrayBuffer`

**Kind**: static method of [<code>LMSInspector</code>](#LMSInspector)  

| Param | Type | Description |
| --- | --- | --- |
| file | <code>File</code> | file to convert to ArrayBuffer |

<a name="LMSInspector.determineCompression"></a>

### LMSInspector.determineCompression(arrayBuffer) ⇒ <code>String</code>
Looks at the first byte of an ArrayBuffer to get the compression type

**Kind**: static method of [<code>LMSInspector</code>](#LMSInspector)  
**Returns**: <code>String</code> - - the type of compression  

| Param | Type | Description |
| --- | --- | --- |
| arrayBuffer | <code>ArrayBuffer</code> | the ArrayBuffer containing the LMS archive |

<a name="LMSInspector.uncompressZip"></a>

### LMSInspector.uncompressZip(arrayBuffer) ⇒ <code>Promise.&lt;Array.&lt;String&gt;&gt;</code>
Extracts a zip file and returns a list of filenames

**Kind**: static method of [<code>LMSInspector</code>](#LMSInspector)  
**Returns**: <code>Promise.&lt;Array.&lt;String&gt;&gt;</code> - - an array of filenames in the zip  

| Param | Type | Description |
| --- | --- | --- |
| arrayBuffer | <code>ArrayBuffer</code> | the ArayBuffer containing the LMS archive |

<a name="LMSInspector.uncompressGzip"></a>

### LMSInspector.uncompressGzip(arrayBuffer) ⇒ <code>Promise.&lt;Array.&lt;String&gt;&gt;</code>
Extracts a gzip file and returns a list of filenames

**Kind**: static method of [<code>LMSInspector</code>](#LMSInspector)  
**Returns**: <code>Promise.&lt;Array.&lt;String&gt;&gt;</code> - - an array of filenames in the gzip  

| Param | Type | Description |
| --- | --- | --- |
| arrayBuffer | <code>ArrayBuffer</code> | the ArayBuffer containing the LMS archive |

<a name="LMSInspector.checkForLMS"></a>

### LMSInspector.checkForLMS(filenames) ⇒ <code>Promise.&lt;String&gt;</code>
Looks at a list of files and determines which LMS they are for, if any

**Kind**: static method of [<code>LMSInspector</code>](#LMSInspector)  
**Returns**: <code>Promise.&lt;String&gt;</code> - - the LMS type  

| Param | Type | Description |
| --- | --- | --- |
| filenames | <code>Array.&lt;String&gt;</code> | an array of filenames in an archive |

<a name="LMSInspector.inspect"></a>

### LMSInspector.inspect(file) ⇒ <code>Promise.&lt;String&gt;</code>
**Kind**: static method of [<code>LMSInspector</code>](#LMSInspector)  
**Returns**: <code>Promise.&lt;String&gt;</code> - - The name of the LMS  

| Param | Type | Description |
| --- | --- | --- |
| file | <code>File</code> | The file to inspect |

