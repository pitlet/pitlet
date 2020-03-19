# bsp-transform-stylus

Transforms stylus to css.

## Input

```stylus
$width= 10px;

h1 {
  width: $width;
}
```

## Output

```css
h1 {
  width: 10px;
}
```

## Credits

This example is based on https://github.com/egoist/rollup-plugin-postcss.
