async function handleSearch(query) {
  let myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')
  myHeaders.append('api-key', '6EF7B15EC90CFD0667A7C5F4B92C46A4')
  const blobStorageService = 'splaytree'
  const blobStorageContainer = 'container'
  const blobStorage = new URL(`https://${blobStorageService}.blob.core.windows.net`)
  blobStorage.pathname = `/${blobStorageContainer}`
  const cognitiveSearchService = 'lafirestationhub'
  const endpoint = new URL(`https://${cognitiveSearchService}.search.windows.net`)
  endpoint.pathName = `/indexes/azureblob-index/docs`
  endpoint.search = new URLSearchParams({
    'api-version': '2020-06-30',
    '$top': 5,
    'search': query
  })
  try {
    let response = await fetch(endpoint.href)
    response = await response.json()
    for (let item of response) {
      createResult(item)
    }
  }
  catch (error) {
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
  div.append(date,title,content)
  results.append(div)
}

export default handleSearch

