import React from "react";
import * as LottiePlayer from "@lottiefiles/lottie-player";
import "./Error404.css";

const Error404 = () => {
  return (
    <section className="error">
      <h2>Error 404</h2>
      <lottie-player
        autoplay
        loop
        speed="2"
        mode="normal"
        src="https://assets8.lottiefiles.com/packages/lf20_ndlvehgz.json"
        style={{ maxWidth: "800px", margin: "0 auto" }}
      ></lottie-player>
    </section>
  );
};

export default Error404;
