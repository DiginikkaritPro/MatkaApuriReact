import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import Header from "./header";
import {GRAPHQL_SERVER_URL, convertQuestionId} from '../functions/DatabaseHandlingFunctions'


class questionPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questionId: 1,
      questionIdLength: 0,
      KysymysTXT: "",
      Vastaukset: [],
      AnnetutVastaukset: [],
    };
  }
  KysymysIDHistoria = []
  componentDidMount() {
    this.getQidLength();

    this.askQuestion(this.state.questionId);
  }
  //Haetaan kysymystaulun pituus stateen
  getQidLength = async () => {
    let response = await fetch(GRAPHQL_SERVER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: `query {
                    kysymys {
                        KysymysID
                    }
                }`,
      }),
    });
    let data = await response.json();
    
    this.setState({
      questionIdLength: data.data.kysymys.length
    })
  }
  //Vastausvaihtoehdon valinta funktio
  buttonClicked = (VastausID, JatkokysymysID) => {
    this.state.AnnetutVastaukset.push(VastausID);
    console.log(this.state.AnnetutVastaukset);
    if (JatkokysymysID) {
          this.askFollowUpQuestion(JatkokysymysID);  
    } else {
      this.setState(
        {
          questionId: this.state.questionId + 1,
        },
        () => {
          this.askQuestion(this.state.questionId);
        }
      );
    }
      
  };
  //Kysymys silmukka jota toistetaan niin kauan kunnes ollaan ajettu kysymysten length loppuun
  askQuestion = async (qId) => {
    while (true) {
      let response = await fetch(GRAPHQL_SERVER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          query: `query getQuestionAndAnswers($id: String!) {
                      kysymysid: kysymysIdEiJatko(KysymysID: $id) {
                          KysymysID
                          KysymysTXT
                          KysymysINFO
                          JatkokysymysID
                      }
                      vastausid(KysymysID: $id) {
                          VastausID
                          VastausTXT
                          KysymysID
                          JatkokysymysID
                      }
                  }`,
          variables: { id: `${qId}` },
        }),
      });

      let data = await response.json();

      if(this.state.questionId >= 2){
        document.getElementById("backbtn").hidden = false
      } else{
        document.getElementById("backbtn").hidden = true
      }

      if (data.data.kysymysid.length === 0) {
        if (this.state.questionId + 1 <= this.state.questionIdLength) {
          this.state.questionId++;
          qId = this.state.questionId;
          // Jatketaan fetchiin.
        } else {
          this.props.updateAnnetutVastaukset(this.state.AnnetutVastaukset, this.props.history);
          return;
        }
        
      } else {
        let question = data.data.kysymysid[0];
        let kysymysTXT = question.KysymysTXT;
        let stateArray = [];

        this.KysymysIDHistoria.push(qId)
        
        for (let i = 0; i < data.data.vastausid.length; i++) {
          let answer = data.data.vastausid[i];
          stateArray.push(answer);
        }

        this.setState({
          KysymysTXT: kysymysTXT,
          Vastaukset: stateArray,
        });
        return;
      }
    }
  };
  //Jatkokysymys funktio jota kutsutaan mikäli vastauksella on jatkokysymysid
  askFollowUpQuestion = async (jatkokysymysId) => {
    let qId = await convertQuestionId(jatkokysymysId);

    let response = await fetch(GRAPHQL_SERVER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: `query getQuestions($id: String!) {
                    kysymysid(KysymysID: $id) {
                        KysymysID
                        KysymysTXT
                        KysymysINFO
                        JatkokysymysID
                    }
                    vastausid(KysymysID: $id) {
                        VastausID
                        VastausTXT
                        KysymysID
                        JatkokysymysID
                    }
                }`,
        variables: { id: `${qId}` },
      }),
    });

    let data = await response.json();


    if (data.data.kysymysid.length === 0) {
      this.props.updateAnnetutVastaukset(this.state.AnnetutVastaukset, this.props.history);
    } else {
      let question = data.data.kysymysid[0];
      let kysymysTXT = question.KysymysTXT;
      let stateArrayJatko = [];
      
      this.KysymysIDHistoria.push(-jatkokysymysId)
      for (let i = 0; i < data.data.vastausid.length; i++) {
        let answer = data.data.vastausid[i];
        stateArrayJatko.push(answer);
      }

      this.setState({
        KysymysTXT: kysymysTXT,
        Vastaukset: stateArrayJatko,
      });
    }
  };
  //Toiminnalisuus funktio "Palaa takaisin" napille
  prevQuestion = () => {
    if(this.KysymysIDHistoria.length === 0){
      alert('Ei kysymyksiä')
      return
    }
    if(this.KysymysIDHistoria.length === 1){
      alert('Ei ole edellistä kysymystä')
      return
    }
    if(this.KysymysIDHistoria.length >= 2){
      this.KysymysIDHistoria.pop()
      var kId = this.KysymysIDHistoria.pop()
      this.state.AnnetutVastaukset.pop()
     
      
      if (kId < 0){
        this.setState({
          questionId: this.state.questionId-1,
          AnnetutVastaukset: this.state.AnnetutVastaukset
        }, () => {
          this.askFollowUpQuestion(-kId)
        }) 
      }
      else{
        this.setState({
          questionId: this.state.questionId-1,
          AnnetutVastaukset: this.state.AnnetutVastaukset
        }, () => {
          this.askQuestion(kId)
        })
      }
    }
    
  }

  handleChange = (e) => {
    e.target.checked = false
  }
  //Reactin render metodi jossa mapataan Vastaukset arraystä vastaukset radionappeihin
  render() {
      let VastausList = () =>
      Array.from(this.state.Vastaukset).map((e, idx) => {
        return <div><div className="radiotest"><input type="radio" name="radioinput" id={idx} className="radiocss" onChange={this.handleChange} onClick={() => {this.buttonClicked(e.VastausID, e.JatkokysymysID)}}/><label for={idx}>{e.VastausTXT}</label></div></div>
      });
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm"></div>
          <div className="col-lg">
            <div className="card">
              <Header />
              <div className="card-body">
                <button id="backbtn" hidden="true" className="btn btn-link" onClick={this.prevQuestion}> {"<- Palaa edelliseen"} </button>
                <br />
                <br />
                <p className="card-text">
                  {this.state.KysymysTXT}
                  <br />
                  <br />
                  {/* radios  */}
                  {VastausList()}
                </p>
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

export default withRouter(questionPage);
