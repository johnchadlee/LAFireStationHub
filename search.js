const blobStorageService = 'fshstorage'
const blobStorageContainer = 'fshcontainer'
const blobStorageEndpoint = `https://${blobStorageService}.blob.core.windows.net/${blobStorageContainer}`

const cognitiveSearchService = 'fshsearchbot'
const cognitiveSearchIndex = 'fshindex'
const cognitiveSearchEndpoint = `https://${cognitiveSearchService}.search.windows.net`
const cognitiveSearchQueryKey = '547AC2CE6DDCA06C68A229F305AE5B76'

/*
 Search Documents (Azure Cognitive Search REST API
 https://docs.microsoft.com/en-us/rest/api/searchservice/search-documents
 */
const search = async (query) => {

  let results = document.querySelector('section.results')
  while (results.hasChildNodes()) {
    results.removeChild(results.firstChild)
  }

  let body = {
    'search': query,
    'top': 3, // 'select':
              // 'content,metadata_storage_name,metadata_storage_path,metadata_storage_last_modified',
    'highlight': 'content-1,metadata_storage_name-1',
    'highlightPreTag': '<strong>',
    'highlightPostTag': '</strong>'
  }

  let options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': cognitiveSearchQueryKey
    },
    body: JSON.stringify(body),
    redirect: 'follow'
  }
  let url = new URL(cognitiveSearchEndpoint)
  url.pathname = `/indexes/${cognitiveSearchIndex}/docs/search`
  url.search = new URLSearchParams({'api-version': '2020-06-30'})
  try {
    let response = await fetch(url.href, options)
    response = await response.json()
    if (response['value'].length === 0) {
      let a = document.createElement('a')
      let header = document.createElement('header')
      header.innerText = 'No results found.'
      a.appendChild(header)
      results.appendChild(a)
    }
    for (const item of response['value']) {
      createResult(item)
    }
  } catch (error) {
    console.error(error)
  }
}

// Let's get the top 5 jobs related to Microsoft

function createResult(item) {
  let results = document.querySelector('section.results')

  /* Format the entry's title */
  let title = document.createElement('header')
  if (item['@search.highlights']['metadata_storage_name']) {
    title.innerHTML = item['@search.highlights']['metadata_storage_name']
  }
  else {
    title.innerHTML = item['metadata_storage_name']
  }

  /* Create an anchor that links to the document */
  let entry = document.createElement('a')
  let encoded = item['metadata_storage_path']
  entry.href = atob(encoded.substring(0, encoded.length - 1))

  /* Format the entry's date */
  if (item['metadata_storage_last_modified']) {
    let moment = new Date(item['metadata_storage_last_modified'])
    let date = document.createElement('cite')
    const formatter = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    date.innerText = formatter.format(moment)
    entry.append(title, date)
  }
  else {
    entry.append(title)
  }
  results.append(entry)
}


