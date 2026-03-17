function sendInvite() {
  var ui = SpreadsheetApp.getUi();
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var state = readAllComm(sheet);
  if (state.status !== 'IDLE') {
    ui.alert('You already have an active game or pending invite.');
    return;
  }

  var response = ui.prompt('Send Invite', 'Enter your opponent\'s Sheet ID:', ui.ButtonSet.OK_CANCEL);
  if (response.getSelectedButton() !== ui.Button.OK) return;

  var opponentId = response.getResponseText().trim();
  if (!opponentId) {
    ui.alert('No Sheet ID entered.');
    return;
  }

  // Verify we can access the opponent's sheet
  try {
    var remoteSheet = getRemoteSheet(opponentId);
  } catch (e) {
    ui.alert('Cannot access that sheet. Make sure it\'s shared with "anyone with the link can edit".');
    return;
  }

  // Check opponent isn't already in a game
  var remoteStatus = readRemoteComm(opponentId, COL_STATUS);
  if (remoteStatus !== 'IDLE') {
    ui.alert('Opponent is already in a game or has a pending invite.');
    return;
  }

  var gameId = generateGameId();
  var myId = getMySheetId();

  writeComm(sheet, COL_STATUS, 'INVITE_SENT');
  writeComm(sheet, COL_OPPONENT_ID, opponentId);
  writeComm(sheet, COL_GAME_ID, gameId);
  writeComm(sheet, COL_MY_TURN, 'FALSE');
  writeComm(sheet, COL_MOVE_COUNTER, '0');
  writeComm(sheet, COL_LAST_MOVE, '');

  writeRemoteComm(opponentId, COL_STATUS, 'INVITE_RECEIVED');
  writeRemoteComm(opponentId, COL_OPPONENT_ID, myId);
  writeRemoteComm(opponentId, COL_GAME_ID, gameId);
  writeRemoteComm(opponentId, COL_MY_TURN, 'FALSE');
  writeRemoteComm(opponentId, COL_MOVE_COUNTER, '0');
  writeRemoteComm(opponentId, COL_LAST_MOVE, '');

  setStatus(sheet, '⏳ Invite sent — waiting for opponent...');
  setRemoteStatus(opponentId, '📩 You have a game invite! Go to Chess > Check for Invites');

  ui.alert('Invite sent! Waiting for opponent to accept. You will go first (White).');
}

function checkInvite() {
  var ui = SpreadsheetApp.getUi();
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var state = readAllComm(sheet);

  if (state.status !== 'INVITE_RECEIVED') {
    ui.alert('No pending invites.');
    return;
  }

  var response = ui.alert(
    'Game Invite',
    'You have a game invite! Accept?',
    ui.ButtonSet.YES_NO
  );

  if (response === ui.Button.YES) {
    acceptInvite(sheet, state);
  } else {
    declineInvite(sheet, state);
  }
}

function acceptInvite(sheet, state) {
  var ui = SpreadsheetApp.getUi();
  var opponentId = state.opponentId;
  writeComm(sheet, COL_STATUS, 'ACTIVE');
  writeComm(sheet, COL_MY_TURN, 'FALSE');
  writeRemoteComm(opponentId, COL_STATUS, 'ACTIVE');
  writeRemoteComm(opponentId, COL_MY_TURN, 'TRUE');

  setStatus(sheet, '♟ Game in progress — waiting for opponent\'s move...');
  setRemoteStatus(opponentId, '♙ Game in progress — your move! Go to Chess > Make Move');

  ui.alert('Game started! :D Opponent goes first. Use Chess > Refresh to check for their move.');
}

function declineInvite(sheet, state) {
  var ui = SpreadsheetApp.getUi();
  var opponentId = state.opponentId;
  writeComm(sheet, COL_STATUS, 'IDLE');
  writeComm(sheet, COL_OPPONENT_ID, '');
  writeComm(sheet, COL_GAME_ID, '');
  writeRemoteComm(opponentId, COL_STATUS, 'IDLE');
  writeRemoteComm(opponentId, COL_OPPONENT_ID, '');
  writeRemoteComm(opponentId, COL_GAME_ID, '');

  setStatus(sheet, '♟ Waiting for game...');
  setRemoteStatus(opponentId, '❌ Invite declined. :( ');

  ui.alert('Invite declined :(.');
}
