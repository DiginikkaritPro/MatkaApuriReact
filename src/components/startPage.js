import React, { Component } from "react";
import Header from "./header";
import Footer from './footer';

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
                <div> Tervetuloa Matka-apuriin! &nbsp;&nbsp;
                  <a data-toggle="modal" href="#myModal">
                  <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-info-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M8.93 6.588l-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588z"/>
                    <circle cx="8" cy="4.5" r="1"/>
                  </svg>
                  </a>

                  {/* <!-- Modal --> */}
                    <div className="modal fade" id="myModal" role="dialog">
                      <div className="modal-dialog">
                      
                        {/* <!-- Modal content--> */}
                        <div className="modal-content">
                          <div className="modal-header">
                            <h4 className="modal-title">Demo Matka-apuri sovellus</h4>
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                          </div>
                          <div className="modal-body">
                            <p>Tämä on Pronikkareiden tekemä Matka-apuri sovellus, jonka
                              tarkoituksena on esitellä, millä tavalla (mitä tahansa) "apuri"
                              sovellusta voidaan käyttää.</p>
                              <p>Tässä kyseisessä "apurissa" on aiheena kaupunkimatkailu.</p>
                              <p>Lopuksi tulostetaan yhteenveto.</p>
                          </div>
                          <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal">Sulje</button>
                          </div>
                        </div>
                        
                      </div>
                    </div>

                </div> 
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
                <Footer />
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
