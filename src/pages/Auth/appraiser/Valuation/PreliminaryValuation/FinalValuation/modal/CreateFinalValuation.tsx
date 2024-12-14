import { Button, Steps, notification } from 'antd'
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCreateFinalValuationMutation } from '../../../../../../../services/createfinalvaluation.services'
import {
  MainDiamond,
  MainShaphy,
  SecondaryDiamond,
  SecondaryShaphy,
  ValuationGemstoneData
} from '../../../../../../../types/Gemstones.type'
import BasicInfoStep from './StepCreateFinal/BasicInfo'
import FinalStepsStep from './StepCreateFinal/FinalInfo'
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
    { type: 'mainDiamonds', details: [] },
    { type: 'secondaryDiamonds', details: [] },
    { type: 'mainShaphies', details: [] },
    { type: 'secondaryShaphies', details: [] }
  ])

  const [currentStep, setCurrentStep] = useState(0)
  const [createFinalValuation] = useCreateFinalValuationMutation()
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

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

      if (gemstone && gemstone.details.length === 0) {
        let newDetail
        if (type === 'mainDiamonds' || type === 'secondaryDiamonds') {
          newDetail = {
            id: 0,
            name: '',
            color: '',
            cut: '',
            clarity: '',
            carat: '',
            totalcarat: '',
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
            totalcarat: '',
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

      if (gemstone) {
        if (!gemstone.details[index]) {
          gemstone.details[index] = {} as any // Khởi tạo đối tượng nếu chưa tồn tại
        }

        gemstone.details[index] = {
          ...gemstone.details[index],
          [field]: value
        }

        // Kiểm tra nếu tất cả các trường đều rỗng
        const isEmpty = Object.values(gemstone.details[index]).every(
          (val) => val === '' || val === null || val === undefined
        )

        if (isEmpty) {
          gemstone.details.splice(index, 1) // Xóa đối tượng nếu tất cả các trường đều rỗng
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
    if (currentStep === 0) {
      const requiredFields = {
        name: formData.name,
        categoryId: formData.categoryId,
        condition: formData.keyCharacteristicDetails.find((item) => item.keyCharacteristicId === 4)?.description,
        measurements: formData.keyCharacteristicDetails.find((item) => item.keyCharacteristicId === 5)?.description,
        weight: formData.keyCharacteristicDetails.find((item) => item.keyCharacteristicId === 7)?.description,
        metal: formData.keyCharacteristicDetails.find((item) => item.keyCharacteristicId === 8)?.description
      }

      const hasEmptyFields = Object.entries(requiredFields).some(([key, value]) => {
        if (key === 'categoryId') {
          return !value || Number(value) <= 0
        }
        return !value || value.toString().trim() === ''
      })

      if (hasEmptyFields) {
        notification.error({
          message: 'Lỗi Validation',
          description: 'Vui lòng điền đầy đủ thông tin các trường bắt buộc'
        })
        return
      }
    }

    if (currentStep === 1) {
      const requiredDiamondFields = ['shape', 'quantity', 'color', 'clarity', 'totalcarat', 'dimension']
      const requiredShaphyFields = ['quantity', 'color', 'totalcarat', 'dimension']
      let hasError = false

      const activeGemstones = ['mainDiamonds', 'secondaryDiamonds', 'mainShaphies', 'secondaryShaphies'].filter(
        (type) =>
          Array.isArray(formData[type as keyof ValuationGemstoneData]) &&
          (formData[type as keyof ValuationGemstoneData] as any[]).length > 0
      )

      if (activeGemstones.length === 0) {
        notification.error({
          message: 'Lỗi Validation',
          description: 'Vui lòng thêm ít nhất một loại đá quý'
        })
        return
      }

      activeGemstones.forEach((type) => {
        const gemstones = formData[type as keyof typeof formData] as any[]
        const requiredFields = type.includes('Diamond') ? requiredDiamondFields : requiredShaphyFields

        gemstones.forEach((gemstone, index) => {
          requiredFields.forEach((field) => {
            if (!gemstone[field] || gemstone[field].toString().trim() === '') {
              hasError = true
              notification.error({
                message: 'Lỗi Validation',
                description: `Vui lòng điền đầy đủ thông tin trường ${field} cho ${type} #${index + 1}`
              })
            }
          })
        })
      })

      if (hasError) {
        return
      }
    }

    setCurrentStep(currentStep + 1)
  }

  const prev = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async () => {
    if (!formData.estimatePriceMin || !formData.estimatePriceMax || !formData.specificPrice) {
      notification.error({
        message: 'Lỗi Validation',
        description: 'Vui lòng nhập đầy đủ thông tin giá (Estimate Price Min, Estimate Price Max, Specific Price)'
      })
      return
    }

    setIsLoading(true)
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
            formDataToSend.append(`${gemstoneType}[${index}].carat`, diamondDetail.carat)
            formDataToSend.append(`${gemstoneType}[${index}].totalcarat`, diamondDetail.totalcarat)
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
            formDataToSend.append(`${gemstoneType}[${index}].totalcarat`, shaphyDetail.totalcarat)
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

      notification.success({
        message: 'Success',
        description: 'Create Final Valuation Success!'
      })

      navigate('/appraiser/finalList')
    } catch (error) {
      console.error('Create Final Valuation Failed:', error)

      notification.error({
        message: 'Error',
        description: 'Create Final Valuation Failed!'
      })
    } finally {
      setIsLoading(false)
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
            loading={isLoading}
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
