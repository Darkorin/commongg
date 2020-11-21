import React from 'react';

function IconButton(props) {
  return (
    <div className="IconButton">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
      <button class="btn">
        <i class={props.class}/>
          {" " + props.text}
        </button>
    </div>
  );
}

export default IconButton;
