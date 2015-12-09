
## Mustache / Data support

Dynamic content suport can be managed using [Mustache](https://github.com/janl/mustache.js)

The following text is dynamically injected at build time:

### {{ text.hello }}

{{=<% %>=}}
```
{{ text.hello }}
```
<%={{ }}=%>

note:

The input data is a merge of all the JSON files in the "/data" directory. The base name of the json file becomes the top level key of the data. In the example above, the `data/text.json` file contains a map that includes a `hello` key.  This is merged with any other json files, and the result is a map that contains:

```json
{
	"text" : {
		"hello" : "Hello World",
		...
	},
	...
}
```

The "-d" / "--data-dir" argument can override the data dir location.

The odd syntax used in the slide content example temporarily switch the token pattern to enable showing the raw handlebars.
