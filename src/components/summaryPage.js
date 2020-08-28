import React, { Component } from "react";
import Header from "./header";
import Footer from './footer';

import {
  getSummaryId,
  GRAPHQL_SERVER_URL,
} from "../functions/DatabaseHandlingFunctions";

class summaryPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Otsikko: [],
      InfoTXT: [],
      Linkki: [],
      
    };
  }
  componentWillMount() {
    this.getListOfSummaries();
  }
  //Haetaan vastausidt yhteenvetoa varten (tuotu parsettuna URL locationa)
  getListOfSummaries = async () => {
    const parsedUrl = new URL(window.location.href);
    const vastausId = parsedUrl.search.replace('?', '').split('+');

    for (let i = 0; i < vastausId.length; i++) {
      let id = vastausId[i];
      
      await this.getSummary(id);
    }
    
  };

  headerClicked = (idx) =>{
    let id = `hideableElement${idx}`;
    
    if (document.getElementById(id).hidden) {
      document.getElementById(id).hidden = false;
      
    } else {
      document.getElementById(id).hidden = true;
      
    }
  }

  hideOrShowArrow = (idx) => {
    let id = `hideableElement${idx}`;
    const icon1 = document.getElementById('icon1_' + idx);
    const icon2 = document.getElementById('icon2_' + idx);

    if (icon1.style.visibility === 'hidden') {
      icon1.style.visibility = 'visible';
      icon2.style.visibility = 'hidden';
    } else {
      icon1.style.visibility = 'hidden';
      icon2.style.visibility = 'visible';
    }

    if (document.getElementById(id).hidden) {
      document.getElementById(id).hidden = false;
      
    } else {
      document.getElementById(id).hidden = true;
      
    }
  }

  //Tulostetaan yhteenveto hakemalla yhteenvetoidt getSummaryId funktiolla
  getSummary = async (vastausId) => {
    let yhteenvetoId = await getSummaryId(vastausId);

    let response = await fetch(GRAPHQL_SERVER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: `query getSummary($id: String!) {
                    yhteenvetostack(YhteenvetoID: $id) {
                        Otsikko
                        Linkki
                        InfoTXT
                    }
                }`,
        variables: { id: `${yhteenvetoId}` },
      }),
    });

    let data = await response.json();

    //Mahdollinen errorcheck sitä varten jos yhteenvetoa ei ole?
    if (data.data == null || data.data.yhteenvetostack == null || data.data.yhteenvetostack.length === 0) {
      alert('Tietokanta viallinen tai tietokantayhteys katkennut')
    
    } else {
      let Otsikko = "";
      let InfoTXT = "";
      let Linkki = "";

      for (let i = 0; i < data.data.yhteenvetostack.length; i++) {
        let summary = data.data.yhteenvetostack[i];
        if (summary.Otsikko) {
          Otsikko = summary.Otsikko;
        }
        if (summary.InfoTXT) {
          InfoTXT = summary.InfoTXT;
        }
        if (summary.Linkki) {
          Linkki = summary.Linkki;
        }
      }
      this.setState((prevState) => ({
        Otsikko: [...prevState.Otsikko, Otsikko],
        InfoTXT: [...prevState.InfoTXT, InfoTXT],
        Linkki: [...prevState.Linkki, Linkki],
      }));
    }
  };
  //Reactin render metodi jossa tulosteen yhteenveto elementit mapattynä Otsikon indexin perusteella
  render() {
    let Yhteenveto = () =>
      Array.from(this.state.Otsikko).map((e, idx) => {
        if (e === ""){
          return <div></div>
        }
        else{
          var Linkit = this.state.Linkki[idx]
          var LinkkiArray = Linkit.split(/,/)
          let LinkitArr = []
          
          
          LinkkiArray.forEach(element => {
          LinkitArr.push(<p><a className="summaryLink" rel="noopener noreferrer" target="_blank" href={element}>
            {element}
          </a></p>)
          });
        return (
          <div className="card-body elementBorder" >
          <div className="summaryHeader" onClick={() => {this.hideOrShowArrow(idx)}}>
          {e}&nbsp;&nbsp; 
          <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-chevron-up" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <g id={'icon1_' + idx} visibility='visible'>
              <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
              <path fillRule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z"/>
            </g>
            <g id={'icon2_' + idx} visibility='hidden'>
              <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
              <path fillRule="evenodd" d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z"/>
            </g>
          </svg>
          </div>
          <br/>
          <p className="card-text" hidden={true} id={`hideableElement${idx}`}>
          <div className="summaryInfoTxt">
          {this.state.InfoTXT[idx]}
          </div>
          <br/>
          {LinkitArr}
          </p>
          </div>
        )}
      }  
        );
     
    return (
      <div>
            <div className="container">
              <div className="row">
                <div className="col-sm"></div>
                <div className="col-lg">
                  <div className="card">
                  <Header />
                  <h2>Muistilista:</h2>
                  {Yhteenveto()}
                    {/* card-body */}
                  <div className="muistilista">
                  <p>Tästä linkistä saat muistilistasi talteen:</p>
                  <a rel="noopener noreferrer" target="_blank" className="muistilistalink" href={window.location.href}>{window.location.href}</a> 
                  </div>
                  <Footer />
                  
                  </div>
                  {/* card */}
                </div>
                {/* col */}
                <div className="col-sm"></div>
              </div>
              {/* row */}

            </div>
      </div>
      
    );
  }
}

export default summaryPage
