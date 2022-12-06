import React from "react";

interface IProps {
  title: string;
  subtitle: string;
  children: React.ReactElement;
}

export default function AuthenticationTitleAndSubtitle(props: IProps) {
  return (
    <div className="d-flex flex-column align-items-center">
      <h2>{props.title}</h2>
      <p className="text-muted">{props.subtitle}</p>
      <>{props.children}</>
    </div>
  );
}
