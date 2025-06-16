import { useMemo } from 'react'

import './App.css'
import generateUserData from './utils/generateData'
import DataTable from './DataTable'



function App() {
 const data = useMemo(() => generateUserData(500), [])

 console.log({data})
  return (
<DataTable data={data} />
  )
}

export default App
