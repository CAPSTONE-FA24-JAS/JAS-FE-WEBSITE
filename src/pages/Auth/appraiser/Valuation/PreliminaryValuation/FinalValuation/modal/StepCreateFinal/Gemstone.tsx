// import React, { useState } from 'react'
// import { GemstoneData, SecondGemstoneData } from '../../../../../../../../types/Gemstone.type'

// interface GemstoneDetailsProps {
//   gemstoneDataArray: GemstoneData[]
//   setGemstoneDataArray: React.Dispatch<React.SetStateAction<GemstoneData[]>>
//   handleAddGemstone: () => void
//   handleGemstoneChange: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void
// }

// const GemstoneDetails: React.FC<GemstoneDetailsProps> = ({
//   gemstoneDataArray,
//   setGemstoneDataArray,
//   handleAddGemstone,
//   handleGemstoneChange
// }) => {
//   const [secondGemstoneVisible, setSecondGemstoneVisible] = useState<boolean[]>([])
//   const [isCollapsed, setIsCollapsed] = useState<boolean[]>(Array(gemstoneDataArray.length).fill(false))

//   const handleAddSecondGemstone = (index: number) => {
//     const updatedVisibility = [...secondGemstoneVisible]
//     updatedVisibility[index] = true
//     setSecondGemstoneVisible(updatedVisibility)
//   }

//   const toggleCollapse = (index: number) => {
//     const updatedCollapse = [...isCollapsed]
//     updatedCollapse[index] = !updatedCollapse[index]
//     setIsCollapsed(updatedCollapse)
//   }

//   const renderDiamondFields = (data: GemstoneData, index: number, prefix: string) => (
//     <div className='grid grid-cols-2 gap-4'>
//       {[
//         { label: 'Name', key: `${prefix}name`, placeholder: 'Enter name' },
//         { label: 'Color', key: `${prefix}color`, placeholder: 'Enter color (e.g., H-I)' },
//         { label: 'Cut', key: `${prefix}cut`, placeholder: 'Enter cut type' },
//         { label: 'Quantity', key: `${prefix}quantity`, placeholder: 'Enter quantity' },
//         { label: 'Clarity', key: `${prefix}clarity`, placeholder: 'Enter clarity (e.g., I1)' },
//         { label: 'Setting Type', key: `${prefix}settingType`, placeholder: 'Enter setting type' },
//         { label: 'Dimensions', key: `${prefix}dimensions`, placeholder: 'Enter dimensions' },
//         { label: 'Shape', key: `${prefix}shape`, placeholder: 'Enter shape' },
//         { label: 'Certificate', key: `${prefix}certificate`, placeholder: 'Enter certificate' },
//         { label: 'Fluorescence', key: `${prefix}fluorescence`, placeholder: 'Enter fluorescence' },
//         { label: 'Length/Width Ratio', key: `${prefix}lengthWidthRatio`, placeholder: 'Enter ratio' },
//         { label: 'Document Diamonds', key: `${prefix}documentDiamonds`, placeholder: 'Enter enhancement type' }
//       ].map(({ label, key, placeholder }) => (
//         <div key={key}>
//           <label className='block font-medium mb-1'>{label}</label>
//           <input
//             type='text'
//             name={key}
//             value={String(data[key as keyof GemstoneData] || '')}
//             onChange={(e) => handleGemstoneChange(e, index)}
//             className='w-full border border-gray-300 p-2 rounded'
//             placeholder={placeholder}
//           />
//         </div>
//       ))}
//     </div>
//   )

