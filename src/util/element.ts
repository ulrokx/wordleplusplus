/**
Returns the element with the given tag name and attributes. Appends the given children to the element.
 */
export default function elem(
  tag: string,
  attrs?:
    | { [key: string]: string | Function }
    | Array<HTMLElement>
    | string
    | HTMLElement,
  ...children: Array<
    HTMLElement | string | Array<HTMLElement | string>
  >
): HTMLElement {
  const element = document.createElement(tag); // create element
  if (
    !children &&
    attrs &&
    (Array.isArray(attrs) || typeof attrs === "string")
  ) {
    if (typeof attrs === "string") {
      element.innerText = attrs;
    } else {
      children = attrs; // if no attrs, but children, set attrs to children
    }
  } else if (attrs) {
    // if attrs exist then loop through them  and set attributes
    Object.keys(attrs).forEach((key) => {
      if (typeof attrs[key] === "function") {
        element.addEventListener(key, attrs[key]);
      } else {
        try {
          // idk what is going on here
          element.setAttribute(key, attrs[key]);
        } catch (e) {}
      }
    });
  }
  if (children) {
    // if children exist then loop through them and append them
    children.forEach((child) => {
      if (Array.isArray(child)) {
        // if a child is an array of elements
        child.forEach((c) => {
          if (c instanceof HTMLElement) {
            // if child is a string, create text node
            element.appendChild(c);
          } else {
            // if child is an element, append it
            element.appendChild(
              document.createTextNode(String(c))
            );
          }
        });
      } else {
        // if child is a string, create text node
        if (child instanceof HTMLElement) {
          element.appendChild(child);
        } else {
          element.appendChild(
            document.createTextNode(String(child))
          );
          // if child is an element, append it
        }
      }
    });
  }
  return element;
}
