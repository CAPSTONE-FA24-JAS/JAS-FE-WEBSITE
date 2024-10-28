import React, { ChangeEvent, useEffect, useState } from 'react'
import { Image, message } from 'antd'
import {
  MainDiamond,
  MainShaphy,
  SecondaryDiamond,
  SecondaryShaphy
} from '../../../../../../../../types/Gemstones.type'

interface GemstoneDetailsProps {
  formData: {
    mainDiamonds: MainDiamond[]
    secondaryDiamonds: SecondaryDiamond[]
    mainShaphies: MainShaphy[]
    secondaryShaphies: SecondaryShaphy[]
  }
  gemstoneDataArray: {
    type: 'mainDiamonds' | 'secondaryDiamonds' | 'mainShaphies' | 'secondaryShaphies'
    details: (MainDiamond | SecondaryDiamond | MainShaphy | SecondaryShaphy)[]
  }[]
  handleAddGemstone: (type: 'mainDiamonds' | 'secondaryDiamonds' | 'mainShaphies' | 'secondaryShaphies') => void
  handleGemstoneChange: (
    type: 'mainDiamonds' | 'secondaryDiamonds' | 'mainShaphies' | 'secondaryShaphies',
    index: number,
    field: string,
    value: string
  ) => void
  setGemstoneDataArray: React.Dispatch<React.SetStateAction<any>>
  handleImageChangeGemstone: (
    files: File[],
    key: 'documentDiamonds' | 'imageDiamonds' | 'documentShaphies' | 'imageShaphies',
    index: number,
    gemstoneType: 'mainDiamonds' | 'secondaryDiamonds' | 'mainShaphies' | 'secondaryShaphies'
  ) => void
}

interface ImageFilesUpload {
  [key: string]: {
    [key: string]: {
      [key: number]: File[]
    }
  }
}

