import { newGame } from "./game/game_manager.js"

export const sizeInput = document.querySelector("#size")
export const difficultyInput = document.querySelector("#difficulty")
export const newGameButton = document.querySelector("#new_game")

newGameButton.onclick = newGame