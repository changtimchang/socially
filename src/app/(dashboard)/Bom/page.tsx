'use client' // 클라이언트 사이드 코드로 실행하도록 지정

import { DataTable } from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SearchIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

interface BomData {
  id: number
  단위블록: string
  소조명: string
  부재명: string
  P: number
  S: number
  재질: string
  중량: number
  두께: number
  송선: string
  가공계열: string
}

export default function Home() {
  const [data, setData] = useState<BomData[]>([])
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState<number>(0) // 전체 데이터 개수
  const [totalPages, setTotalPages] = useState<number>(0) // 전체 페이지 수
  const [currentPage, setCurrentPage] = useState<number>(1) // 현재 페이지

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/bom?page=${currentPage}`)

        // 응답이 성공적인지 확인
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()

        if (!result.data || result.data.length === 0) {
          setError('No data found')
          return
        }

        setData(result.data)
        setTotalCount(result.totalCount)
        setTotalPages(result.totalPages)
      } catch (error) {
        console.error('Fetch error:', error)
        setError('Failed to load data')
      }
    }

    fetchData()
  }, [currentPage])

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    
    <div>
      <DataTable />
      
      {/* <h1>BOM 데이터</h1>
      {error ? (
        <p>{error}</p>
      ) : (
        <>
          <table cellPadding='10'>
            <thead>
              <tr>
                <th>ID</th>
                <th>단위블록</th>
                <th>소조명</th>
                <th>부재명명</th>
                <th>P</th>
                <th>S</th>
                <th>재질</th>
                <th>중량</th>
                <th>두께</th>
                <th>송선</th>
                <th>가공계열</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.단위블록}</td>
                  <td>{row.소조명}</td>
                  <td>{row.부재명}</td>
                  <td>{row.P}</td>
                  <td>{row.S}</td>
                  <td>{row.재질}</td>
                  <td>{row.중량}</td>
                  <td>{row.두께}</td>
                  <td>{row.송선}</td>
                  <td>{row.가공계열}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className='my-4'>
            <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
              Previous
            </Button>
            <span className='mx-6'>{` Page ${currentPage} of ${totalPages} `}</span>
            <Button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </>
      )} */}
    </div>
  )
}
