export default class Modal {
  title: string;
  content: HTMLElement;
  modal: HTMLDivElement;
  modalContent: HTMLDivElement;
  body: HTMLElement;
  constructor(title: string, content: HTMLElement) {
    this.title = title;
    this.content = content;
    this.modal = document.createElement("div");
    this.modal.classList.add("hidden", "modal");
    this.modalContent = document.createElement("div");
    this.modalContent.classList.add("modal-content");
    this.body = document.createElement("section");
    this.body.append(content);
    this.modalContent.append(
      (document.createElement("header").textContent =
        this.title),
      this.body
    );
    this.modal.append(this.modalContent);
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
