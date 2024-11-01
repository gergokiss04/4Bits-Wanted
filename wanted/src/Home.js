import React, { useEffect } from "react";

export function Home() {
  //Az oldal tetejére ugrik kattintásra:
  useEffect(() => {
    window.scrollTo({
      top: 50,
      behavior: "instant",
    });
  }, []);

  return (
    <div className="p-5 m-auto text-center content bg-lavender img-down">
      <div
        id="aboutus"
        className="container-fluid text-white scrollspy dark-brown-background-color"
      >
        <h1>Főoldal</h1>
        <hr />
        <div className="row mt-3">
        
        </div>
      </div>
    </div>
  );
}

export default Home;