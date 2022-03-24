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
    this.modal = elem("div", { class: "modal hidden" }, [
      elem("div", { class: "modal-content" }, [
        elem("header", { class: "modal-header" }, [title]),
        elem("div", { class: "modal-body" }, [content]),
      ]),
    ]);
  }

  show() {
    this.modal.classList.remove("hidden");
    this.modal.focus();
  }

  hide() {
    this.modal.classList.add("hidden");
  }

  elem() {
    return this.modal;
  }
}
