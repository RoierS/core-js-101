/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;

  this.getArea = () => this.width * this.height;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const res = Object.create(proto);
  Object.assign(res, JSON.parse(json));
  return res;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

// const cssSelectorBuilder = {
//   selectors: [],

//   element(value) {
//     this.addSelector(value, 1);
//     return this;
//   },

//   id(value) {
//     this.addSelector(`#${value}`, 2);
//     return this;
//   },

//   class(value) {
//     this.addSelector(`.${value}`, 3);
//     return this;
//   },

//   attr(value) {
//     this.addSelector(`[${value}]`, 4);
//     return this;
//   },

//   pseudoClass(value) {
//     this.addSelector(`:${value}`, 5);
//     return this;
//   },

//   pseudoElement(value) {
//     this.addSelector(`::${value}`, 6);
//     return this;
//   },

//   combine(selector1, combinator, selector2) {
//     this.addSelector(`${selector1.stringify()} ${combinator} ${selector2.stringify()}`, 7);
//     return this;
//   },

//   stringify() {
//     const res = this.selectors.join('');
//     this.selectors = [];
//     return res;
//   },

//   addSelector(selector, priority) {
//     const newBuild = Object.create(cssSelectorBuilder);
//     newBuild.selectors = [...this.selectors, { selector, priority }];
//     return newBuild;
//   },
// };

class CssSelectorBuilder {
  constructor() {
    this.selectors = [];
    // this.elementCount = 0;
    // this.idCount = 0;
    // this.pseudoElementCount = 0;
  }

  element(value) {
    this.validateOrder(1);
    this.elementCount += 1;
    this.selectors.push(value);
    return this;
  }

  id(value) {
    this.validateOrder(2);
    this.idCount += 1;
    this.selectors.push(`#${value}`);
    return this;
  }

  class(value) {
    this.validateOrder(3);
    this.selectors.push(`.${value}`);
    return this;
  }

  attr(value) {
    this.validateOrder(4);
    this.selectors.push(`[${value}]`);
    return this;
  }

  pseudoClass(value) {
    this.validateOrder(5);
    this.selectors.push(`:${value}`);
    return this;
  }

  pseudoElement(value) {
    this.validateOrder(6);
    this.pseudoElementCount += 1;
    this.selectors.push(`::${value}`);
    return this;
  }

  combine(selector1, combinator, selector2) {
    this.selectors.push(`${selector1.stringify()} ${combinator} ${selector2.stringify()}`);
    return this;
  }

  stringify() {
    const res = this.selectors.join('');
    this.selectors = [];
    return res;
  }

  validateOrder(prio) {
    const lastSelector = this.selectors[this.selectors.length - 1];
    let elementCount = 0;
    let idCount = 0;
    let pseudoElementCount = 0;

    this.selectors.forEach((selector) => {
      if (selector.startsWith('#')) {
        idCount += 1;
      } else if (selector.startsWith('::')) {
        pseudoElementCount += 1;
      } else {
        elementCount += 1;
      }
    });

    if (elementCount > 1 || idCount > 1 || pseudoElementCount > 1) {
      throw new Error('Element, id and pseudo-element should not occur more than one time inside the selector');
    }

    if (
      (lastSelector && lastSelector.startsWith('#') && prio !== 2)
      || (lastSelector && lastSelector.startsWith('::') && prio !== 6)
    ) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
  }
}

const cssSelectorBuilder = {
  element(value) {
    return new CssSelectorBuilder().element(value);
  },

  id(value) {
    return new CssSelectorBuilder().id(value);
  },

  class(value) {
    return new CssSelectorBuilder().class(value);
  },

  attr(value) {
    return new CssSelectorBuilder().attr(value);
  },

  pseudoClass(value) {
    return new CssSelectorBuilder().pseudoClass(value);
  },

  pseudoElement(value) {
    return new CssSelectorBuilder().pseudoElement(value);
  },

  combine(selector1, combinator, selector2) {
    return new CssSelectorBuilder().combine(selector1, combinator, selector2);
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
