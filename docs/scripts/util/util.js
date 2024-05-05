const HtmlSanitizer = {
  tempElement: document.createElement("div"),
  sanitize: function (/** @type {string} */ htmlString) {
    this.tempElement.innerText = htmlString;
    return this.tempElement.innerHTML;
  },
};

class HtmlString extends String {
  /**@type {HTMLElement|null} */
  element = null;

  /**@param {string} value */
  constructor(value) {
    super(value);
  }

  /**@returns {HTMLElement} */
  asElement() {
    if (this.element !== null) {
      return this.element;
    }

    const temp = document.createElement("div");
    temp.innerHTML = this.valueOf();
    if (temp.childElementCount > 1) {
      throw new Error("html template does not accept more than 1 element");
    }

    this.element = /**@type {HTMLElement} */ (temp.firstElementChild);
    return /**@type {HTMLElement} */ (this.element);
  }
}

/**
 * @param {string} selector
 * @param {HTMLElement|Document} rootElement
 * @returns {HTMLElement|null}
 */
export function $findElm(selector, rootElement = document) {
  return /**@type {HTMLElement|null} */ (rootElement.querySelector(selector));
}

/**
 * @param {string} selector
 * @param {HTMLElement|Document} rootElement
 * @returns {HTMLElement}
 */
export function $findElmStrictly(selector, rootElement = document) {
  const element = /**@type {HTMLElement|null} */ (rootElement.querySelector(selector));
  if (element === null) {
    throw new Error(`Element with selector '${selector}' not found`);
  }

  return element;
}

/**
 * @param {string} selector
 * @returns {NodeListOf<HTMLElement>}
 */
export function $findAll(selector) {
  return /**@type {NodeListOf<HTMLElement>} */ (document.querySelectorAll(selector));
}

/**@typedef {string|HtmlString|number|boolean} NumOrStr */

/**
 * safe html interpolation
 * @param {TemplateStringsArray} literalValues
 * @param {NumOrStr[]|NumOrStr[][]} interpolatedValues
 * @returns {HtmlString}
 */
export function html(literalValues, ...interpolatedValues) {
  let result = "";

  interpolatedValues.forEach((currentInterpolatedVal, idx) => {
    let literalVal = literalValues[idx];
    let interpolatedVal = "";
    if (Array.isArray(currentInterpolatedVal)) {
      interpolatedVal = currentInterpolatedVal.join("\n");
    } else if (typeof currentInterpolatedVal !== "boolean") {
      interpolatedVal = currentInterpolatedVal.toString();
    }

    const isSanitize = !literalVal.endsWith("$");
    if (isSanitize) {
      result += literalVal;
      result += HtmlSanitizer.sanitize(interpolatedVal);
    } else {
      literalVal = literalVal.slice(0, -1);

      result += literalVal;
      result += interpolatedVal;
    }
  });

  result += literalValues.slice(-1);
  return new HtmlString(result);
}

/**
 * @param {number} lat
 * @param {number} lon
 * @returns {string}
 */
export function getGoogleMapsUrl(lat, lon) {
  return `https://www.google.com/maps?q=${lat},${lon}`;
}
