<a name="LMSInspector"></a>

## LMSInspector : <code>object</code>
**Kind**: global namespace  

* [LMSInspector](#LMSInspector) : <code>object</code>
    * [.convertFileToArrayBuffer(file)](#LMSInspector.convertFileToArrayBuffer) ⇒ <code>Promise.&lt;ArrayBuffer&gt;</code>
    * [.determineCompression(arrayBuffer)](#LMSInspector.determineCompression) ⇒ <code>String</code>
    * [.uncompressZip(arrayBuffer)](#LMSInspector.uncompressZip) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.uncompressGzip(arrayBuffer)](#LMSInspector.uncompressGzip) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.getType(files)](#LMSInspector.getType) ⇒ <code>String</code>
    * [.getVersion(type, files)](#LMSInspector.getVersion) ⇒ <code>String</code>
    * [.getInfo(file)](#LMSInspector.getInfo) ⇒ <code>Object</code>
    * [.inspect(file)](#LMSInspector.inspect) ⇒ <code>Promise.&lt;Object&gt;</code>

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

### LMSInspector.uncompressZip(arrayBuffer) ⇒ <code>Promise.&lt;Object&gt;</code>
Extracts a zip file and returns a list of files

**Kind**: static method of [<code>LMSInspector</code>](#LMSInspector)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - - an object with filenames and files  

| Param | Type | Description |
| --- | --- | --- |
| arrayBuffer | <code>ArrayBuffer</code> | the ArayBuffer containing the LMS archive |

<a name="LMSInspector.uncompressGzip"></a>

### LMSInspector.uncompressGzip(arrayBuffer) ⇒ <code>Promise.&lt;Object&gt;</code>
Extracts a tar.gz file and returns a list of files

**Kind**: static method of [<code>LMSInspector</code>](#LMSInspector)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - - an object with filenames and files  

| Param | Type | Description |
| --- | --- | --- |
| arrayBuffer | <code>ArrayBuffer</code> | the ArayBuffer containing the LMS archive |

<a name="LMSInspector.getType"></a>

### LMSInspector.getType(files) ⇒ <code>String</code>
Looks at a list of files and determines which LMS they are for, if any

**Kind**: static method of [<code>LMSInspector</code>](#LMSInspector)  
**Returns**: <code>String</code> - - the LMS type  

| Param | Type | Description |
| --- | --- | --- |
| files | <code>Object</code> | an object with filenames and files |

<a name="LMSInspector.getVersion"></a>

### LMSInspector.getVersion(type, files) ⇒ <code>String</code>
Takes an LMS type, and the list of files in the archive, then looks through the files for information regarding the version

**Kind**: static method of [<code>LMSInspector</code>](#LMSInspector)  
**Returns**: <code>String</code> - - a string containing the version if found, or an empty string  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>String</code> | the LMS type |
| files | <code>Object</code> | an object containing the filenames and files in the archive |

<a name="LMSInspector.getInfo"></a>

### LMSInspector.getInfo(file) ⇒ <code>Object</code>
Takes a list of files to extract information about the archive

**Kind**: static method of [<code>LMSInspector</code>](#LMSInspector)  
**Returns**: <code>Object</code> - - an object containing information about the archive  

| Param | Type | Description |
| --- | --- | --- |
| file | <code>Object</code> | the filenames and files |

<a name="LMSInspector.inspect"></a>

### LMSInspector.inspect(file) ⇒ <code>Promise.&lt;Object&gt;</code>
**Kind**: static method of [<code>LMSInspector</code>](#LMSInspector)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - - The information of the LMS  

| Param | Type | Description |
| --- | --- | --- |
| file | <code>File</code> | The file to inspect |

