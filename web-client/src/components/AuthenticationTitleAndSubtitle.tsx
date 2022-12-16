import React from "react";

interface IProps {
  title: string;
  subtitle: string;
  children: React.ReactElement;
}

export default function AuthenticationTitleAndSubtitle(props: IProps) {
  return (
    <div className="d-flex flex-column align-items-center h-100 pt-4">
      <h2>{props.title}</h2>
      <p className="text-muted mb-5">{props.subtitle}</p>
      <div className="mt-auto mb-auto">{props.children}</div>
    </div>
  );
}