//   const renderSapphireFields = (data: GemstoneData, index: number, prefix: string) => (
//     <div className='grid grid-cols-2 gap-4'>
//       {[
//         { label: 'Name', key: `${prefix}name`, placeholder: 'Enter name' },
//         { label: 'Color', key: `${prefix}color`, placeholder: 'Enter color (e.g., Blue)' },
//         { label: 'Carat', key: `${prefix}carat`, placeholder: 'Enter carat' },
//         { label: 'Quantity', key: `${prefix}quantity`, placeholder: 'Enter quantity' },
//         { label: 'Dimensions', key: `${prefix}dimensions`, placeholder: 'Enter dimensions (e.g., 7)' },
//         { label: 'Setting Type', key: `${prefix}settingType`, placeholder: 'Enter setting type' },
//         { label: 'Enhancement Type', key: `${prefix}enhancementType`, placeholder: 'Enter enhancement type' },
//         { label: 'Document Sapphires', key: `${prefix}documentSapphires`, placeholder: 'Enter enhancement type' }
//       ].map(({ label, key, placeholder }) => (
//         <div key={key}>
//           <label className='block font-medium mb-1'>{label}</label>
//           <input
//             type='text'
//             name={key}
//             value={String(data[key as keyof GemstoneData] || '')}
//             onChange={(e) => handleGemstoneChange(e, index)}
//             className='w-full border border-gray-300 p-2 rounded'
//             placeholder={placeholder}
//           />
//         </div>
//       ))}
//     </div>
//   )

//   return (
//     <div className='mt-8'>
//       <div className='mt-8 mb-4 flex justify-between items-center'>
//         <h3 className='text-xl font-semibold mb-0'>Gemstone Details</h3>
//         <button type='button' onClick={handleAddGemstone} className='bg-gray-300 text-black px-4 py-2 rounded'>
//           Add Gemstone Details
//         </button>
//       </div>

//       {gemstoneDataArray.map((gemstoneData, index) => (
//         <div key={index} className='border p-4 mb-4 rounded'>
//           <h4 className='text-lg font-semibold flex justify-between items-center'>
//             <span>Main Gemstone {index + 1}</span>
//             <button
//               type='button'
//               onClick={() => toggleCollapse(index)}
//               className='text-sm text-gray-500 flex items-center mr-2'
//             >
//               <span className={`transition-transform duration-500 ${isCollapsed[index] ? 'rotate-180' : ''}`}>
//                 {isCollapsed[index] ? '\u25B2' : '\u25BC'}
//               </span>
//             </button>
//           </h4>

//           {!isCollapsed[index] && (
//             <>
//               <div className='mb-4'>
//                 <label className='block font-medium mb-1'>Gemstone Type</label>
//                 <div className='flex justify-center'>
//                   {['Diamond', 'Sapphire'].map((type) => (
//                     <label className='mr-0' key={type}>
//                       <input
//                         type='radio'
//                         name={`gemstoneType${index}`}
//                         value={type}
//                         checked={gemstoneData.type === type}
//                         onChange={() => {
//                           const newGemstoneDataArray = [...gemstoneDataArray]
//                           newGemstoneDataArray[index].type = type as 'Diamond' | 'Sapphire'
//                           setGemstoneDataArray(newGemstoneDataArray)
//                         }}
//                         className='hidden'
//                       />
//                       <span
//                         className={`inline-block px-4 py-2 rounded transition-colors duration-300 ${
//                           gemstoneData.type === type ? 'bg-black text-white' : 'bg-gray-300 text-black'
//                         } hover:bg-gray-500 hover:text-white cursor-pointer font-bold`}
//                       >
//                         {type}
//                       </span>
//                     </label>
//                   ))}
//                 </div>
//               </div>

//               {/* Diamond Fields */}
//               {gemstoneData.type === 'Diamond' && renderDiamondFields(gemstoneData, index, '')}

//               {/* Sapphire Fields */}
//               {gemstoneData.type === 'Sapphire' && renderSapphireFields(gemstoneData, index, '')}

//               {!secondGemstoneVisible[index] && (
//                 <button
//                   type='button'
//                   onClick={() => handleAddSecondGemstone(index)}
//                   className='mt-4 bg-gray-300 text-black px-4 py-2 rounded'
//                 >
//                   Add Second Gemstone
//                 </button>
//               )}

//               {secondGemstoneVisible[index] && (
//                 <>
//                   <h4 className='text-lg font-semibold mt-6'>Second Gemstone</h4>
//                   {/* Second Diamond Fields */}
//                   {gemstoneData.type === 'Diamond' && renderDiamondFields(gemstoneData, index, 'second')}
//                   {/* Second Sapphire Fields */}
//                   {gemstoneData.type === 'Sapphire' && renderSapphireFields(gemstoneData, index, 'second')}
//                 </>
//               )}
//             </>
//           )}
//         </div>
//       ))}
//     </div>
//   )
// }

// export default GemstoneDetails
