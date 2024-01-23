
Example queries:
`query Product($_id: String!) {
  product(_id: $_id) {
    vintage
  }
}

{
    "_id": "65afa78e6f02c6d10a22cdaa"
}

mutation InsertMultiple($products:[ProductInput!]!) {
  createMultipleProducts(products:$products) {
    _id
		vintage
    name
		producerId
  }
}

{
	"products": [
    {
      "producerId": "65afa1e8d563d66ff2446d7e",
      "name":"WinePro MKII",
      "vintage":"Yes"
    },
    {
      "producerId": "65afa1e8d563d66ff2446d7e",
      "name":"WinePro Extra",
      "vintage":"No"
    }
  ]
}



mutation UpdateOne($product:UpdateProductInput!) {
  updateProduct(product:$product) {
    _id
		vintage
    name
		producerId
  }
}

{"product":{
  "_id": "65b005cbf239838def6cf70a",
  "vintage": "Yes",
  "name": "WinePro MK66",
  "producerId": "65afa1e8d563d66ff2446d7e"
}}


mutation DeleteMultiple($_ids:[String!]!) {
  deleteMultipleProducts(_ids:$_ids)
}

{
  "_ids": ["65b01762d86e46a2f67bd870","65b01762d86e46a2f67bd871"]
}



`
Example data:
`
producers:
[{
  "_id": {
    "$oid": "65afa1e8d563d66ff2446d7e"
  },
  "name": "Pro manufact BT",
  "country": "Hungary",
  "region": "Eastern EU"
}]

products:

`