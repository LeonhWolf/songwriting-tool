import React from "react";
import "./Authentication.scss";

interface IProps {
  title: string;
  subtitle: string;
  children: React.ReactElement;
}

export default function AuthenticationTemplate(props: IProps) {
  return (
    <div className="h-100 w-100 d-flex flex-column align-items-center pt-4">
      <h2>{props.title}</h2>
      <p className="text-muted mb-5">{props.subtitle}</p>
      <div id="content-wrapper" className="mt-auto mb-auto">
        {props.children}
      </div>
    </div>
  );
}
