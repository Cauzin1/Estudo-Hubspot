const axios = require('axios')
const token = 'pat-na1-9951c7b3-a4fe-43d2-81bf-1960076f0e7b'



async function getUsersFakeApi() {
    try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/users')
        return response.data
    } catch (error) {
        console.error(error)
    }
}

async function hubspotFindByIdApi(id){
    try {
        const response = await axios.post(`https://api.hubapi.com/crm/v3/objects/contacts/search`,
        {
          "filterGroups":[
          {
            "filters":[
              {
                "propertyName": "id_api",
                "operator": "EQ",
                "value": id
              }
            ]
          }
        ]   
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
        return response.data
    } catch (error) {
        console.error(error)
    }
}

async function hubspotCreateContact(user){
    const requestData = {
        "properties": {
                "id_api": user.id,
                "firstname": user.name,
                "email": user.email,
                "phone": user.phone
              //aqui é o caso que tem que olhar os campos do hubspot e ver o que é necessário
            }
    }
    //esperar acontecer as outras funções para depois criar o contato
    await axios.post('https://api.hubapi.com/crm/v3/objects/contacts', requestData, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
    }}
    ) 
  
}

async function originMain(){
  const users = await getUsersFakeApi()
  for ( const user of users){
    const verifyContact = await hubspotFindByIdApi(user.id)
    if(verifyContact.results.length > 0){
      
      continue
      //aqui caso já exista ele pula para o próximo
    }
    await hubspotCreateContact(user)
    //console.log("Finalizou a criação do contato no hubspot")
  }
}

async function associarContatoEmpresa(empresaId, contatoId){
  try{
    const response = await axios.put(`https://api.hubapi.com/crm/v4/objects/companies/${empresaId}/associations/contacts/${contatoId}`,
      [
       {
          "associationCategory": "HUBSPOT_DEFINED",
          "associationTypeId": 2,
        }
      ],
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

   console.log("Associou o contato a empresa: ",response.data)
  } catch (error){
    console.error("Ocorreu error ao criar associação: ",error)
  }
}


const empresaId = 19249067582
const contatoId = 101

associarContatoEmpresa(empresaId, contatoId) 

//originMain();