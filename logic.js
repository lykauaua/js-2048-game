let board;
let score = 0;
let rows = 4;
let columns = 4;

let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;

function setGame() {
    board = [
        [0, 0, 0, 0],
        [2, 0, 0, 0],
        [0, 0, 4, 0],
        [0, 0, 0, 0]
    ];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            let num = board[r][c];
            updateTile(tile, num);
            document.getElementById("board").append(tile);
        }
    }

    setTwo();
    setTwo();
    document.getElementById("score").innerText = score; // Display initial score
}

function updateTile(tile, num) {
    tile.innerText = "";
    tile.classList.value = "";
    tile.classList.add("tile");

    if (num > 0) {
        tile.innerText = num.toString();

        if (num <= 4096) {
            tile.classList.add("x" + num.toString());
        } else {
            tile.classList.add("x8192");
        }
    }
}

window.onload = function () {
    setGame();
}

function handleSlide(e) {
    console.log(e.code);
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.code)) {
        if (e.code == "ArrowLeft") {
            slideLeft();
            setTwo();
        } else if (e.code == "ArrowRight") {
            slideRight();
            setTwo();
        } else if (e.code == "ArrowUp") {
            slideUp();
            setTwo();
        } else if (e.code == "ArrowDown") {
            slideDown();
            setTwo();
        }
    }

    document.getElementById("score").innerText = score;

    setTimeout(() => {
        checkWin();
    }, 1000);

    if (hasLost() == true) {
        setTimeout(() => {
            alert("Game Over! You have lost the game. Game will restart.")
            restartGame();
            alert("Click any arrow key to restart.");
        }, 100)
    }
};

document.addEventListener("keydown", handleSlide);

function filterZero(row) {
    return row.filter(num => num != 0);
}

function slide(row) {
    row = filterZero(row);

    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] == row[i + 1]) {
            row[i] *= 2;
            score += row[i]; // Update the score
            row[i + 1] = 0;
        }
    }
    row = filterZero(row);

    while (row.length < columns) {
        row.push(0);
    }
    return row;
}

function slideLeft() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        let originalRow = row.slice();
        row = slide(row);
        board[r] = row;

        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            if (originalRow[c] !== num && num !== 0) {
                tile.style.animation = "slide-from-right 0.3s";
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300);
            }
            updateTile(tile, num);
        }
    }
    document.getElementById("score").innerText = score; // Update score display
}

function slideRight() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row.reverse();
        let originalRow = row.slice();
        row = slide(row);
        row.reverse();
        board[r] = row;

        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            if (originalRow[c] !== num && num !== 0) {
                tile.style.animation = "slide-from-left 0.3s";
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300);
            }
            updateTile(tile, num);
        }
    }
    document.getElementById("score").innerText = score; // Update score display
}

function slideUp() {
    for (let c = 0; c < columns; c++) {
        let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
        let originalCol = col.slice();
        col = slide(col);

        let changedIndices = [];
        for (let r = 0; r < rows; r++) {
            if (originalCol[r] !== col[r]) {
                changedIndices.push(r);
            }
        }

        for (let r = 0; r < rows; r++) {
            board[r][c] = col[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            if (changedIndices.includes(r) && num !== 0) {
                tile.style.animation = "slide-from-bottom 0.3s";
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300);
            }
            updateTile(tile, num);
        }
    }
    document.getElementById("score").innerText = score; // Update score display
}

function slideDown() {
    for (let c = 0; c < columns; c++) {
        let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
        col.reverse();
        let originalCol = col.slice();
        col = slide(col);
        col.reverse();

        let changedIndices = [];
        for (let r = 0; r < rows; r++) {
            if (originalCol[r] !== col[r]) {
                changedIndices.push(r);
            }
        }

        for (let r = 0; r < rows; r++) {
            board[r][c] = col[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            if (changedIndices.includes(r) && num !== 0) {
                tile.style.animation = "slide-from-top 0.3s";
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300);
            }
            updateTile(tile, num);
        }
    }
    document.getElementById("score").innerText = score; // Update score display
}

function hasEmptyTile() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) {
                return true;
            }
        }
    }
    return false;
}

function setTwo() {
    if (hasEmptyTile() == false) {
        return;
    }
    let found = false;

    while (found == false) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);

        if (board[r][c] == 0) {
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("x2");
            found = true;
        }
    }
}

function checkWin() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 2048 && is2048Exist == false) {
                alert("You got 2048! Way to go!");
                is2048Exist = true;
            } else if (board[r][c] == 4096 && is4096Exist == false) {
                alert("Awesome! You got 4096!");
                is4096Exist = true;
            } else if (board[r][c] == 8192 && is8192Exist == false) {
                alert("You're unstoppable! You got 8192!");
                is8192Exist = true;
            }
        }
    }
}

function hasLost() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] === 0) {
                return false;
            }
            const currentTile = board[r][c];

            if (
                (r > 0 && board[r - 1][c] === currentTile) ||
                (r < rows - 1 && board[r + 1][c] === currentTile) ||
                (c > 0 && board[r][c - 1] === currentTile) ||
                (c < columns - 1 && board[r][c + 1] === currentTile)
            ) {
                return false;
            }
        }
    }
    return true;
}

function restartGame() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            board[r][c] = 0;
        }
    }

    score = 0;
    document.getElementById("score").innerText = score; // Reset score display
    setTwo();
}
