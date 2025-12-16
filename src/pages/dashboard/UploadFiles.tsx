import { useState, useRef } from 'react'
import { Upload, FileSpreadsheet, X, CheckCircle2 } from 'lucide-react'

interface UploadedFile {
  name: string
  size: number
  status: 'uploading' | 'success' | 'error'
}

function UploadFiles() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const droppedFiles = Array.from(e.dataTransfer.files)
    processFiles(droppedFiles)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      processFiles(selectedFiles)
    }
  }

  const processFiles = (selectedFiles: File[]) => {
    const csvFiles = selectedFiles.filter(file => 
      file.name.endsWith('.csv') || file.type === 'text/csv'
    )

    if (csvFiles.length === 0) {
      alert('Por favor selecciona solo archivos CSV')
      return
    }

    const newFiles: UploadedFile[] = csvFiles.map(file => ({
      name: file.name,
      size: file.size,
      status: 'uploading'
    }))

    setFiles(prev => [...prev, ...newFiles])

    // Simular subida
    newFiles.forEach((file, index) => {
      setTimeout(() => {
        setFiles(prev => prev.map(f => 
          f.name === file.name ? { ...f, status: 'success' } : f
        ))
      }, 1000 + index * 500)
    })
  }

  const removeFile = (fileName: string) => {
    setFiles(prev => prev.filter(f => f.name !== fileName))
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Subir Archivos CSV</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        {/* Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all ${
            isDragging 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Arrastra archivos CSV aquí
          </h3>
          <p className="text-gray-500 mb-4">
            o haz clic para seleccionar archivos
          </p>
          <p className="text-sm text-gray-400">
            Formatos soportados: CSV
          </p>
        </div>

        {/* Lista de archivos subidos */}
        {files.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Archivos ({files.length})
            </h3>
            <div className="space-y-3">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <FileSpreadsheet className="w-10 h-10 text-green-600" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {file.status === 'uploading' && (
                      <div className="flex items-center gap-2 text-blue-600">
                        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm">Subiendo...</span>
                      </div>
                    )}
                    
                    {file.status === 'success' && (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="text-sm font-medium">Completado</span>
                      </div>
                    )}

                    <button
                      onClick={() => removeFile(file.name)}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UploadFiles