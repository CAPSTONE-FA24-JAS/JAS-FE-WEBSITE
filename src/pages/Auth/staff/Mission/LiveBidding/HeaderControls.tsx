import { CaretRightOutlined, PauseOutlined, StopOutlined } from '@ant-design/icons'
import React, { useMemo } from 'react'

interface HeaderControlsProps {
  backgroundColor: string
  status: string
  handlePause: () => void
  handleStart: () => void
  handleCancel: () => void
}

export const HeaderControls: React.FC<HeaderControlsProps> = ({
  backgroundColor,
  status,
  handlePause,
  handleStart,
  handleCancel
}) => {
  // Map trạng thái hiển thị
  const statusMap = useMemo<Record<string, { display: string; color: string }>>(
    () => ({
      auctioning: { display: 'Running', color: 'text-green-600' },
      canceled: { display: 'Canceled', color: 'text-red-600' },
      pause: { display: 'Paused', color: 'text-yellow-600' },
      sold: { display: 'Sold', color: 'text-blue-600' },
      passed: { display: 'Passed', color: 'text-gray-600' },
      waiting: { display: 'Waiting', color: 'text-gray-400' }
    }),
    []
  )

  // Normalize status to lowercase for consistent comparison
  const normalizedStatus = status.toLowerCase()

  // Get display status and color
  const { display: displayStatus, color: statusColor } = useMemo(
    () => statusMap[normalizedStatus] || { display: 'Unknown', color: 'text-gray-500' },
    [normalizedStatus, statusMap]
  )

  // Button visibility conditions
  const buttonStates = useMemo(
    () => ({
      pause: {
        visible: normalizedStatus === 'auctioning',
        enabled: normalizedStatus === 'auctioning',
        tooltip: normalizedStatus !== 'auctioning' ? 'Can only pause during auction' : ''
      },
      start: {
        visible: normalizedStatus === 'pause',
        enabled: normalizedStatus === 'pause',
        tooltip: normalizedStatus !== 'pause' ? 'Can only start when paused' : ''
      },
      cancel: {
        visible: ['auctioning', 'pause'].includes(normalizedStatus),
        enabled: ['auctioning', 'pause'].includes(normalizedStatus),
        tooltip: !['auctioning', 'pause'].includes(normalizedStatus) ? 'Cannot cancel in current state' : ''
      }
    }),
    [normalizedStatus]
  )

  const ButtonComponent: React.FC<{
    onClick: () => void
    disabled: boolean
    tooltip: string
    icon: React.ReactNode
    testId: string
  }> = ({ onClick, disabled, tooltip, icon, testId }) => (
    <button
      className={`
        flex items-center justify-center p-2 text-center
        ${backgroundColor} rounded-3xl
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-95 active:brightness-90'}
        transition-all duration-200
      `}
      onClick={onClick}
      disabled={disabled}
      title={tooltip}
      data-testid={testId}
    >
      {icon}
    </button>
  )

  return (
    <div className='flex items-center justify-between px-4 py-2 bg-white rounded-lg shadow-sm'>
      <div className='flex gap-3'>
        {/* Pause Button */}
        {buttonStates.pause.visible && (
          <ButtonComponent
            onClick={handlePause}
            disabled={!buttonStates.pause.enabled}
            tooltip={buttonStates.pause.tooltip}
            icon={<PauseOutlined style={{ fontSize: '20px' }} />}
            testId='pause-button'
          />
        )}

        {/* Start Button */}
        {buttonStates.start.visible && (
          <ButtonComponent
            onClick={handleStart}
            disabled={!buttonStates.start.enabled}
            tooltip={buttonStates.start.tooltip}
            icon={<CaretRightOutlined style={{ fontSize: '20px' }} />}
            testId='start-button'
          />
        )}

        {/* Cancel Button */}
        {buttonStates.cancel.visible && (
          <ButtonComponent
            onClick={handleCancel}
            disabled={!buttonStates.cancel.enabled}
            tooltip={buttonStates.cancel.tooltip}
            icon={<StopOutlined style={{ fontSize: '20px' }} />}
            testId='cancel-button'
          />
        )}
      </div>

      {/* Status Display */}
      <div className={`flex items-center gap-2 font-medium ${statusColor}`}>
        <span
          className={`w-2 h-2 rounded-full ${
            normalizedStatus === 'auctioning' ? 'bg-green-600 animate-pulse' : statusColor.replace('text-', 'bg-')
          }`}
        />
        <span className='text-sm'>Status: {displayStatus}</span>
      </div>
    </div>
  )
}
