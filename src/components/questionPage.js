import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import Header from "./header";
import {GRAPHQL_SERVER_URL, convertQuestionId} from '../functions/DatabaseHandlingFunctions'


class questionPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questionId: 1,
      KysymysTXT: "",
      Vastaukset: [],
      AnnetutVastaukset: [],
    };
  }
  KysymysIDHistoria = []
  componentDidMount() {
    this.askQuestion(this.state.questionId);
  }

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

  askQuestion = async (qId) => {
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

    if (data.data.kysymysid.length === 0) {
      this.props.updateAnnetutVastaukset(this.state.AnnetutVastaukset, this.props.history);
    } else {
      let question = data.data.kysymysid[0];
      let kysymysTXT = question.KysymysTXT;
      let stateArray = [];

      this.KysymysIDHistoria.push(qId)
      console.log('KysymysIDHistoria:' + this.KysymysIDHistoria)
      for (let i = 0; i < data.data.vastausid.length; i++) {
        let answer = data.data.vastausid[i];
        stateArray.push(answer);
      }

      this.setState({
        KysymysTXT: kysymysTXT,
        Vastaukset: stateArray,
      });
    }
  };

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
  //TÄSSÄ FUNKTIOSSA JEKUTETAAN MEIDÄN FUNKTIOITA RÄH RÄH XDDDD
  prevQuestion = () => {
    if(this.KysymysIDHistoria.length === 0){
      console.log('Ei kysymyksiä')
      return
    }
    if(this.KysymysIDHistoria.length === 1){
      console.log('Ei ole edellistä kysymystä')
      return
    }
    if(this.KysymysIDHistoria.length >= 2){
      this.KysymysIDHistoria.pop()
      var kId = this.KysymysIDHistoria.pop()
      //this.state.AnnetutVastaukset.pop()
      this.state.AnnetutVastaukset.pop()
      console.log('Mennään historiaan ' + kId)
      //HÄHÄÄ JEKKU XD
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

  render() {
      let VastausList = () =>
      Array.from(this.state.Vastaukset).map((e, idx) => {
        return <div><div className="custom-control custom-radio"><input type="radio" name="radioinput" id={idx} className="custom-control-input" onChange={this.handleChange} onClick={() => {this.buttonClicked(e.VastausID, e.JatkokysymysID)}}/><label className="custom-control-label" for={idx}>{e.VastausTXT}</label></div></div>
      });
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm"></div>
          <div className="col-lg">
            <div className="card">
              <Header />
              <div className="card-body">
                {/* <a className="linkQuestionPage" hidden={false} onClick={this.prevQuestion}>
                  TAKAISIN EDELLISEEN
                </a> */}
                <button onClick={this.prevQuestion}> GO BACK </button>
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
