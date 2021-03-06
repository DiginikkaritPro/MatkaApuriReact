//Api rajapinnan URL täytyy olla kyseisen koneen local ipv4 osoite
const GRAPHQL_SERVER_URL = 'http://10.78.161.237:3000/api/graphql';


//JatkokysymysIDn muunto kysymysidksi
let convertQuestionId = async (jatkokysymysId) => {
    let response = await fetch(GRAPHQL_SERVER_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query: 
                `query getSomething($id: String!) {
                    jatkokysymysid(JatkokysymysID: $id) {
                        KysymysID
                    }
                }`,
            variables: { id: `${jatkokysymysId}` }
        })
    });

    let data = await response.json();
    if (data.data == null || data.data.jatkokysymysid.length === 0) 
    {
        return -1;
    }
    else
    {
        return data.data.jatkokysymysid[0].KysymysID;
    }
}

export {getSummaryId, convertQuestionId, GRAPHQL_SERVER_URL}