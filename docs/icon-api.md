# Icon API

A lightweight, dynamic SVG icon system that builds a sprite sheet at runtime from individual SVG files injecting only the icons actually used on each page.

---

## How It Works

1. Scans the DOM for elements with the `.icon` class
2. Reads `sprite-names.json` to resolve icon names to SVG file URLs
3. Fetches only the SVGs needed for the current page
4. Builds a hidden SVG sprite sheet and prepends it to `<body>`
5. Injects a `<svg><use>` into each `.icon` element

---

## Usage

### Adding an icon to HTML

#### Example:
```html
<i class="user icon"></i>
```

The class convention is `{icon-name} icon`. The `icon` class marks the element as an icon container. The other class (e.g. `user`) is the icon name and must match an entry in `sprite-names.json`.

### Available icons

| Class name | Description |
| :--------- | :---------- |
| `user`     | Person silhouette |
| `lock`     | Padlock |
| `envelope` | Email / message |
| `signin`   | Arrow pointing inward |
| `signup`   | Arrow pointing outward with plus |

---

## Adding a New Icon

1. Add the SVG file to `/assets/font-awesome/fa-icons`:
   ```
   /assets/font-awesome/fa-icons/star.svg
   ```

2. Register it in `/assets/font-awesome/sprite-names.json`:
   ```json
   {
       "user":     "/assets/font-awesome/fa-icons/user.svg",
       "lock":     "/assets/font-awesome/fa-icons/lock.svg",
       "star":     "/assets/font-awesome/fa-icons/star.svg"
   }
   ```

3. Use it in HTML:
   ```html
   <i class="star icon"></i>
   ```

That's it. No JS changes needed.

---

## SVG File Format

Each SVG file must contain a single `<path>` element:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
    <path d="M320 312C386.3 ..." />
</svg>
```

> **Note:** Do not hardcode a `fill` attribute on the `<path>`. Fill is controlled by CSS.

---

## Styling Icons

Icons inherit `color` from their parent by default. Override with CSS:

```css
/* Size */
.icon svg {
    width: 24px;
    height: 24px;
}

/* Color */
.icon svg {
    fill: gray;
}

/* Inside a button inherit the button's color */
#submit .icon svg {
    fill: currentColor;
}
```

---

## API Reference

### `addIcons()` and `icons.js`

```js
export async function addIcons(): Promise<void>
```

The only public function. Orchestrates the full icon injection lifecycle for the current page. Call this once after the DOM is ready.

**Example inside `initUI`:**
```js
export async function initUI(user) {
    ...
    await addIcons();
}
```

---

## File Structure

```
assets/
└── font-awesome/
    ├── sprite-names.json   ← icon name → SVG URL manifest
    ├── user.svg
    ├── lock.svg
    ├── envelope.svg
    ├── signin.svg
    └── signup.svg

js/
└── utils/
    └── icons.js            ← icon API (addIcons is the public export)
    
js/
└── constants/
    └── icon-constants.js   ← SVG_NAMESPACE, SPRITE_NAMES_URL
```

---

## Notes

- Icons are lazy — only SVGs referenced in the current page's DOM are fetched. A page with only a `user` and `lock` icon will make exactly 2 SVG fetch requests.
- The sprite sheet is prepended to `<body>` with `display: none` and is never visible.
- `addIcons()` must be awaited. Icons will not render if called without `await`.