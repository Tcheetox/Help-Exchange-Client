import React, { useState, useContext, useEffect } from 'react'

import { AppContext } from '../../AppContext'
import Item from './Item'
import { InputForm } from '../common/'

export default function SmartFaq() {
  const { fetchRequest } = useContext(AppContext)
  const [searchField, setSearchField] = useState('')
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])

  // Trigger initial fetch
  useEffect(() => {
    fetchRequest(
      'GET',
      null,
      'faq',
      (r, pR) => {
        if (r.status === 200) {
          setData(pR)
          setFilteredData(pR)
        }
      },
      false
    )
  }, [fetchRequest])

  function search(data, properties, searchString) {
    return data
      .filter(obj => {
        if (!obj) return false // Safety check for null objects

        // Convert object properties to lowercase for case-insensitive search
        const objValues = properties.map(prop => {
          if (!obj[prop]) return '' // Safety check for null properties
          return obj[prop].toString().toLowerCase()
        })
        const searchTerm = searchString.toLowerCase()

        // Check if any object property contains the search string
        return objValues.some(value => value.includes(searchTerm))
      })
      .sort((a, b) => {
        // Sort by the best match
        const aMatchCount = properties.reduce((count, prop) => {
          if (a[prop] && a[prop].toString().toLowerCase().includes(searchString.toLowerCase())) {
            count++
          }
          return count
        }, 0)
        const bMatchCount = properties.reduce((count, prop) => {
          if (b[prop] && b[prop].toString().toLowerCase().includes(searchString.toLowerCase())) {
            count++
          }
          return count
        }, 0)

        // Sort by the number of matched properties
        if (aMatchCount > bMatchCount) {
          return -1
        } else if (aMatchCount < bMatchCount) {
          return 1
        } else {
          // If match count is the same, sort alphabetically by a specific property
          return a[properties[0]].localeCompare(b[properties[0]])
        }
      })
  }

  const handleSearch = e => {
    if (e.target.value !== '') setFilteredData(() => search(data, ['question', 'response', 'keywords'], e.target.value))
    else setFilteredData(data)
    setSearchField(e.target.value)
  }

  return (
    <div className='faq'>
      <h1>FAQ</h1>
      <InputForm
        name='searchField'
        placeholder='Search for frequently asked questions by theme, keywords, etc.'
        value={searchField}
        onChange={handleSearch}
      />
      {filteredData.map((q, i) => (
        <Item key={i} question={q.question} response={q.response} />
      ))}
    </div>
  )
}
