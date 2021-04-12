import React, { useState } from "react";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import Zoom from "@material-ui/core/Zoom";
import $ from "jquery";

function CreateArea(props) {
  const [isExpanded, setExpanded] = useState(false);

  const [note, setNote] = useState({title:"",content:"",time:""});

  function handleChange(event) {
    const { name, value } = event.target;
    setNote(prevNote => {
      return {
        ...prevNote,
        [name]: value,
        time: getTime()
      };
    });
  }
  function getTime() {
    const date = new Date();
    return ""+date.getDate()+"/"+date.getMonth()+"/"+date.getFullYear()+
    " "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
  }
  function submitNote(event) {
    pushNoteToDB();
    event.preventDefault();
  }
  function pushNoteToDB() {
    $.ajax({
      url: "create-note",
      type: "POST",
      data:{title: note.title, content: note.content, time: note.time},
      success: function(result){
          const id = result.id;
          console.log("Pushed with success: "+id);
          setNote(prevNote => {return {...prevNote, key:id, id:id}});
          props.onAdd(note);
          setNote({title:"", content:"", time:""});
    }
  });
  }
  function expand() {
    setExpanded(true);
  }

  return (
    <div>
      <form className="create-note">
        {isExpanded && (
          <input
            name="title"
            onChange={handleChange}
            value={note.title}
            placeholder="Title"
          />
        )}

        <textarea
          name="content"
          onClick={expand}
          onChange={handleChange}
          value={note.content}
          placeholder="Take a note..."
          rows={isExpanded ? 3 : 1}
        />
        <Zoom in={isExpanded}>
          <Fab onClick={submitNote}>
            <AddIcon />
          </Fab>
        </Zoom>
      </form>
    </div>
  );
}

export default CreateArea;
