type BaseProps = {
  title: string;
  contentPosition: "center" | "left";
  children: React.ReactElement;
};

type SubtitleProps = {
  subtitle: string;
  onSubtitleChange: (newSubtitle: string) => void;
} & BaseProps;
type NoSubtitleProps = {
  subtitle?: undefined;
  onSubtitleChange?: undefined;
} & BaseProps;

export type IProps = NoSubtitleProps | SubtitleProps;

function Default(props: IProps) {
  return (
    <div>
      <h1>{props.title}</h1>
      {props.subtitle && <h5 className="text-muted">{props.subtitle}</h5>}
      <div
        id="content"
        className={`mt-4 d-flex ${
          props.contentPosition === "center" ? "justify-content-center" : ""
        } ${props.contentPosition === "left" ? "justify-content-start" : ""}`}
      >
        {props.children}
      </div>
    </div>
  );
}

export default Default;
