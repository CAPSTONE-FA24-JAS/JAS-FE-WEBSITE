import React, { useEffect, useState } from 'react'
import { Button, Steps, message } from 'antd'
import BasicInfoStep from './StepCreateFinal/BasicInfo'
import FinalStepsStep from './StepCreateFinal/FinalInfo'
import { useCreateFinalValuationMutation } from '../../../../../../../services/createfinalvaluation.services'
import { useParams } from 'react-router-dom'
import {
  MainDiamond,
  MainShaphy,
  SecondaryDiamond,
  SecondaryShaphy,
  ValuationGemstoneData
} from '../../../../../../../types/Gemstones.type'
import GemstoneDetails from './StepCreateFinal/Gemstone'

const { Step } = Steps

// Định nghĩa kiểu cho imageFiles
interface ImageFiles {
  [gemstoneType: string]: {
    [key in 'documentDiamonds' | 'imageDiamonds' | 'imageShaphies' | 'documentShaphies']?: {
      [index: number]: File[]
    }
  }
}

export default function CreateFinalValuation() {
  const { id } = useParams<{ id: string }>() // Lấy ID từ URL
  const [selectedImages, setSelectedImages] = useState<File[]>([])

  const [imageFiles, setImageFiles] = useState<ImageFiles>({})
  const [documentFiles, setDocumentFiles] = useState<ImageFiles>({})

  const [formData, setFormData] = useState<ValuationGemstoneData>({
    name: '',
    categoryId: 0,
    artistId: 0,
    forGender: '',
    videoLink: '',
    estimatePriceMin: 0,
    estimatePriceMax: 0,
    specificPrice: 0,
    imageJewelries: [],
    keyCharacteristicDetails: [],
    mainDiamonds: [],
    secondaryDiamonds: [],
    mainShaphies: [],
    secondaryShaphies: [],
    valuationId: id || ''
  })

  const [gemstoneDataArray, setGemstoneDataArray] = useState<
    {
      type: 'mainDiamonds' | 'secondaryDiamonds' | 'mainShaphies' | 'secondaryShaphies'
      details: (MainDiamond | SecondaryDiamond | MainShaphy | SecondaryShaphy)[]
    }[]
  >([
    {
      type: 'mainDiamonds',
      details: [
        {
          id: 0,
          name: '',
          color: '',
          cut: '',
          clarity: '',
          quantity: 0,
          settingType: '',
          dimension: '',
          shape: '',
          certificate: '',
          fluorescence: '',
          lengthWidthRatio: '',
          type: '',
          jewelryId: 0,
          documentDiamonds: [],
          imageDiamonds: []
        }
      ]
    },
    {
      type: 'secondaryDiamonds',
      details: [
        {
          id: 0,
          name: '',
          color: '',
          cut: '',
          clarity: '',
          quantity: 0,
          settingType: '',
          dimension: '',
          shape: '',
          certificate: '',
          fluorescence: '',
          lengthWidthRatio: '',
          type: '',
          jewelryId: 0,
          documentDiamonds: [],
          imageDiamonds: []
        }
      ]
    },
    {
      type: 'mainShaphies',
      details: [
        {
          id: 0,
          name: '',
          color: '',
          carat: '',
          enhancementType: '',
          quantity: 0,
          settingType: '',
          dimension: '',
          jewelryId: 0,
          documentShaphies: [],
          imageShaphies: []
        }
      ]
    },
    {
      type: 'secondaryShaphies',
      details: [
        {
          id: 0,
          name: '',
          color: '',
          carat: '',
          enhancementType: '',
          quantity: 0,
          settingType: '',
          dimension: '',
          jewelryId: 0,
          documentShaphies: [],
          imageShaphies: []
        }
      ]
    }
  ])

  const [currentStep, setCurrentStep] = useState(0)
  const [createFinalValuation] = useCreateFinalValuationMutation()

  useEffect(() => {
    const updatedGemstoneDataArray = gemstoneDataArray.map((gem) => {
      if (gem.type === 'mainDiamonds' || gem.type === 'secondaryDiamonds') {
        return {
          ...gem,
          details: gem.details.map((detail, index) => ({
            ...detail,
            imageDiamonds: (imageFiles[gem.type]?.['imageDiamonds']?.[index] || []).map((file: File) => ({
              imageLink: file.name,
              diamondId: detail.id
            })),
            documentDiamonds: (documentFiles[gem.type]?.['documentDiamonds']?.[index] || []).map((file: File) => ({
              documentLink: file.name,
              diamondId: detail.id,
              documentTitle: 'Some Title'
            }))
          }))
        }
      } else if (gem.type === 'mainShaphies' || gem.type === 'secondaryShaphies') {
        return {
          ...gem,
          details: gem.details.map((detail, index) => ({
            ...detail,
            imageShaphies: (imageFiles[gem.type]?.['imageShaphies']?.[index] || []).map((file: File) => ({
              imageLink: file.name,
              shaphieId: detail.id
            })),
            documentShaphies: (documentFiles[gem.type]?.['documentShaphies']?.[index] || []).map((file: File) => ({
              documentLink: file.name,
              shaphieId: detail.id,
              documentTitle: 'Some Title'
            }))
          }))
        }
      }
      return gem
    })

    if (JSON.stringify(updatedGemstoneDataArray) !== JSON.stringify(gemstoneDataArray)) {
      setGemstoneDataArray(updatedGemstoneDataArray)
    }
  }, [imageFiles, documentFiles])

  useEffect(() => {
    const updatedMainDiamonds = gemstoneDataArray
      .filter((gem) => gem.type === 'mainDiamonds')
      .flatMap((gem) => gem.details) as MainDiamond[]

    const updatedSecondaryDiamonds = gemstoneDataArray
      .filter((gem) => gem.type === 'secondaryDiamonds')
      .flatMap((gem) => gem.details) as SecondaryDiamond[]

    const updatedMainShaphies = gemstoneDataArray
      .filter((gem) => gem.type === 'mainShaphies')
      .flatMap((gem) => gem.details) as MainShaphy[]

    const updatedSecondaryShaphies = gemstoneDataArray
      .filter((gem) => gem.type === 'secondaryShaphies')
      .flatMap((gem) => gem.details) as SecondaryShaphy[]

    setFormData((prevData) => ({
      ...prevData,
      mainDiamonds: updatedMainDiamonds,
      secondaryDiamonds: updatedSecondaryDiamonds,
      mainShaphies: updatedMainShaphies,
      secondaryShaphies: updatedSecondaryShaphies
    }))
  }, [gemstoneDataArray])

  const handleAddGemstone = (type: 'mainDiamonds' | 'secondaryDiamonds' | 'mainShaphies' | 'secondaryShaphies') => {
    setGemstoneDataArray((prevData) => {
      const updatedData = [...prevData]
      const gemstone = updatedData.find((gem) => gem.type === type)

      if (gemstone) {
        let newDetail
        if (type === 'mainDiamonds' || type === 'secondaryDiamonds') {
          newDetail = {
            id: 0,
            name: '',
            color: '',
            cut: '',
            clarity: '',
            quantity: 0,
            settingType: '',
            dimension: '',
            shape: '',
            certificate: '',
            fluorescence: '',
            lengthWidthRatio: '',
            type: '',
            jewelryId: 0,
            documentDiamonds: [],
            imageDiamonds: []
          } as MainDiamond | SecondaryDiamond
        } else if (type === 'mainShaphies' || type === 'secondaryShaphies') {
          newDetail = {
            id: 0,
            name: '',
            color: '',
            carat: '',
            enhancementType: '',
            quantity: 0,
            settingType: '',
            dimension: '',
            jewelryId: 0,
            documentShaphies: [],
            imageShaphies: []
          } as MainShaphy | SecondaryShaphy
        }

        if (newDetail) {
          gemstone.details.push(newDetail)
        }
      }

      return updatedData
    })
  }

  const handleFormChangeFinal = (name: string, value: string) => {
    const numberValue =
      name === 'estimatePriceMin' || name === 'estimatePriceMax' || name === 'specificPrice' ? Number(value) : value

    setFormData((prevData) => ({
      ...prevData,
      [name]: numberValue
    }))
  }

  const handleFormChangeBasic = (name: string, value: any) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleImageChange = (files: File[]) => {
    setSelectedImages(files)
  }
  const handleGemstoneChange = (
    type: 'mainDiamonds' | 'secondaryDiamonds' | 'mainShaphies' | 'secondaryShaphies',
    index: number,
    field: string,
    value: string
  ) => {
    setGemstoneDataArray((prevData) => {
      const updatedData = [...prevData]
      const gemstone = updatedData.find((gem) => gem.type === type)

      if (gemstone && gemstone.details[index]) {
        const currentValue = (gemstone.details[index] as any)[field]
        if (value !== currentValue) {
          ;(gemstone.details[index] as any)[field] = value || null
        }
      }

      return updatedData
    })
  }

  const handleImageChangeGemstone = (
    files: File[],
    key: 'documentDiamonds' | 'imageDiamonds' | 'documentShaphies' | 'imageShaphies',
    index: number,
    gemstoneType: 'mainDiamonds' | 'secondaryDiamonds' | 'mainShaphies' | 'secondaryShaphies'
  ) => {
    try {
      setImageFiles((prev: ImageFiles) => {
        const updatedFiles: ImageFiles = { ...prev }

        if (!updatedFiles[gemstoneType]) {
          updatedFiles[gemstoneType] = {}
        }
        if (!updatedFiles[gemstoneType][key]) {
          updatedFiles[gemstoneType][key] = {}
        }
        updatedFiles[gemstoneType][key]![index] = files

        return updatedFiles
      })

      setDocumentFiles((prev: ImageFiles) => {
        const updatedFiles: ImageFiles = { ...prev }

        if (!updatedFiles[gemstoneType]) {
          updatedFiles[gemstoneType] = {}
        }
        if (!updatedFiles[gemstoneType][key]) {
          updatedFiles[gemstoneType][key] = {}
        }
        updatedFiles[gemstoneType][key]![index] = files

        return updatedFiles
      })
    } catch (error) {
      console.error('Error updating files:', error)
    }
  }

  const next = () => {
    console.log('Dữ liệu Form tại Bước Thông Tin Cơ Bản:', formData)
    setCurrentStep(currentStep + 1)
  }

  const prev = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async () => {
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name || '')
      formDataToSend.append('videoLink', formData.videoLink || '')
      formDataToSend.append('artistId', formData.artistId.toString())
      formDataToSend.append('categoryId', formData.categoryId.toString())
      formDataToSend.append('forGender', formData.forGender)
      formDataToSend.append('valuationId', formData.valuationId)
      formDataToSend.append('estimatePriceMin', formData.estimatePriceMin.toString())
      formDataToSend.append('estimatePriceMax', formData.estimatePriceMax.toString())
      formDataToSend.append('specificPrice', formData.specificPrice.toString())

      // Append key characteristic details
      formData.keyCharacteristicDetails.forEach((detail, index) => {
        formDataToSend.append(`keyCharacteristicDetails[${index}].Description`, detail.description || '')
        formDataToSend.append(
          `keyCharacteristicDetails[${index}].KeyCharacteristicId`,
          detail.keyCharacteristicId.toString()
        )
      })

      // Append selected images
      selectedImages.forEach((image) => {
        formDataToSend.append('imageJewelries', image)
      })

      // Utility function to append gemstone details
      const appendGemstoneDetails = (
        gemstoneType: string,
        details: (MainDiamond | SecondaryDiamond | MainShaphy | SecondaryShaphy)[]
      ) => {
        details.forEach((detail, index) => {
          if (gemstoneType === 'mainDiamonds' || gemstoneType === 'secondaryDiamonds') {
            const diamondDetail = detail as MainDiamond | SecondaryDiamond
            formDataToSend.append(`${gemstoneType}[${index}].name`, diamondDetail.name)
            formDataToSend.append(`${gemstoneType}[${index}].color`, diamondDetail.color)
            formDataToSend.append(`${gemstoneType}[${index}].cut`, diamondDetail.cut)
            formDataToSend.append(`${gemstoneType}[${index}].clarity`, diamondDetail.clarity)
            formDataToSend.append(`${gemstoneType}[${index}].quantity`, diamondDetail.quantity.toString())
            formDataToSend.append(`${gemstoneType}[${index}].settingType`, diamondDetail.settingType)
            formDataToSend.append(`${gemstoneType}[${index}].dimension`, diamondDetail.dimension)
            formDataToSend.append(`${gemstoneType}[${index}].shape`, diamondDetail.shape)
            formDataToSend.append(`${gemstoneType}[${index}].certificate`, diamondDetail.certificate)
            formDataToSend.append(`${gemstoneType}[${index}].fluorescence`, diamondDetail.fluorescence)
            formDataToSend.append(`${gemstoneType}[${index}].lengthWidthRatio`, diamondDetail.lengthWidthRatio)

            imageFiles[gemstoneType]?.['imageDiamonds']?.[index]?.forEach((file: File, imgIndex: number) => {
              if (file instanceof File) {
                console.log(`File at index ${imgIndex}:`, file)
                formDataToSend.append(`${gemstoneType}[${index}].imageDiamonds`, file)
              } else {
                console.error('Expected a File object, but got:', file)
              }
            })

            documentFiles[gemstoneType]?.['documentDiamonds']?.[index]?.forEach((file: File, imgIndex: number) => {
              if (file instanceof File) {
                console.log(`File at index ${imgIndex}:`, file)
                formDataToSend.append(`${gemstoneType}[${index}].documentDiamonds`, file)
              } else {
                console.error('Expected a File object, but got:', file)
              }
            })
          } else if (gemstoneType === 'mainShaphies' || gemstoneType === 'secondaryShaphies') {
            const shaphyDetail = detail as MainShaphy | SecondaryShaphy
            formDataToSend.append(`${gemstoneType}[${index}].name`, shaphyDetail.name)
            formDataToSend.append(`${gemstoneType}[${index}].color`, shaphyDetail.color)
            formDataToSend.append(`${gemstoneType}[${index}].carat`, shaphyDetail.carat)
            formDataToSend.append(`${gemstoneType}[${index}].enhancementType`, shaphyDetail.enhancementType)
            formDataToSend.append(`${gemstoneType}[${index}].quantity`, shaphyDetail.quantity.toString())
            formDataToSend.append(`${gemstoneType}[${index}].settingType`, shaphyDetail.settingType)
            formDataToSend.append(`${gemstoneType}[${index}].dimension`, shaphyDetail.dimension)

            imageFiles[gemstoneType]?.['imageShaphies']?.[index]?.forEach((file: File, imgIndex: number) => {
              if (file instanceof File) {
                console.log(`File at index ${imgIndex}:`, file)
                formDataToSend.append(`${gemstoneType}[${index}].imageShaphies`, file)
              } else {
                console.error('Expected a File object, but got:', file)
              }
            })

            documentFiles[gemstoneType]?.['documentShaphies']?.[index]?.forEach((file: File, imgIndex: number) => {
              if (file instanceof File) {
                console.log(`File at index ${imgIndex}:`, file)
                formDataToSend.append(`${gemstoneType}[${index}].documentShaphies`, file)
              } else {
                console.error('Expected a File object, but got:', file)
              }
            })
          }
        })
      }

      gemstoneDataArray.forEach((gemstone) => {
        appendGemstoneDetails(gemstone.type, gemstone.details)
      })

      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ', ' + pair[1])
      }

      console.log('Payload gửi đến API:', formDataToSend)

      const response = await createFinalValuation(formDataToSend).unwrap()
      console.log('Phản hồi API:', response)
      message.success('Tạo đánh giá cuối cùng thành công!')
    } catch (error) {
      console.error('Yêu cầu API thất bại:', error)
    }
  }

  const steps = [
    {
      title: <span className='font-bold'>{'Basic Information'}</span>,
      content: <BasicInfoStep formData={formData} handleFormChange={handleFormChangeBasic} />
    },
    {
      title: <span className='font-bold'>{'Gemstone Details'}</span>,
      content: (
        <GemstoneDetails
          formData={{
            mainDiamonds: gemstoneDataArray
              .filter((gem) => gem.type === 'mainDiamonds')
              .flatMap((gem) => gem.details) as MainDiamond[],
            secondaryDiamonds: gemstoneDataArray
              .filter((gem) => gem.type === 'secondaryDiamonds')
              .flatMap((gem) => gem.details) as SecondaryDiamond[],
            mainShaphies: gemstoneDataArray
              .filter((gem) => gem.type === 'mainShaphies')
              .flatMap((gem) => gem.details) as MainShaphy[],
            secondaryShaphies: gemstoneDataArray
              .filter((gem) => gem.type === 'secondaryShaphies')
              .flatMap((gem) => gem.details) as SecondaryShaphy[]
          }}
          gemstoneDataArray={gemstoneDataArray}
          handleAddGemstone={handleAddGemstone}
          handleGemstoneChange={handleGemstoneChange}
          setGemstoneDataArray={setGemstoneDataArray}
          handleImageChangeGemstone={handleImageChangeGemstone}
        />
      )
    },

    {
      title: <span className='font-bold'>{'Final Step'}</span>,
      content: (
        <FinalStepsStep
          formDataPrice={formData}
          handleImageChange={handleImageChange}
          handleFormChange={handleFormChangeFinal}
        />
      )
    }
  ]

  return (
    <div className='max-w-6xl mx-auto p-4'>
      <h2 className='text-2xl font-bold mb-6'>Final Valuation</h2>
      <Steps className='mb-6' current={currentStep}>
        {steps.map((step, index) => (
          <Step key={index} title={step.title} />
        ))}
      </Steps>
      <div className='steps-content mb-6'>{steps[currentStep].content}</div>
      <div className='steps-action flex justify-end space-x-2'>
        {currentStep > 0 && (
          <Button
            onClick={prev}
            className='bg-gray-300 text-gray-700 hover:bg-gray-400 transition-colors duration-300 shadow-md relative overflow-hidden'
            style={{
              margin: '0 8px',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.4)',
              transition: 'all 0.3s ease'
            }}
          >
            Back
            <span className='absolute top-0 left-0 w-full h-full bg-gray-200 opacity-0 transition-opacity duration-300 hover:opacity-30'></span>
          </Button>
        )}
        {currentStep < steps.length - 1 && (
          <Button
            type='primary'
            onClick={next}
            className='bg-blue-500 text-white hover:bg-blue-600 shadow-lg relative overflow-hidden transition-colors duration-300'
            style={{
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.8)',
              transition: 'all 0.3s ease'
            }}
          >
            Next
            <span className='absolute top-0 left-0 w-full h-full bg-blue-400 opacity-0 transition-opacity duration-300 hover:opacity-40'></span>
          </Button>
        )}
        {currentStep === steps.length - 1 && (
          <Button
            type='primary'
            onClick={handleSubmit}
            className='bg-blue-500 text-white text-sm hover:bg-blue-900 shadow-2xl relative overflow-hidden transition-colors duration-300'
            style={{
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
              transition: 'all 0.3s ease'
            }}
          >
            Create
            <span className='absolute top-0 left-0 w-full h-full bg-blue-400 opacity-0 transition-opacity duration-300 hover:opacity-40'></span>
          </Button>
        )}
      </div>
    </div>
  )
}
