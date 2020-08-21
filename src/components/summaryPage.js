import React, { Component } from "react";
import Header from "./header";
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

  getListOfSummaries = async () => {
    let vastausId = this.props.annetutVastaukset;

    for (let i = 0; i < vastausId.length; i++) {
      let id = vastausId[i];
      await this.getSummary(id);
    }
  };

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

    if (data.data == null || data.data.yhteenvetostack.length === 0) {
      //TODO: virheen tarkistus
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

      console.log(this.state.Otsikko);
      console.log(this.state.InfoTXT);
      console.log(this.state.Linkki);
    }
  };

  render() {
    let Yhteenveto = () =>
      Array.from(this.state.Otsikko).map((e, idx) => {
        return (
          <div className="card-body">
          {e}
          <p className="card-text"></p>
          {this.state.InfoTXT[idx]}
          {this.state.Linkki[idx]}
          </div>
        )}
          
        );
     
    return (
      <div>
            <div className="container">
              <div className="row">
                <div className="col-sm"></div>
                <div className="col-lg">
                  <div className="card">
                  <Header />
                  {Yhteenveto()}
                    {/* card-body */}
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
