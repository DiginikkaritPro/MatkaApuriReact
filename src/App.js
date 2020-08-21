import React, { Component } from "react";
import { BrowserRouter as Router, Route} from "react-router-dom";
import "./App.css";
import ErrorPage from './components/errorPage'
import StartPage from './components/startPage'
import SummaryPage from './components/summaryPage'
import QuestionPage from './components/questionPage'

class App extends Component {
  constructor() {
    super()
    this.state = {
      AnnetutVastaukset: []
    }
  }
  
  updateAnnetutVastaukset = (annVas, history) => {
    this.setState({
      AnnetutVastaukset: annVas
    }, () => {
      history.push("/summarypage");
      this.summaryref.getListOfSummaries();
    })
  }

  render() {
    return (
      <div>
        <Router>
          <div>
            <Route exact path="/" component={StartPage}/>
            <Route path="/questionpage" render = {props => (
              <QuestionPage updateAnnetutVastaukset={this.updateAnnetutVastaukset}/>
            )} />
            <Route path="/summarypage" render = {props => (
              <SummaryPage ref={summaryref => {this.summaryref = summaryref}} annetutVastaukset={this.state.AnnetutVastaukset}/>
            )} />
            <Route path="/errorpage" component={ErrorPage} />
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
