import React, {useState} from "react";
import Note from "./Note";
import CreateArea from "./CreateArea";
import $ from "jquery";

function Foreground() {
    const [notes, setNotes] = useState([]);


    function addNote(newNote) {
        setNotes(prevNotes => {
        return [...prevNotes, newNote];
        });
    }

    function deleteNote(id) {
        $.ajax({url: "delete-note/"+id, type: "POST"});
        setNotes(prevNotes =>{
            return prevNotes.filter((noteItem)=>{return noteItem._id !== id;});
        });
    }
    
    const [areNotesFetched, fetchNotes] = useState(false);

    function getAllNotes() {
        $.ajax({
            url: "get-notes",
            type: "POST",
            success: function(notes){
                notes.forEach(note=>{addNote(note)});
            }
        });
    }

    if(!areNotesFetched) {
        getAllNotes();
        fetchNotes(true);
    } 

    return <div style={{margin:"20px 20px 0"}}>
        <CreateArea onAdd={addNote} />
        <div className="row row-cols-lg-3 row-cols-md-2 row-cols-1">
            {notes.map((noteItem, index) => {
                return (
                <Note
                    key={noteItem._id}
                    id={noteItem._id}
                    title={noteItem.title}
                    content={noteItem.content}
                    time={noteItem.time}
                    onDelete={deleteNote}
                />
                );
            })}
        </div>
    </div>
}

export default Foreground;