import {env} from 'process'

import {AzureKeyCredential, SearchClient} from '@azure/search-documents'

const blobStorageService = 'fshstorage'
const blobStorageContainer = 'fshcontainer'
const blobStorageEndpoint = `https://${blobStorageService}.blob.core.windows.net/${blobStorageContainer}`

const cognitiveSearchService = 'fshsearchbot'
const cognitiveSearchIndex = 'fshindexbot'
const cognitiveSearchEndpoint = `https://${cognitiveSearchService}.search.windows.net`

const cognitiveSearchCredentials = new AzureKeyCredential(env['SEARCH_API_KEY'])

// To query and manipulate documents
const searchClient = new SearchClient(cognitiveSearchEndpoint,
    cognitiveSearchIndex,
    cognitiveSearchCredentials
)

// Let's get the top 5 jobs related to Microsoft
async function search(query) {
  let searchResults = await searchClient.search(query, {
    orderBy: ['Rating desc'],
    select: ['HotelId', 'HotelName', 'Rating'],
    top: 5
  })
  try {
    for await (const result of searchResults.results) {
      console.log(`${JSON.stringify(result.document)}`)
      // createResult(item)
    }
  } catch (error) {
    throw error
  }
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


