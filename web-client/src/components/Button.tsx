interface IButtonProps {
  text: string;
  isDisabled: boolean;
  onClick: Function;
}

export default function Button(props: IButtonProps) {
  const handleClick = () => {
    props.onClick();
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-primary w-100"
        disabled={props.isDisabled}
        onClick={handleClick}
      >
        {props.text}
      </button>
    </>
  );
}
