import { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import ProductDetail from './ProductDetail'
import LiveBidding from './LiveBidding'
import { useBidding } from '../../../../../hooks/useBidding'
import { useGetLotDetailByIdQuery, useGetPlayerInLotQuery } from '../../../../../services/lot.services'
import type { Data } from '../../../../../types/Account.type'
import { useBiddingMethod4 } from '../../../../../hooks/useBiddingMethod4'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../../store'
import { RoleType } from '../../../../../slice/authLoginAPISlice'
import { Alert } from 'antd'

export interface Bid {
  bidTime: string
  currentPrice: number
  customerId: number
  lotId: number
}

const Index = () => {
  const { disconnect, endTime, isConnected, joinLiveBidding, messages, status } = useBidding()
  const {
    joinLiveBiddingMethod4,
    messages: messagesMethod4,
    winnerCustomer,
    winnerPrice,
    reducePrice,
    isEndAuctionMethod4,
    disconnect: disconnectMethod4,
    status: statusMethod4
  } = useBiddingMethod4()

  const { id } = useParams<{ id: string }>()
  const { data, isLoading } = useGetLotDetailByIdQuery(Number(id))
  const { data: playerInLot } = useGetPlayerInLotQuery(Number(id))

  // Get user ID from localStorage
  const user = localStorage.getItem('userLogin')
  const userID = useMemo(() => {
    return user ? (JSON.parse(user) as Data).user?.id : NaN
  }, [user])
  const role = useSelector((state: RootState) => state.authLoginAPI.roleId)
  const isStaff = role === RoleType.STAFFC
  const staffid = useSelector((state: RootState) => state.authLoginAPI.staffId)
  const isStaffAssigned = data?.data?.staff?.id === staffid

  const canViewLiveBidding = useMemo(() => {
    if (!isStaff) return true // Không phải staff thì được xem
    return isStaffAssigned // Là staff thì phải được assign mới xem được
  }, [isStaff, isStaffAssigned])

  // Time calculation logic
  const calculateTimeLeft = useCallback(() => {
    if (!data?.data) return { days: 0, hours: 0, minutes: 0, seconds: 0 }

    // For UpComing or Waiting status, count down from current time to start time
    if (data.data.status === 'UpComing' || data.data.status === 'Waiting') {
      const difference = +new Date(data.data.startTime) - +new Date()
      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 }
      }
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      }
    }

    // For other statuses, use the existing logic
    if (
      data.data.lotType === 'Fixed_Price' ||
      data.data.lotType === 'Secret_Auction' ||
      data.data.lotType === 'Auction_Price_GraduallyReduced'
    ) {
      const difference = +new Date(data.data.endTime) - +new Date()
      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 }
      }
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      }
    }

    if (!endTime) return { days: 0, hours: 0, minutes: 0, seconds: 0 }

    const difference = +new Date(endTime) - +new Date()

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    }
  }, [data?.data, endTime])

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())
  const timerRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [calculateTimeLeft])

  const formatTimeDisplay = useMemo(() => {
    const { days, hours, minutes, seconds } = timeLeft

    if (data?.data.status === 'Cancelled' || data?.data.status === 'Pass' || data?.data.status === 'Sold') {
      return ''
    }

    if (data?.data.status === 'UpComing' || data?.data.status === 'Waiting') {
      if (days > 0) {
        return `Start in: ${days}d ${hours}h ${minutes}m ${seconds}s`
      } else if (hours > 0) {
        return `Start in: ${hours}h ${minutes}m ${seconds}s`
      } else if (minutes > 0) {
        return `Start in: ${minutes}m ${seconds}s`
      } else {
        return `Start in: ${seconds}s`
      }
    }

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m ${seconds}s`
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`
    } else {
      return `${seconds}s`
    }
  }, [timeLeft, data?.data.status])

  // Join live bidding on component mount
  useEffect(() => {
    if (!id || !data?.data?.lotType) return

    const joinBidding = async () => {
      if (data.data.lotType === 'Public_Auction') {
        await joinLiveBidding(userID, id.toString())
      } else if (data.data.lotType === 'Auction_Price_GraduallyReduced') {
        await joinLiveBiddingMethod4(userID, id.toString())
      }
    }

    joinBidding()

    return () => {
      if (data.data.lotType === 'Public_Auction') {
        disconnect()
      } else {
        disconnectMethod4()
      }
    }
  }, [id, data?.data?.lotType, userID])

  if (isLoading) {
    return <div>Loading...</div>
  }

  const renderLiveBidding = () => {
    if (!data?.data) return null

    const lotType = data.data.lotType

    if (lotType === 'Fixed_Price' || lotType === 'Secret_Auction') {
      return (
        <LiveBidding
          key='fixed-secret-auction'
          bids={messages}
          itemLot={data.data}
          playerInLot={playerInLot?.data}
          status={data.data.status}
        />
      )
    }

    if (lotType === 'Auction_Price_GraduallyReduced') {
      return (
        <LiveBidding
          key='reduced-price-auction'
          bids={messagesMethod4}
          itemLot={data.data}
          currentPrice={reducePrice}
          isEndAuction={isEndAuctionMethod4}
          playerInLot={playerInLot?.data}
          winnerCustomer={winnerCustomer}
          winnerPrice={winnerPrice}
          status={statusMethod4}
        />
      )
    }

    return <LiveBidding key='public-auction' bids={messages} itemLot={data.data} status={status} />
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className='space-y-4'>
      <div className='flex-col gap-4'>
        {isStaff && !isStaffAssigned && (
          <Alert
            message='Access Restricted'
            description="You don't have permission to view the live bidding for this lot."
            type='warning'
            showIcon
            className='mb-4'
          />
        )}

        {canViewLiveBidding && (
          <div className='w-full'>
            <div className='text-lg font-bold text-center'>
              {(data && data?.data.status === 'Waiting') || data?.data.status === 'UpComing' ? '' : 'Time Left '}
              {formatTimeDisplay}
            </div>
            {data?.data ? renderLiveBidding() : <div>No lot data available</div>}
          </div>
        )}

        {data?.data && (
          <div className={isConnected ? 'w-full' : 'w-full'}>
            <ProductDetail item={data.data} />
          </div>
        )}
      </div>
    </div>
  )
}

export default Index
