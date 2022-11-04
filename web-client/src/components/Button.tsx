import React from "react";

interface IButtonProps {
  text: string;
  onClick: Function;
}

export default function Button(props: IButtonProps) {
  const handleClick = () => {
    props.onClick();
  };

  return (
    <>
      <button type="button" className="btn btn-primary" onClick={handleClick}>
        {props.text}
      </button>
    </>
  );
}
