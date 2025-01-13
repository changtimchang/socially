'use client' // 클라이언트 사이드 코드로 실행하도록 지정

import { DataTable } from '@/components/DataTable'
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
    <div className='flex items-center justify-center mt-20'>
      <DataTable />
    </div>
  )
}
