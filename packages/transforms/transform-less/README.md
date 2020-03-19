# bsp-transform-less

Transforms less to css.

## Input

```less
@width: 10px;

h1 {
  width: @width;
}
```

## Output

```css
h1 {
  width: 10px;
}
```

## Credits

This example is based on https://github.com/webpack-contrib/less-loader.
