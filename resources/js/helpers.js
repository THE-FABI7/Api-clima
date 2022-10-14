export default class Helpers {
  /**
   * Genera un número entero aleatorio en un rango determinado
   * @param {int} min El intervalo inferior
   * @param {int} max El intervalo superior
   * @returns {int} Un valor aleatorio entero en un rango determinado
   */
  static random = (min, max) => {
    min = Math.ceil(min); // aproximar al entero superior
    max = Math.floor(max); // aproximar al tenero inferior
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  /**
   * Permite conocer el elemento seleccionado de un conjunto de radio buttons
   * @param {String} selector Un selector CSS que permite seleccionar el grupo de radio buttons
   * @returns {String} Retorna el atributo value del radio button seleccionado
   */
  static selectedRadioButton = (selector) => {
    const radio = document.querySelector(selector + ":checked");
    return radio ? radio.value : radio;
  };

  //retorna un array de objetos con información sobre el estado de seleccionado o no, de una colección de elementos de tipo checkbox o radio button
  static getItems = (selector) => {
    const items = document.querySelectorAll(selector);
    return [...items].map((item) => {
      // operador rest >  desestructuración
      return { value: item.value, checked: item.checked };
    });
  };

  //devuelve un objeto con información sobre el índice del elemento seleccionado
  static selectedItemList = (selector) => {
    const list = document.querySelector(selector);
    const item = list.options[list.selectedIndex];
    return {
      selectedIndex: list.selectedIndex,
      value: item.value,
      text: item.text,
    };
  };

  //permite asignar elementos a una lista desplegable a partir de un array de objetos
  static populateSelectList = (
    selector,
    items = [],
    value = "",
    text = "",
    firstOption = ""
  ) => {
    let list = document.querySelector(selector);
    list.options.length = 0;
    if (firstOption) {
      list.add(new Option(firstOption, ""));
    }
    items.forEach((item) => list.add(new Option(item[text], item[value])));
    return list; // <-- OJO
  };

  //permite cargar páginas en un contenedor a partir de una URL dada
  static loadPage = async (url, container) => {
    try {
      const element = document.querySelector(container);
      if (!element) {
        throw new Error(`Parece que el selector '${container}' no es válido`);
      }

      const response = await fetch(url);
      // console.log(response);
      if (response.ok) {
        const html = await response.text();
        element.innerHTML = html;
        return element; // para permitir encadenamiento
      } else {
        throw new Error(
          `${response.status} - ${response.statusText}, al intentar acceder al recurso '${response.url}'`
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  static fetchData = async (url) => {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `${response.status} - ${response.statusText}, al intentar acceder al recurso '${response.url}'`
      );
    }

    return await response.json();
  };
}
