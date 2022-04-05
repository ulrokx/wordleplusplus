import elem from "../util/element";

export default class Modal {
  title: string;
  content: HTMLElement;
  modal: HTMLElement;
  modalContent: HTMLDivElement;
  body: HTMLElement;
  constructor(title: string, content: HTMLElement) { 
    this.title = title; 
    this.content = content;
    this.modal = elem("div", { class: "modal hidden" }, [  // create modal element
      elem("div", { class: "modal-content" }, [
        elem("header", { class: "modal-header" }, [title]),
        elem("div", { class: "modal-body" }, [content]),
      ]),
    ]);
  }

  show() {  // show the modal
    this.modal.classList.remove("hidden");
    this.modal.focus();
  }

  hide() { // hide the modal
    this.modal.classList.add("hidden");
    this.modal.remove();
  }

  elem() { // return the modal element
    return this.modal;
  }
}
