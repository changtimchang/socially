import React from 'react'
import ThreeViewer from '@/components/ThreeViewer'
import Home from '@/components/Home'

const ViewerPage: React.FC = () => {
  return (
    <div className='min-h-screen bg-gray-100 py-12 px-4'>
      <div className='max-w-7xl mx-auto'>
        <h1 className='text-3xl font-bold text-gray-900 mb-8'>3D Viewer</h1>
        <div className='bg-white rounded-lg shadow-lg p-6'>
          <ThreeViewer
            width={1000}
            height={600}
            stlUrl='/stl-files/3.stl' // public 폴더 내의 STL 파일 경로
          />
          <Home />
        </div>
      </div>
    </div>
  )
}

export default ViewerPage
