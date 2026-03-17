const STATUS_ROW = 9;
const COMM_ROW = 10;
const COL_STATUS = 1;            // A10
const COL_OPPONENT_ID = 2;     // B10
const COL_LAST_MOVE = 3;       // C10
const COL_MY_TURN = 4;          // D10
const COL_MOVE_COUNTER = 5;   // E10
const COL_GAME_ID = 6;           // F10


function readComm(sheet, col) {
  return sheet.getRange(COMM_ROW, col).getValue().toString();
}

function writeComm(sheet, col, value) {
  sheet.getRange(COMM_ROW, col).setValue(value);
}

function readAllComm(sheet) {
  return {
    status: readComm(sheet, COL_STATUS),
    opponentId: readComm(sheet, COL_OPPONENT_ID),
    lastMove: readComm(sheet, COL_LAST_MOVE),
    myTurn: readComm(sheet, COL_MY_TURN) === 'TRUE',
    moveCounter: parseInt(readComm(sheet, COL_MOVE_COUNTER)) || 0,
    gameId: readComm(sheet, COL_GAME_ID)
  };
}
function getRemoteSheet(sheetId) {
  return SpreadsheetApp.openById(sheetId).getActiveSheet();
}
function readRemoteComm(sheetId, col) {
  return getRemoteSheet(sheetId).getRange(COMM_ROW, col).getValue().toString();
}
function writeRemoteComm(sheetId, col, value) {
  getRemoteSheet(sheetId).getRange(COMM_ROW, col).setValue(value);
}
// do the chess movement language and mirror it so we can render
function mirrorMove(move) {
  var fromCol = move.charAt(0);
  var fromRow = 9 - parseInt(move.charAt(1));
  var toCol = move.charAt(2);
  var toRow = 9 - parseInt(move.charAt(3));
  return fromCol + fromRow + toCol + toRow;
}

function toGrid(sq) {
  var col = sq.charCodeAt(0) - 96; 
  var row = 9 - parseInt(sq.charAt(1));
  return { row: row, col: col };
}

function toAlpha(row, col) {
  var letter = String.fromCharCode(96 + col);
  var number = 9 - row;
  return letter + number;
}

function generateGameId() {
  return Math.random().toString(36).substring(2, 10);
}

function getMySheetId() {
  return SpreadsheetApp.getActiveSpreadsheet().getId();
}

function setStatus(sheet, message) {
  sheet.getRange(STATUS_ROW, 1).setValue(message);
}

function setRemoteStatus(sheetId, message) {
  getRemoteSheet(sheetId).getRange(STATUS_ROW, 1).setValue(message);
}
