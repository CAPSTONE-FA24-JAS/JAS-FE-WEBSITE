import React from 'react'

interface GemstoneData {
  type: 'Diamond' | 'Sapphire' // Define specific types
  shape: string
  cut: string
  quantity: string
  totalCaratColor: string
  color: string
  dimensions: string
  settingType: string
  clarity: string
  enhancementType?: string // Optional for Sapphire only
  carat?: string // Optional for Sapphire only
}

interface GemstoneProps {
  gemstoneType: 'Diamond' | 'Sapphire'
  setGemstoneType: (type: 'Diamond' | 'Sapphire') => void // Update to accept direct type
  showGemstoneDetails: boolean
  handleGemstoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  gemstoneData: GemstoneData
}

const Gemstone: React.FC<GemstoneProps> = ({
  gemstoneType,
  setGemstoneType,
  showGemstoneDetails,
  handleGemstoneChange,
  gemstoneData
}) => {
  return (
    <div>
      {/* Toggle Gemstone Type */}
      <div className='mb-4'>
        <label className='block font-medium mb-1'>Gemstone Type</label>
        <div className='flex justify-center'>
          <label className='mr-0'>
            <input
              type='radio'
              name='gemstoneType'
              value='Diamond'
              checked={gemstoneType === 'Diamond'}
              onChange={() => setGemstoneType('Diamond')} // Update gemstone type
              className='hidden' // Hide radio button
            />
            <span
              className={`inline-block px-4 py-2 rounded-l transition-colors duration-300 ${
                gemstoneType === 'Diamond' ? 'bg-black text-white' : 'bg-gray-300 text-black'
              } hover:bg-gray-500 hover:text-white cursor-pointer font-bold`}
            >
              Diamond
            </span>
          </label>

          <label className='mr-0'>
            <input
              type='radio'
              name='gemstoneType'
              value='Sapphire'
              checked={gemstoneType === 'Sapphire'}
              onChange={() => setGemstoneType('Sapphire')} // Update gemstone type
              className='hidden' // Hide radio button
            />
            <span
              className={`inline-block px-4 py-2 rounded-r transition-colors duration-300 ${
                gemstoneType === 'Sapphire' ? 'bg-black text-white' : 'bg-gray-300 text-black'
              } hover:bg-gray-500 hover:text-white cursor-pointer font-bold`}
            >
              Sapphire
            </span>
          </label>
        </div>
      </div>

      {/* Common Gemstone Inputs */}
      <div className='grid grid-cols-2 gap-4'>
        {['shape', 'cut', 'quantity', 'totalCaratColor', 'color', 'dimensions', 'settingType', 'clarity'].map((key) => (
          <div key={key}>
            <label className='block font-medium mb-1'>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
            <input
              type='text'
              name={key}
              value={gemstoneData[key as keyof GemstoneData]}
              onChange={handleGemstoneChange}
              className='w-full border border-gray-300 p-2 rounded'
              placeholder={`Enter ${key}`}
            />
          </div>
        ))}
      </div>

      {/* Sapphire Specific Fields */}
      {gemstoneType === 'Sapphire' && (
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='block font-medium mt-4 mb-1'>Enhancement Type</label>
            <input
              type='text'
              name='enhancementType'
              value={gemstoneData.enhancementType || ''}
              onChange={handleGemstoneChange}
              className='w-full border border-gray-300 p-2 rounded'
              placeholder='Enter enhancement type'
            />
          </div>
          <div>
            <label className='block font-medium mt-4 mb-1'>Carat</label>
            <input
              type='text'
              name='carat'
              value={gemstoneData.carat || ''}
              onChange={handleGemstoneChange}
              className='w-full border border-gray-300 p-2 rounded'
              placeholder='Enter carat'
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default Gemstone
