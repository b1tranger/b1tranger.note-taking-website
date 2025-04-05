
// DOM elements
const notesContainer = document.getElementById('notesContainer');
const noteInput = document.getElementById('noteInput');
const addNoteBtn = document.getElementById('addNoteBtn');
const downloadBtn = document.getElementById('downloadBtn');
const clearBtn = document.getElementById('clearBtn');
const closeModal = document.getElementById('closeModal');
const modalDownloadBtn = document.getElementById('modalDownloadBtn');
const modalCancelBtn = document.getElementById('modalCancelBtn');
const emptyMessage = document.querySelector('.empty-message');

// Array to store notes
let notes = [];

// Load saved notes from localStorage when the page loads
document.addEventListener('DOMContentLoaded', function() {
    const savedNotes = localStorage.getItem('chatNotes');
    if (savedNotes) {
        notes = JSON.parse(savedNotes);
        renderNotes();
    }
    
    // Focus on the input field
    // noteInput.focus();
});

// Function to add a new note
function addNote() {
    const noteText = noteInput.value.trim();
    if (noteText !== '') {
        // Create a new note object with text and timestamp
        const newNote = {
            text: noteText,
            timestamp: new Date().toLocaleString()
        };
        
        // Add the note to the array
        notes.push(newNote);
        
        // Save to localStorage
        saveNotes();
        
        // Clear the input field
        noteInput.value = '';
        
        // Render the notes
        renderNotes();
        
        // Focus back on the input field
        noteInput.focus();
    }
}

// Function to save notes to localStorage
function saveNotes() {
    localStorage.setItem('chatNotes', JSON.stringify(notes));
}

// Function to render notes
function renderNotes() {
    // Clear the container except for the empty message
    notesContainer.innerHTML = '';
    
    // Show or hide the empty message
    if (notes.length === 0) {
        notesContainer.appendChild(emptyMessage);
        return;
    }
    
    // Render each note
    notes.forEach((note, index) => {
        const noteElement = document.createElement('div');
        noteElement.className = 'note';
        
        const noteText = document.createElement('div');
        noteText.textContent = note.text;
        
        const timestamp = document.createElement('span');
        timestamp.className = 'timestamp';
        timestamp.textContent = note.timestamp;
        
        noteElement.appendChild(noteText);
        noteElement.appendChild(timestamp);
        notesContainer.appendChild(noteElement);
    });
}

// Function to download notes as a text file
function downloadNotes() {
    if (notes.length === 0) {
        alert('No notes to download.');
        return;
    }
    
    // Create the content for the file
    let fileContent = 'MY NOTES\n\n';
    notes.forEach((note, index) => {
        fileContent += `[${note.timestamp}]\n${note.text}\n\n`;
    });
    
    // Create a blob and download link
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    
    // Set up the download link
    downloadLink.href = url;
    downloadLink.download = 'my_notes.txt';
    
    // Append to the body, click, and remove
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    // Clean up
    URL.revokeObjectURL(url);
}

// Function to clear all notes
function clearNotes() {
    if (confirm('Are you sure you want to clear all notes?')) {
        notes = [];
        saveNotes();
        renderNotes();
    }
}

// Event listeners
addNoteBtn.addEventListener('click', addNote);

noteInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        addNote();
    }
});

downloadBtn.addEventListener('click', downloadNotes);
clearBtn.addEventListener('click', clearNotes);
modalDownloadBtn.addEventListener('click', function() {
    downloadNotes();
    closeModal.style.display = 'none';
});

modalCancelBtn.addEventListener('click', function() {
    closeModal.style.display = 'none';
});

// Show modal when user tries to leave
window.addEventListener('beforeunload', function(e) {
    if (notes.length > 0) {
        // Modern browsers require returning a string to show a confirmation dialog
        e.preventDefault();
        e.returnValue = '';
        
        // Show our custom modal
        closeModal.style.display = 'flex';
    }
});

// Prompt user before closing/refreshing the page
window.addEventListener('beforeunload', (e) => {
    if (notes.length > 0) {
        e.preventDefault();
        e.returnValue = '';

        // This will be shown by the browser
        return 'You have unsaved notes. Would you like to download them before leaving?';
    }
});

// Auto-download notes before closing tab
window.addEventListener("beforeunload", downloadNotes);