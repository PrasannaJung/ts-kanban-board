interface DragTransferData {
  boardId: number;
  targetElementId: string;
}

const boards: string[] = ["Todo", "Doing", "Done"];
let cardCounter: number = 2;

function main(): void {
  const allBoards = document.querySelectorAll<HTMLDivElement>(".board");
  const allCards = document.querySelectorAll<HTMLDivElement>(".card");

  allCards.forEach((card) => {
    card.addEventListener(
      "dragstart",
      function (this: HTMLDivElement, event: DragEvent) {
        const targetElement = event.target as HTMLDivElement;
        console.log("THE ELEMENT BEING DRAGGED IS ", targetElement.id);
        this.classList.add("dragging");

        const parentBoard = this.parentElement as HTMLDivElement;
        if (parentBoard && event.dataTransfer) {
          const dto: DragTransferData = {
            boardId: parseInt(parentBoard.id),
            targetElementId: targetElement.id,
          };
          event.dataTransfer.setData("application/json", JSON.stringify(dto));
        }
      }
    );

    card.addEventListener("dragend", function (this: HTMLDivElement) {
      this.classList.remove("dragging");
    });

    card.addEventListener("blur", function (this: HTMLDivElement) {
      this.contentEditable = "false";
      if (this.textContent?.trim() === "") {
        this.textContent = "Empty Task";
      }
    });

    card.addEventListener(
      "keydown",
      function (this: HTMLDivElement, event: KeyboardEvent) {
        if (event.key === "Enter") {
          event.preventDefault();
          this.blur();
        }
      }
    );

    card.addEventListener("dblclick", function (this: HTMLDivElement) {
      this.contentEditable = "true";
      this.focus();

      if (window.getSelection) {
        const selection = window.getSelection();
        if (selection) {
          const range = document.createRange();
          range.selectNodeContents(this);
          console.log("THE RANGE IS ", range);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
    });
  });

  allBoards.forEach(function (board) {
    board.addEventListener("dragover", function (event: DragEvent) {
      event.preventDefault();
      console.log("ELEMENT OVER A DROPZONE");
    });

    board.addEventListener(
      "dragenter",
      function (this: HTMLDivElement, event: DragEvent) {
        event.preventDefault();
        if (event.dataTransfer) {
          const dragData =
            event.dataTransfer.types.includes("application/json");
          if (dragData) {
            this.classList.add("drag-over");
          }
        }
      }
    );

    board.addEventListener(
      "dragleave",
      function (this: HTMLDivElement, event: DragEvent) {
        console.log("LEAVING THE DROP ZONE");
        const relatedTarget = event.relatedTarget as Node;
        if (!this.contains(relatedTarget)) {
          this.classList.remove("drag-over", "drag-invalid");
        }
      }
    );

    board.addEventListener(
      "drop",
      function (this: HTMLDivElement, event: DragEvent) {
        event.preventDefault();

        if (!event.dataTransfer) return;

        const receivedDto: DragTransferData = JSON.parse(
          event.dataTransfer.getData("application/json")
        );
        console.log("ELEMENT DROPPED IN THE DROPZONE OF ID", receivedDto);

        const currentBoardId = parseInt(this.id);
        const sourceBoardId = receivedDto.boardId;
        const draggedElement = document.getElementById(
          receivedDto.targetElementId
        ) as HTMLDivElement;

        if (!draggedElement) return;

        const isValidMove =
          currentBoardId - sourceBoardId <= 1 &&
          currentBoardId !== sourceBoardId;

        if (isValidMove) {
          this.appendChild(draggedElement);
          this.classList.remove("drag-over");
          updateEmptyStates();
        } else if (currentBoardId === sourceBoardId) {
          this.classList.remove("drag-over");
        } else {
          this.classList.remove("drag-over");
          this.classList.add("drag-invalid");
          setTimeout(() => {
            this.classList.remove("drag-invalid");
          }, 600);
        }
      }
    );
  });

  const addCardBtn = document.getElementById("addCardBtn") as HTMLButtonElement;
  if (addCardBtn) {
    addCardBtn.addEventListener("click", addCard);
  }
}

function addCard(): void {
  const todoBoard = document.getElementById("0") as HTMLDivElement;
  if (!todoBoard) return;

  const newCard = document.createElement("div");
  cardCounter++;

  newCard.id = `card-${cardCounter}`;
  newCard.className = "card";
  newCard.draggable = true;
  newCard.contentEditable = "true";
  newCard.textContent = "New Task - Click to edit";

  todoBoard.appendChild(newCard);
  newCard.focus();

  if (window.getSelection) {
    const selection = window.getSelection();
    if (selection) {
      const range = document.createRange();
      range.selectNodeContents(newCard);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  setupNewCardEvents(newCard);
  updateEmptyStates();
}

function setupNewCardEvents(card: HTMLDivElement): void {
  card.addEventListener(
    "dragstart",
    function (this: HTMLDivElement, event: DragEvent) {
      const targetElement = event.target as HTMLDivElement;
      console.log("THE ELEMENT BEING DRAGGED IS ", targetElement.id);
      this.classList.add("dragging");

      const parentBoard = this.parentElement as HTMLDivElement;
      if (parentBoard && event.dataTransfer) {
        const dto: DragTransferData = {
          boardId: parseInt(parentBoard.id),
          targetElementId: targetElement.id,
        };
        event.dataTransfer.setData("application/json", JSON.stringify(dto));
      }
    }
  );

  card.addEventListener("dragend", function (this: HTMLDivElement) {
    this.classList.remove("dragging");
  });

  card.addEventListener("blur", function (this: HTMLDivElement) {
    this.contentEditable = "false";
    if (this.textContent?.trim() === "") {
      this.textContent = "Empty Task";
    }
  });

  card.addEventListener(
    "keydown",
    function (this: HTMLDivElement, event: KeyboardEvent) {
      if (event.key === "Enter") {
        event.preventDefault();
        this.blur();
      }
    }
  );

  card.addEventListener("dblclick", function (this: HTMLDivElement) {
    this.contentEditable = "true";
    this.focus();

    if (window.getSelection) {
      const selection = window.getSelection();
      if (selection) {
        const range = document.createRange();
        range.selectNodeContents(this);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  });
}

function updateEmptyStates(): void {
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

document.addEventListener("DOMContentLoaded", function () {
  main();
});
