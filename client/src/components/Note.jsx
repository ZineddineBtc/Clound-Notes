import React from "react";

function Note(props) {
  function handleClick() {
    props.onDelete(props.id);
  }
  return (
    <div className="col note" style={{marginBottom:"20px"}}>
      <div className="card" style={{textAlign:"center", width:"100%"}}>
      <div className="card-header">{props.time}</div>
      <div className="card-body">
        <h1 className="card-title">{props.title}</h1>
        <p className="card-text">{props.content}</p>
      </div>
      <div className="card-footer">
      <button onClick={handleClick} className="btn btn-outline-danger btn-sm">delete</button>
      </div>
    </div>
    </div>
    
  );
}

export default Note;
