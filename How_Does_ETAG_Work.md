# How does Etag work?

Etag is a http header that is used for caching.
It looks like this:

```
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
```

The right part specifies the version of the file. It can be arbitrary like

```
ETag: "version1"
```

but usually a hash of the file contents is used.