const GemstoneDetails: React.FC<GemstoneDetailsProps> = ({
  formData,
  handleGemstoneChange,
  handleImageChangeGemstone,
  handleAddGemstone
}) => {
  const [imageFiles, setImageFiles] = useState<ImageFilesUpload>({})

  const [documentFiles, setDocumentFiles] = useState<ImageFilesUpload>({})

  // Thêm state để theo dõi trạng thái hiển thị của từng loại gemstone
  const [visibleGemstones, setVisibleGemstones] = useState<{
    [key: string]: boolean
  }>({
    mainDiamonds: false,
    secondaryDiamonds: false,
    mainShaphies: false,
    secondaryShaphies: false
  })

  const diamondFields = [
    { label: 'Name', key: 'name', placeholder: 'Enter name' },
    { label: 'Color', key: 'color', placeholder: 'Enter color' },
    { label: 'Cut', key: 'cut', placeholder: 'Enter cut type' },
    { label: 'Quantity', key: 'quantity', placeholder: 'Enter quantity' },
    { label: 'Clarity', key: 'clarity', placeholder: 'Enter clarity' },
    { label: 'Dimensions', key: 'dimension', placeholder: 'Enter dimensions' },
    { label: 'Setting Type', key: 'settingType', placeholder: 'Enter setting type' },
    { label: 'Shape', key: 'shape', placeholder: 'Enter shape' },
    { label: 'Certificate', key: 'certificate', placeholder: 'Enter certificate' },
    { label: 'Fluorescence', key: 'fluorescence', placeholder: 'Enter fluorescence' },
    { label: 'Length/Width Ratio', key: 'lengthWidthRatio', placeholder: 'Enter length/width ratio' }
  ]

  const shaphyFields = [
    { label: 'Name', key: 'name', placeholder: 'Enter name' },
    { label: 'Color', key: 'color', placeholder: 'Enter color' },
    { label: 'Carat', key: 'carat', placeholder: 'Enter carat' },
    { label: 'Quantity', key: 'quantity', placeholder: 'Enter quantity' },
    { label: 'Enhancement Type', key: 'enhancementType', placeholder: 'Enter enhancement type' },
    { label: 'Setting Type', key: 'settingType', placeholder: 'Enter setting type' },
    { label: 'Dimensions', key: 'dimension', placeholder: 'Enter dimensions' }
  ]

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number,
    type: 'mainDiamonds' | 'secondaryDiamonds' | 'mainShaphies' | 'secondaryShaphies',
    key: 'documentDiamonds' | 'imageDiamonds' | 'documentShaphies' | 'imageShaphies'
  ) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      const isImage = key === 'imageDiamonds' || key === 'imageShaphies'

      if (isImage) {
        setImageFiles((prev) => {
          const updatedFiles = { ...prev }
          updatedFiles[type] = updatedFiles[type] || { imageDiamonds: {}, imageShaphies: {} }
          updatedFiles[type][key] = updatedFiles[type][key] || {}
          updatedFiles[type][key][index] = [...(updatedFiles[type][key][index] || []), ...filesArray].slice(0, 5)
          return updatedFiles
        })
      } else {
        setDocumentFiles((prev) => {
          const updatedDocs = { ...prev }
          updatedDocs[type] = updatedDocs[type] || { documentDiamonds: {}, documentShaphies: {} }
          updatedDocs[type][key] = updatedDocs[type][key] || {}
          updatedDocs[type][key][index] = [...(updatedDocs[type][key][index] || []), ...filesArray].slice(0, 5)
          return updatedDocs
        })
      }
      handleImageChangeGemstone(filesArray, key, index, type)
    }
  }

  const renderImageUploadSection = (
    index: number,
    type: 'mainDiamonds' | 'secondaryDiamonds' | 'mainShaphies' | 'secondaryShaphies',
    key: 'imageDiamonds' | 'imageShaphies'
  ) => {
    const images = imageFiles[type]?.[key]?.[index] || []

    return (
      <div>
        <label className='block font-extrabold text-red-500 mb-2'>Upload Images</label>
        <div className='grid grid-cols-4 gap-4 items-center'>
          {images.length > 0 && (
            <div className='mb-4 col-span-4'>
              <div className='grid grid-cols-4 gap-4'>
                {images.map((file, fileIndex) => (
                  <Image
                    key={fileIndex}
                    src={URL.createObjectURL(file)}
                    alt={`Uploaded image ${fileIndex + 1}`}
                    className='object-cover rounded-lg h-30 w-20 mb-2'
                  />
                ))}
              </div>
            </div>
          )}

          <button
            type='button'
            className='p-2 text-sm font-bold text-gray-600 rounded-lg hover:text-blue-600 bg-slate-400'
            onClick={() => document.getElementById(`${type}-${key}-upload-${index}`)?.click()}
          >
            Upload Images
          </button>
          <input
            type='file'
            id={`${type}-${key}-upload-${index}`}
            accept='image/*'
            multiple
            style={{ display: 'none' }}
            onChange={(e) => handleFileChange(e, index, type, key)}
          />
        </div>
      </div>
    )
  }

  const renderDocumentUploadSection = (
    index: number,
    type: 'mainDiamonds' | 'secondaryDiamonds' | 'mainShaphies' | 'secondaryShaphies',
    key: 'documentDiamonds' | 'documentShaphies'
  ) => {
    const documents = documentFiles[type]?.[key]?.[index] || []

    return (
      <div>
        <label className='block font-extrabold text-red-500 mb-2'>Upload Documents</label>
        <div className='grid grid-cols-4 gap-4 items-center'>
          {documents.length > 0 && (
            <div className='mb-4 col-span-4'>
              {documents.map((file, fileIndex) => (
                <div key={fileIndex} className='text-gray-700'>
                  {file.name}
                </div>
              ))}
            </div>
          )}
          <button
            type='button'
            className='p-2 text-sm font-bold text-gray-600 rounded-lg hover:text-blue-600 bg-slate-400'
            onClick={() => document.getElementById(`${type}-${key}-doc-upload-${index}`)?.click()}
          >
            Upload Documents
          </button>
          <input
            type='file'
            id={`${type}-${key}-doc-upload-${index}`}
            accept='.pdf,.doc,.docx'
            multiple
            style={{ display: 'none' }}
            onChange={(e) => handleFileChange(e, index, type, key)}
          />
        </div>
      </div>
    )
  }

  const renderGemstoneFields = (
    data: (MainDiamond | SecondaryDiamond | MainShaphy | SecondaryShaphy)[],
    type: 'mainDiamonds' | 'secondaryDiamonds' | 'mainShaphies' | 'secondaryShaphies'
  ) => {
    const isDiamondType = type === 'mainDiamonds' || type === 'secondaryDiamonds'
    const fields = isDiamondType ? diamondFields : shaphyFields

    return data.map((detail, index) => {
      return (
        <div key={index} className='border p-4 mb-4 rounded'>
          <h4 className='text-lg font-semibold '>{`${index + 1}`}</h4>
          <div className='grid grid-cols-2 gap-4'>
            {fields.map(({ label, key, placeholder }) => (
              <div key={key}>
                <label className='block font-medium mb-1'>{label}</label>
                <input
                  type='text'
                  value={(detail as any)[key] || ''}
                  placeholder={placeholder}
                  onChange={(e) => {
                    handleGemstoneChange(type, index, key as keyof typeof detail, e.target.value)
                  }}
                  className='w-full border border-gray-300 p-2 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 custom-input-placeholder'
                />
              </div>
            ))}
          </div>

          {renderImageUploadSection(index, type, 'imageDiamonds')}
          {renderDocumentUploadSection(index, type, 'documentDiamonds')}
        </div>
      )
    })
  }

  const renderGemstoneSection = (
    gemstoneType: 'mainDiamonds' | 'secondaryDiamonds' | 'mainShaphies' | 'secondaryShaphies',
    label: string
  ) => {
    const gemstoneDetails =
      gemstoneType === 'mainDiamonds'
        ? formData.mainDiamonds
        : gemstoneType === 'secondaryDiamonds'
        ? formData.secondaryDiamonds
        : gemstoneType === 'mainShaphies'
        ? formData.mainShaphies
        : formData.secondaryShaphies

    return (
      <div className='mb-6'>
        <div className='flex justify-between items-center mb-4'>
          <p className='text-xl font-bold text-red-500'>{label}</p>
          {!visibleGemstones[gemstoneType] ? (
            <button
              onClick={() => {
                if (gemstoneDetails.length === 0) {
                  handleAddGemstone(gemstoneType)
                }
                setVisibleGemstones((prev) => ({ ...prev, [gemstoneType]: true }))
              }}
              className='p-2 text-sm font-bold text-gray-600 rounded-lg hover:text-blue-600 bg-slate-400'
            >
              {`Add ${label}`}
            </button>
          ) : null}
        </div>
        {visibleGemstones[gemstoneType] && (
          <>
            {renderGemstoneFields(gemstoneDetails, gemstoneType)}
            <div className='flex justify-end'>
              <button
                onClick={() => handleAddGemstone(gemstoneType)}
                className='p-2 text-sm font-bold text-gray-600 rounded-lg hover:text-blue-600 bg-slate-400'
              >
                {`Add ${label}`}
              </button>
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div className='p-4'>
      {renderGemstoneSection('mainDiamonds', 'Main Diamonds')}
      {renderGemstoneSection('secondaryDiamonds', 'Secondary Diamonds')}
      {renderGemstoneSection('mainShaphies', 'Main Sapphires')}
      {renderGemstoneSection('secondaryShaphies', 'Secondary Sapphires')}
    </div>
  )
}

export default GemstoneDetails
