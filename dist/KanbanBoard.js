import { getDragAfterElement } from "./utils.js";
import { KanbanCard } from "./KanbanCard.js";
console.log("KANBAN BOARDDD");
export class KanbanBoard {
    constructor(id, title) {
        this.id = id;
        this.title = title;
        this.element = document.getElementById(String(id));
        this.attachBoardEvents();
    }
    attachBoardEvents() {
        this.element.addEventListener("dragover", (event) => {
            event.preventDefault();
            const dragging = document.querySelector(".dragging");
            const afterElement = getDragAfterElement(this.element, event.clientY);
            if (!dragging || dragging.parentElement !== this.element)
                return;
            if (!afterElement) {
                this.element.appendChild(dragging);
            }
            else {
                this.element.insertBefore(dragging, afterElement);
            }
        });
        this.element.addEventListener("dragenter", (event) => {
            var _a;
            event.preventDefault();
            if ((_a = event.dataTransfer) === null || _a === void 0 ? void 0 : _a.types.includes("application/json")) {
                this.element.classList.add("drag-over");
            }
        });
        this.element.addEventListener("dragleave", (event) => {
            const related = event.relatedTarget;
            if (!this.element.contains(related)) {
                this.element.classList.remove("drag-over", "drag-invalid");
            }
        });
        this.element.addEventListener("drop", (event) => {
            event.preventDefault();
            if (!event.dataTransfer)
                return;
            const dto = JSON.parse(event.dataTransfer.getData("application/json"));
            const sourceBoardId = dto.boardId;
            const currentBoardId = this.id;
            const draggedElement = document.getElementById(dto.targetElementId);
            if (!draggedElement)
                return;
            const isValidMove = currentBoardId - sourceBoardId <= 1 && currentBoardId !== sourceBoardId;
            if (isValidMove) {
                console.log("DROP EVENT CALLED");
                this.element.appendChild(draggedElement);
                this.element.classList.remove("drag-over");
                KanbanBoard.updateEmptyStates();
            }
            else if (currentBoardId === sourceBoardId) {
                this.element.classList.remove("drag-over");
            }
            else {
                this.element.classList.remove("drag-over");
                this.element.classList.add("drag-invalid");
                setTimeout(() => {
                    this.element.classList.remove("drag-invalid");
                }, 600);
            }
        });
    }
    static updateEmptyStates() {
        const boards = document.querySelectorAll(".board");
        boards.forEach((board) => {
            const cards = board.querySelectorAll(".card");
            const emptyState = board.querySelector(".empty-state");
            if (cards.length === 0 && !emptyState) {
                const emptyDiv = document.createElement("div");
                emptyDiv.className = "empty-state";
                const boardId = board.id;
                if (boardId === "0")
                    emptyDiv.textContent = "Add tasks to get started";
                else if (boardId === "1")
                    emptyDiv.textContent = "Drop tasks here to start working";
                else
                    emptyDiv.textContent = "Completed tasks will appear here";
                board.appendChild(emptyDiv);
            }
            else if (cards.length > 0 && emptyState) {
                emptyState.remove();
            }
        });
    }
    addCard() {
        KanbanBoard.cardCounter++;
        const card = new KanbanCard(`card-${KanbanBoard.cardCounter}`, "New Task - Click to edit");
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
KanbanBoard.cardCounter = 0;
