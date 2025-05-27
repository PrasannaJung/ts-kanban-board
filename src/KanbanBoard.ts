import { getDragAfterElement } from "./utils.js";
import { KanbanCard } from "./KanbanCard.js";
import { DragTransferData } from "./types.js";

console.log("KANBAN BOARDDD");

export class KanbanBoard {
  element: HTMLDivElement;
  static cardCounter = 0;

  constructor(public id: number, public title: string) {
    this.element = document.getElementById(String(id)) as HTMLDivElement;
    this.attachBoardEvents();
  }

  private attachBoardEvents(): void {
    this.element.addEventListener("dragover", (event) => {
      event.preventDefault();

      const dragging = document.querySelector(".dragging") as HTMLDivElement;
      const afterElement = getDragAfterElement(this.element, event.clientY);
      if (!dragging || dragging.parentElement !== this.element) return;

      if (!afterElement) {
        this.element.appendChild(dragging);
      } else {
        this.element.insertBefore(dragging, afterElement);
      }
    });

    this.element.addEventListener("dragenter", (event: DragEvent) => {
      event.preventDefault();
      if (event.dataTransfer?.types.includes("application/json")) {
        this.element.classList.add("drag-over");
      }
    });

    this.element.addEventListener("dragleave", (event: DragEvent) => {
      const related = event.relatedTarget as Node;
      if (!this.element.contains(related)) {
        this.element.classList.remove("drag-over", "drag-invalid");
      }
    });

    this.element.addEventListener("drop", (event: DragEvent) => {
      event.preventDefault();
      if (!event.dataTransfer) return;

      const dto: DragTransferData = JSON.parse(
        event.dataTransfer.getData("application/json")
      );
      const sourceBoardId = dto.boardId;
      const currentBoardId = this.id;

      const draggedElement = document.getElementById(
        dto.targetElementId
      ) as HTMLDivElement;
      if (!draggedElement) return;

      const isValidMove =
        currentBoardId - sourceBoardId <= 1 && currentBoardId !== sourceBoardId;

      if (isValidMove) {
        console.log("DROP EVENT CALLED");
        this.element.appendChild(draggedElement);
        this.element.classList.remove("drag-over");
        KanbanBoard.updateEmptyStates();
      } else if (currentBoardId === sourceBoardId) {
        this.element.classList.remove("drag-over");
      } else {
        this.element.classList.remove("drag-over");
        this.element.classList.add("drag-invalid");
        setTimeout(() => {
          this.element.classList.remove("drag-invalid");
        }, 600);
      }
    });
  }

  public static updateEmptyStates(): void {
    const boards = document.querySelectorAll<HTMLDivElement>(".board");
    boards.forEach((board) => {
      const cards = board.querySelectorAll<HTMLDivElement>(".card");
      const emptyState = board.querySelector<HTMLDivElement>(".empty-state");

      if (cards.length === 0 && !emptyState) {
        const emptyDiv = document.createElement("div");
        emptyDiv.className = "empty-state";
        const boardId = board.id;
        if (boardId === "0") emptyDiv.textContent = "Add tasks to get started";
        else if (boardId === "1")
          emptyDiv.textContent = "Drop tasks here to start working";
        else emptyDiv.textContent = "Completed tasks will appear here";
        board.appendChild(emptyDiv);
      } else if (cards.length > 0 && emptyState) {
        emptyState.remove();
      }
    });
  }

  public addCard(): void {
    KanbanBoard.cardCounter++;
    const card = new KanbanCard(
      `card-${KanbanBoard.cardCounter}`,
      "New Task - Click to edit"
    );
    this.element.appendChild(card.element);

    card.element.focus();
    const selection = window.getSelection();
    if (selection) {
      const range = document.createRange();
      range.selectNodeContents(card.element);
      selection.removeAllRanges();
      selection.addRange(range);
    }

    KanbanBoard.updateEmptyStates();
  }
}
