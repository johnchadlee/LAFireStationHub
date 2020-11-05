import {
  AzureKeyCredential, SearchClient, SearchIndexClient, SearchIndexerClient
} from '@azure/search-documents'

const primaryKey = '7A27B85012A2A27B3665541D52E179FF'

const blobStorageService = 'fshstorage'
const blobStorageContainer = 'fshcontainer'
const blobStorageEndpoint = `https://${blobStorageService}.blob.core.windows.net/${blobStorageContainer}`

const cognitiveSearchService = 'fshsearch'
const cognitiveSearchIndex = 'fshindex'
const cognitiveSearchEndpoint = `https://${cognitiveSearchService}.search.windows.net`

// To query and manipulate documents
const searchClient = new SearchClient(cognitiveSearchEndpoint,
    cognitiveSearchIndex,
    new AzureKeyCredential(primaryKey)
)

// To manage indexes and synonymmaps
const indexClient = new SearchIndexClient(cognitiveSearchEndpoint,
    new AzureKeyCredential(primaryKey)
)

// To manage indexers, datasources and skillsets
const indexerClient = new SearchIndexerClient(cognitiveSearchEndpoint,
    new AzureKeyCredential(primaryKey)
)

// Let's get the top 5 jobs related to Microsoft
async function search() {
  const searchResults = await searchClient.search('Microsoft', {top: 5})
  for await (const result of searchResults.results) {
    let doc = result.document
    console.log(doc['content'])
    console.log(`${result.document.business_title}\n${result.document.job_description}\n`)
  }
  try {
    response = await response.json()
    for (let item of response) {
      createResult(item)
    }
  } catch (error) {
    throw error
  }
}

/* -------------------------------------- */

}

function createResult(item) {
  let results = document.querySelector('section.results')
  let div = document.createElement('div')
  let date = document.createElement('cite')
  date.innerText = item['metadata_creation_date']
  let title = document.createElement('header')
  title.innerText = item['metadata_storage_name']
  let anchor = document.createElement('a')
  anchor.href = ''
  let content = document.createElement('p')
  content.innerText = item['content']
  div.append(date, title, content)
  results.append(div)
}

export default handleSearch

