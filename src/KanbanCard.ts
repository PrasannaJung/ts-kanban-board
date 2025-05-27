import { DragTransferData } from "./types.js";

export class KanbanCard {
  element: HTMLDivElement;

  constructor(id: string, text: string) {
    this.element = document.createElement("div");
    this.element.id = id;
    this.element.className = "card";
    this.element.textContent = text;
    this.element.draggable = true;

    this.attachEvents();
  }

  private attachEvents(): void {
    this.element.addEventListener("dragstart", (event: DragEvent) => {
      this.element.classList.add("dragging");

      const parentBoard = this.element.parentElement as HTMLDivElement;
      if (parentBoard && event.dataTransfer) {
        const dto: DragTransferData = {
          boardId: parseInt(parentBoard.id),
          targetElementId: this.element.id,
        };
        console.log("THE DTO IS ", dto);
        event.dataTransfer.setData("application/json", JSON.stringify(dto));
      }
    });

    this.element.addEventListener("dragend", () => {
      this.element.classList.remove("dragging");
    });

    this.element.addEventListener("blur", () => {
      this.element.contentEditable = "false";
      if (this.element.textContent?.trim() === "") {
        this.element.textContent = "Empty Task";
      }
    });

    this.element.addEventListener("keydown", (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        this.element.blur();
      }
    });

    this.element.addEventListener("dblclick", () => {
      this.element.contentEditable = "true";
      this.element.focus();

      const selection = window.getSelection();
      if (selection) {
        const range = document.createRange();
        range.selectNodeContents(this.element);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    });
  }
}
