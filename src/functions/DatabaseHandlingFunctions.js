const GRAPHQL_SERVER_URL = 'http://localhost:3000/api/graphql';
let getSummaryId = async (vastausId) => {
    let response = await fetch(GRAPHQL_SERVER_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query: 
                `query getSummaryId($id: String!) {
                    yhteenvetoid(VastausID: $id) {
                        YhteenvetoID
                    }
                }`,
            variables: { id: `${vastausId}` }
        })
    });

    let data = await response.json();
    if (data.data == null || data.data.yhteenvetoid.length === 0) 
    {
        return -1;
    }
    else
    {
        return data.data.yhteenvetoid[0].YhteenvetoID;
    }
}


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