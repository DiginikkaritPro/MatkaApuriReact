import { GRAPHQL_SERVER_URL } from "./DatabaseHandlingFunctions";

//Tällä haetaan viimeinen kysymysid parsetaan se int muotoon ja käsitellään
let getLastQuestionId = async () => {
  let res = await fetch(GRAPHQL_SERVER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: `query getLastQID{
          kysymyslastid {
            KysymysID
          }
        }`,
    }),
  });

  let data = await res.json();
  console.log("Viimeinen KysymysID: " + data.data.kysymyslastid[0].KysymysID);
  let parseData = parseInt(data.data.kysymyslastid[0].KysymysID) + 1;
  console.log("Muokattu KysymysID: " + parseData);
};

//Tällä haetaan viimeinen vastausid, parsetaan se int muotoon ja käsitellään
let getLastAnswerId = async () => {
  let res = await fetch(GRAPHQL_SERVER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: `query getLastAID{
            vastauslastid {
              VastausID
            }
          }`,
    }),
  });

  let data = await res.json();
  console.log("Viimeinen VastausID: " + data.data.vastauslastid[0].VastausID);
  let parseData = parseInt(data.data.vastauslastid[0].VastausID) + 1;
  console.log("Muokattu VastausID: " + parseData);
};

//Tällä haetaan viimeinen jatkokysymysid ja kysymys parsetaan ne int muotoon ja käsitellään
//Miten tuodaan jatkokysymystä varten uudet vastausidt mikäli kysymykselläkin on useampi vastausid, muuttuja? esim. n+1
let getLastFollowUpQuestionId = async () => {
  let res = await fetch(GRAPHQL_SERVER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: `query getLastFUQID {
            jatkokysymyslastid {
            KysymysID
            JatkokysymysID
            }
            vastauslastid {
            VastausID
            }
          }`,
    }),
  });

  let data = await res.json();
  console.log(
    "Viimeinen JatkokysymysID: " +
      data.data.jatkokysymyslastid[0].JatkokysymysID
  );
  console.log(
    "Viimeinen KysymysID: " + data.data.jatkokysymyslastid[0].KysymysID
  );
  console.log(
    "Viimeinen VastausID: " + data.data.vastauslastid[0].VastausID
  );
  let n = 1;
  let parseData1 = parseInt(data.data.jatkokysymyslastid[0].JatkokysymysID) + 1;
  let parseData2 = parseInt(data.data.jatkokysymyslastid[0].KysymysID) + n + 1;
  let parseData3 = parseInt(data.data.vastauslastid[0].VastausID) + n + 1;

  console.log(
    "Muokattu JatkokysymysID: " +
      parseData1 +
    "\nMuokattu KysymysID jatkokysymystä varten: " +
      parseData2 +
    "\nMuokattu VastausID jatkokysymystä varten: " +
      parseData3
  );
};

let insertNewQuestion = async () => {
    
    let res = await fetch(GRAPHQL_SERVER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: `mutation insertQuestion($kid: String!, $kys: String!, $info: String){
            luokysymys(KysymysID: $kid, KysymysTXT: $kys, KysymysINFO: $info) {
                KysymysID
                KysymysTXT
                KysymysINFO
            }
          }`,
          variables: { kid: "9", kys: "Toimiko kysymysInsert?", info: "Toivottavasti toimi" }
      }),
      
    });
    let data = await res.json()
    console.log(data)
    
  };

export { getLastQuestionId, getLastAnswerId, getLastFollowUpQuestionId, insertNewQuestion};
