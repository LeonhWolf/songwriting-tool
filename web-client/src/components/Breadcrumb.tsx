import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Breadcrumb = () => {
  const location = useLocation();

  useEffect(() => {
    console.log(location.pathname);
  }, []);

  return (
    <nav>
      <ol className="breadcrumb">
        <li className="breadcrumb-item active"></li>
      </ol>
    </nav>
  );
};

export default Breadcrumb;
