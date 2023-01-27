const canvas = document.querySelector("#canvas");
let context = canvas.getContext('2d');

const restartDiv = document.querySelector(".restart");
const restartP = document.querySelector(".restart p");
const restartButton = document.querySelector("#restart");

const scoreDiv = document.querySelector(".score span");

const buttonTop = document.querySelector("#up");
const buttonBottom = document.querySelector("#down");
const buttonLeft = document.querySelector("#left");
const buttonRight = document.querySelector("#right");

const gameSize = { "x": context.canvas.width, "y": context.canvas.height }

let speed = 500;

const snakeSize = 10;

let snakePositions = [{ "x": 0, "y": 0 }];

const directions = ["up", "left", "right", "down"];
let direction = 2;

const applePosition = { "x": 0, "y": 0 };
const colors = ["red", "green", "yellow", "blue"];
let appleColor = "green";

let appleEaten = false;

const allXPositions = [];
const allYPositions = [];

let score = 0;

buttonTop.addEventListener("click", udpateDirection);
buttonBottom.addEventListener("click", udpateDirection);
buttonLeft.addEventListener("click", udpateDirection);
buttonRight.addEventListener("click", udpateDirection);
document.addEventListener("keyup", udpateDirection);

restartButton.addEventListener("click", restart);

function generateAllPositions() {
    i = 1;
    while (i < gameSize["x"] - 1) {
        allXPositions.push(i);
        i += snakeSize;
    }

    i = 1;
    while (i < gameSize["y"] - 1) {
        allYPositions.push(i);
        i += snakeSize;
    }
}

function draw() {
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "white";

    for (let index = 0; index < snakePositions.length; index++) {
        const positions = snakePositions[index];
        context.fillRect(
            allXPositions[positions["x"]],
            allYPositions[positions["y"]],
            snakeSize,
            snakeSize
        );
    }

    context.fillStyle = appleColor;

    context.fillRect(
        allXPositions[applePosition["x"]],
        allYPositions[applePosition["y"]],
        snakeSize,
        snakeSize
    );
}

function updateApplePosition() {
    applePosition["x"] = Math.floor(Math.random() * allXPositions.length);
    applePosition["y"] = Math.floor(Math.random() * allYPositions.length);
    appleColor = colors[Math.floor(Math.random() * colors.length)];
}

function udpateDirection(ev) {
    let newDirection;

    if (ev.type === "keyup") {
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(ev.key)) {
            newDirection = ev.key.split("Arrow")[1].toLowerCase();
        }
    } else if (ev.type === "click") {
        newDirection = ev.target.id;
    }

    // On ignore les changements de direction opposés. 
    // La somme des index équivaut à 3 dans ces cas là.
    if (direction + directions.indexOf(newDirection) !== 3) {
        direction = directions.indexOf(newDirection);
    }

}

function play() {
    const headPosition = snakePositions[snakePositions.length - 1];
    let newPosition;

    switch (direction) {
        case 0:
            newPosition = { "x": headPosition["x"], "y": headPosition["y"] - 1 }
            break;
        case 1:
            newPosition = { "x": headPosition["x"] - 1, "y": headPosition["y"] }
            break;
        case 2:
            newPosition = { "x": headPosition["x"] + 1, "y": headPosition["y"] }
            break;
        case 3:
            newPosition = { "x": headPosition["x"], "y": headPosition["y"] + 1 }
            break;
        default:
            break;
    }

    snakePositions.push(newPosition)

    // Collision avec les bords
    if (allXPositions[newPosition["x"]] === undefined || allYPositions[newPosition["y"]] === undefined) {
        restartDiv.style.display = "flex";
        restartP.textContent = "Oups ! Vous êtes sorti de la zone de jeu ...";
        return;
    }

    // Collision avec lui même

    for (let index = 0; index < snakePositions.length - 1; index++) {
        const element = snakePositions[index];
        if (
            element["x"] === newPosition["x"] &&
            element["y"] === newPosition["y"]
        ) {
            restartDiv.style.display = "flex";
            restartP.textContent = "Oups ! Vous vous êtes mordu la queue ...";
            return
        }
    }

    // Collision avec la pomme
    if (snakePositions[snakePositions.length - 1]["x"] === applePosition["x"] && snakePositions[snakePositions.length - 1]["y"] === applePosition["y"]) {
        appleEaten = true;
        updateApplePosition();
        speed *= 0.95;
        score += 1;
        scoreDiv.textContent = score;
    }

    if (!appleEaten) {
        snakePositions.shift();
    } else {
        appleEaten = false;
    }


    draw();
    setTimeout(() => {
        requestAnimationFrame(play);
    }, speed);
}

function restart(ev) {
    restartDiv.style.display = "none";
    restartP.textContent = "";
    score = 0;
    appleEaten = false;
    direction = 2;
    snakePositions = [{ "x": 5, "y": 5 }]
    updateApplePosition();
    draw();
    play();
}

document.addEventListener("DOMContentLoaded", (ev) => {
    generateAllPositions();
    updateApplePosition();
    draw();
    play();
});
