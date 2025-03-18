import notFoundImg from "../assets/404/404.jpg";

const NotFound404 = () => {
  return <div style={{ backgroundImage: URL({ notFoundImg }) }}></div>;
};

export default NotFound404;
