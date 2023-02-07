export interface IProps {
  title: string;
  subtitle?: string;
  children: React.ReactElement;
}

function Default(props: IProps) {
  return (
    <div>
      <h2>{props.title}</h2>
      {props.subtitle && <h5>{props.subtitle}</h5>}

      {props.children}
    </div>
  );
}

export default Default;
