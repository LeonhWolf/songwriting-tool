import { RouterProvider } from "react-router-dom";
import { connect, ConnectedProps } from "react-redux";

import "./styles/bootstrap.scss";
import { router } from "./navigation/router";
import { RootState } from "./redux/store";
import Toast from "./components/Toast";

const mapStateToProps = (state: RootState) => ({
  toasts: state.toasts,
});

const connector = connect(mapStateToProps, null);
type PropsFromRedux = ConnectedProps<typeof connector>;

function App(props: PropsFromRedux) {
  return (
    <>
      <div id="all-toasts" className="position-absolute top-0 end-0 m-3">
        {props.toasts.map((toast) => (
          <div key={toast.id} className="toast-wrapper mb-2">
            <Toast
              id={toast.id}
              bodyText={toast.bodyText}
              severity={toast.severity}
            />
          </div>
        ))}
      </div>
      <RouterProvider router={router} />
    </>
  );
}

export default connector(App);
