function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Chess')
    .addItem('Set Up Board', 'setupBoard')
    .addSeparator()
    .addItem('Send Invite', 'sendInvite')
    .addItem('Check for Invites', 'checkInvite')
    .addSeparator()
    .addItem('My Sheet ID', 'showMyId')
    .addToUi();
}

function showMyId() {
  var ui = SpreadsheetApp.getUi();
  ui.alert('Your Sheet ID', getMySheetId(), ui.ButtonSet.OK);
}

function setupBoard() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  if (sheet.getMaxColumns() > 8) {
    sheet.deleteColumns(9, sheet.getMaxColumns() - 8);
  }
  if (sheet.getMaxRows() > 10) {
    sheet.deleteRows(11, sheet.getMaxRows() - 10);
  }
  while (sheet.getMaxRows() < 10) {
    sheet.insertRowAfter(sheet.getMaxRows());
  }
  sheet.clear();

  for (var col = 1; col <= 8; col++) {
    sheet.setColumnWidth(col, 50);
  }
  for (var row = 1; row <= 8; row++) {
    sheet.setRowHeight(row, 50);
  }

  sheet.setRowHeight(9, 28);
  var statusRange = sheet.getRange('A9:H9');
  statusRange.merge();
  statusRange.setBackground('#1a1a1a');
  statusRange.setFontColor('#c0c0c0');
  statusRange.setFontSize(10);
  statusRange.setFontFamily('Consolas');
  statusRange.setHorizontalAlignment('center');
  statusRange.setVerticalAlignment('middle');
  statusRange.setValue('♟ Waiting for game...');

  sheet.setRowHeight(10, 20);
  var commRange = sheet.getRange('A10:H10');
  commRange.setBackground('#000000');
  commRange.setFontColor('#000000');
  commRange.setFontSize(1);
  sheet.getRange('A10').setValue('IDLE');    // STATUS
  sheet.getRange('B10').setValue('');         // OPPONENT_SHEET_ID
  sheet.getRange('C10').setValue('');         // LAST_MOVE
  sheet.getRange('D10').setValue('FALSE');  // MY_TURN
  sheet.getRange('E10').setValue('0');        // MOVE_COUNTER
  sheet.getRange('F10').setValue('');         // GAME_ID

  const darkBrown = '#8B4513';
  const lightBrown = '#D2B48C';
  for (var row = 1; row <= 8; row++) {
    for (var col = 1; col <= 8; col++) {
      var cell = sheet.getRange(row, col);
      if ((row + col) % 2 === 0) {
        cell.setBackground(lightBrown);
      } else {
        cell.setBackground(darkBrown);
      }
      cell.setHorizontalAlignment('center');
      cell.setVerticalAlignment('middle');
      cell.setFontSize(24);
    }
  }

  // Place pieces
  var blackPieces = ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'];
  for (var col = 1; col <= 8; col++) {
    sheet.getRange(1, col).setValue(blackPieces[col - 1]);
  }
  for (var col = 1; col <= 8; col++) {
    sheet.getRange(2, col).setValue('♟');
  }
  for (var col = 1; col <= 8; col++) {
    sheet.getRange(7, col).setValue('♙');
  }
  var whitePieces = ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'];
  for (var col = 1; col <= 8; col++) {
    sheet.getRange(8, col).setValue(whitePieces[col - 1]);
  }
}
