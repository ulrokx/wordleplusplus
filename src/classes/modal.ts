import elem from "../util/element";

interface ModalOptions {
  title: string;
  content: HTMLElement;
  clickToClose?: boolean;
}

export default class Modal {
  title: string;
  content: HTMLElement;
  modal: HTMLElement;
  modalContent: HTMLDivElement;
  body: HTMLElement;
  constructor({ title, content, clickToClose }: ModalOptions) {
    this.title = title;
    this.content = content;
    this.modal = elem("div", { class: "modal hidden" }, [
      // create modal element
      elem("div", { class: "modal-content" }, [
        elem("header", { class: "modal-header" }, [title]),
        elem("div", { class: "modal-body" }, [content]),
      ]),
    ]);
    if (clickToClose) {
      this.modal.addEventListener("click", (e) => {
        if (e.target == this.modal) this.hide();
      });
    }
    this.modal.addEventListener("click", (e) => {
      if ((e.target as HTMLButtonElement).id == "close-help-btn") this.hide();
    });
  }

  show() {
    // show the modal
    document.body.append(this.elem());
    this.modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    this.modal.focus();
  }

  hide() {
    // hide the modal
    this.modal.classList.add("hidden");
    document.body.style.overflow = "auto";
    this.modal.remove();
  }

  elem() {
    // return the modal element
    return this.modal;
  }
}
