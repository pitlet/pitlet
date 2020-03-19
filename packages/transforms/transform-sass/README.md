# bsp-transform-sass

Transforms sass/scss to css.

## Input

```scss
$width: 10px;

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

Based on https://github.com/egoist/rollup-plugin-postcss.
