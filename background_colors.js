/**
 * @license
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Recolor cells based on when it was last edited.
 * @author jlivni@google.com (Josh Livni).
 */

/*
 * This script uses the Note (comment) of a cell to store a timestamp.
 * Notes are updated on each edit, and background colors are changed when the
 * sheet is opened.
*/

// Each time a cell is edited, update the comment field with the timestamp,
// and set the color to green.
function onEdit(e){
  var range = e.range;
  // Set a comment on the edited cell to indicate when it was changed.
  range.setNote(new Date());
  // Turn background greenish; 
  range.setBackgroundColor('#38f345');
}


// Each time the sheet is opened, recolor each cell based on when it was updated.
function onOpen(){
  var sheet = SpreadsheetApp.getActiveSheet();
  
  var row_count = sheet.getLastRow();
  var col_count = sheet.getLastColumn();
  var range = sheet.getRange(1, 1, row_count, col_count);
  
  var bgcolors = range.getBackgrounds();// Get all existing background colors
  var notes = range.getNotes();// And all existing notes (which should only be dates)
  
  // iterate over each cell
  for (var i = 0; i < row_count; i++){
    for (var j = 0; j < col_count; j++){
      // Check to see when cell was last edited.  Comment should be blank, or a date.
      var note = notes[i][j]
      // If there was no comment, we don't know when it was last edited. Leave it alone.
      if (!note) { continue; }
      
      try {
        var last_edited = new Date(note);
      } catch (e) {
        Logger.log(e + ' unable to read date from ' + i + ' ' + j + ': ' + note);
        continue; 
      }
      
      delta_seconds = (new Date() - last_edited) / 1000
      // Turn green if < 24 hours
      if (delta_seconds < 60 * 60 * 24) {
         bgcolors[i][j] = '#38f345' // greenish
         continue
      }
      
      if (delta_seconds < 60 * 60 * 48) {
         bgcolors[i][j] = '#a2ffa9'; // light greenish
         continue
      }
      // if older than >2 days, make it white again
      bgcolors[i][j] = '#ffffff';
    }
  }
  range.setBackgrounds(bgcolors); // Batch set colors for entire range.
}

function myFunction() {}


