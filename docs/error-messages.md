# Error Messages

Shows custom error messages in any html page.

---

## How It Works
* Takes an element from your html page and toggles the `show` class based on a certain condition.

---

## Usage
* Link ``/css/error-message.css`` in your html page.
* Add a paragraph element and give it the class ``ErrorMessage``.
* In your js file, import ``toggleErrorMessage``
* Its parameters:
    * `element` => The html error element it will display.
    * `show` => A boolean to toggle the element.
    * `message` => A message to be displayed in the element (can be null if you already added text in the html page)


#### Example:
```html
<p id="recipeNameErrorMessage" class="ErrorMessage">Recipe name cannot include numbers or special characters</p>
```

```js
import { toggleErrorMessage } from "/js/utils/error-message.js"

toggleErrorMessage(document.getElementById("ingredientNameErrorMessage"), invalidName);
```
