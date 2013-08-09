# sioux Segue

``` batch
npm install sioux-segue
```

Push and modal segue for sioux. The `push` type will perform a right to left `wind` and a left to right `unwind`. The `modal` type will animate a window from the bottom when winding, and back when unwinding.

### create
``` js
var Segue = require('sioux-segue');
var segue = new Segue(document.querySelector('.foo'), 'push');
// first argument: the element segue is performed on
// second argument: the type of segue 
```

### HTML
``` html
<div class="screen">
  <div class="ui-window foo"></div>
</div>
```

### Properties
* __state__: `WINDED` or `UNWINDED`
* __available__: `false` if it is animating
* __DURATION__: the duration of the transition
* __type__: the type of the segue, `push` or `modal`

### Methods
##### .wind(contentFn, callback)
The `contentFn` is a function which has to return a DOM node or node list, that will be inserted into the appearing window. The `callback` function will be called when the animation finished.

##### .unwind(contentFn, callback)
In the `push` type same as the `wind` method but this will slide to the right. If the segue is `modal` __there is no `contentFn` argument just a `callback`.