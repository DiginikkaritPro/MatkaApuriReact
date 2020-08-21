import React, { Component } from "react";
import Header from "./header";

class startPage extends Component {
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm"></div>
          <div className="col-lg">
            <div className="card startpage">
              <div className="card-body">
                <Header />
                <p className="card-text textStyleStartPage">
                Tervetuloa Matka-apuriin! 
                <br/><br/>
                Suunnitteletko matkalle lähtemistä? 
                Tämän Matka-apurin avulla voit suunnitella itsellesi
                sopivan kaupunkimatkan. Lopuksi tulostetaan 'Muistilista'.
                <br/><br/>
                Aloita kysely painamalla nappia!
                </p>
                <button className="btn btn-light">
                  <a href="/questionpage">ALOITA KYSELY</a>
                </button>
              </div>{" "}
              {/* card-body */}
            </div>{" "}
            {/* card */}
          </div>{" "}
          {/* col */}
          <div className="col-sm"></div>
        </div>{" "}
        {/* row */}
      </div>
    );
  }
}

export default startPage;
