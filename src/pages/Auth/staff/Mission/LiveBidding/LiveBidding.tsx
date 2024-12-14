import React, { useEffect, useMemo, useState } from 'react'
import { Message } from '../../../../../hooks/useBidding'
import { AuctionLotStatus, LotDetail, PLayerInLot } from '../../../../../types/Lot.type'
import { parseDate, parsePriceVND } from '../../../../../utils/convertTypeDayjs'
import {
  useCancelLotMutation,
  useGetWinnerForLotQuery,
  useOpenAndPauseLotMutation
} from '../../../../../services/lot.services'
import { HeaderControls } from './HeaderControls'

interface LiveBiddingProps {
  bids: Message[]
  itemLot: LotDetail
  playerInLot?: PLayerInLot[]
  currentPrice?: number
  isEndAuction?: boolean
  winnerCustomer?: string
  winnerPrice?: string
  status?: string
}

const LiveBidding: React.FC<LiveBiddingProps> = ({
  bids,
  itemLot,
  playerInLot,
  currentPrice,
  isEndAuction,
  winnerCustomer,
  winnerPrice,
  status
}) => {
  const [statusLot, setStatusLot] = useState<string>(status || '')
  const [updateStatusLot] = useOpenAndPauseLotMutation()
  const [cancelLot] = useCancelLotMutation()

  const { data: winnerData } = useGetWinnerForLotQuery(itemLot.id, {
    skip: itemLot.status !== 'Sold' && itemLot.status !== 'Passed'
  })

  useEffect(() => {
    setStatusLot(status || '')
  }, [status])

  // Memoized sorted bids
  const sortedBids = useMemo(() => {
    if (!Array.isArray(bids) || bids.length === 0) return []

    return [...bids].sort((a, b) => {
      const timediff = +new Date(b.bidTime) - +new Date(a.bidTime)
      return timediff === 0 ? b.currentPrice - a.currentPrice : timediff
    })
  }, [bids])

  // Memoized sorted players for secret auction
  const sortedSecretBids = useMemo(() => {
    return [...(playerInLot || [])].sort((a, b) => b.bidPrice - a.bidPrice)
  }, [playerInLot])

  // Memoized sorted players for fixed price auction
  const sortedFixedPriceBids = useMemo(() => {
    return [...(playerInLot || [])].sort((a, b) => +new Date(a.bidTime) - +new Date(b.bidTime))
  }, [playerInLot])

  const calculatePriceReduction = (startPrice: number, currentPrice: number): string => {
    const reduction = ((startPrice - currentPrice) / startPrice) * 100
    return reduction.toFixed(1)
  }

  const handleStatusUpdate = async (status: AuctionLotStatus) => {
    try {
      await updateStatusLot({ lotid: itemLot.id, status }).unwrap()
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  const handleCancelAuction = async () => {
    try {
      const result = await cancelLot(itemLot.id).unwrap()
      if (result?.code === 200) {
        setStatusLot('Cancelled')
      }
    } catch (error) {
      console.error('Failed to cancel auction:', error)
    }
  }

  const TopBidDisplay = ({ bid }: { bid: Message }) => (
    <div className='p-4 bg-red-300 rounded-lg shadow-md'>
      <div className='mb-2 text-lg font-semibold text-gray-700'>
        <span className='text-red-500'>Id: {bid.customerId}</span>
        <span className='ml-2'>
          {bid.firstName} {bid.lastName}
        </span>
      </div>
      <div className='text-xl font-bold text-green-600'>{parsePriceVND(bid.currentPrice)}</div>
    </div>
  )

  const BidItem = ({ bid }: { bid: Message }) => {
    const getBidStatusColor = () => {
      switch (bid.status) {
        case 'Processing':
          return 'bg-yellow-100'
        case 'Accepted':
          return 'bg-green-100'
        case 'Rejected':
          return 'bg-red-100'
        default:
          return 'bg-white'
      }
    }

    return (
      <div
        key={`${bid.customerId}-${bid.bidTime}-${bid.currentPrice}`}
        className={`flex justify-between items-center p-3 mb-2 rounded-lg shadow ${getBidStatusColor()}`}
      >
        <span className='flex-1 text-left text-gray-600'>{parseDate(bid.bidTime, 'dd/mm/yyyy hh:mm:ss:ttt')}</span>
        <span className='flex-1 font-medium text-left text-gray-700'>
          {bid.customerId}: {bid.firstName} {bid.lastName}
        </span>
        <span className='flex-1 font-bold text-right text-green-600'>{parsePriceVND(bid.currentPrice)}</span>
        <span className='flex-1 font-semibold text-center text-gray-700'>
          {bid.status === 'Processing' ? 'Pending' : bid.status}
        </span>
      </div>
    )
  }

  const AuctionEndStatus = () => {
    if (isEndAuction) {
      return (
        <div className='p-4 text-center bg-purple-100'>
          <h3 className='text-xl font-bold'>Auction Ended</h3>
          <p>Winner: {winnerCustomer}</p>
          <p>Winning Price: {winnerPrice}</p>
        </div>
      )
    }

    if (itemLot.status === 'Sold' && winnerData?.data?.[0]) {
      const winner = winnerData.data[0]
      return (
        <div className='p-4 text-center bg-purple-100'>
          <h3 className='text-xl font-bold'>Auction Ended</h3>
          <p>
            Winner: {winner.customer.firstName} {winner.customer.lastName}
          </p>
          <p>Winning Price: {parsePriceVND(winner.currentPrice)}</p>
        </div>
      )
    }

    if (itemLot.status === 'Passed') {
      return (
        <div className='p-4 text-center bg-purple-100'>
          <h3 className='text-xl font-bold'>Auction Ended</h3>
          <p>No winner for this auction.</p>
        </div>
      )
    }

    return null
  }

  const PublicAuction = () => {
    const isAuctionEndSold = itemLot.status === 'Sold'
    const isAuctionEndPassed = itemLot.status === 'Passed'
    const topBid = sortedBids.find((bid) => bid.status === 'Success') || sortedBids[0]

    return (
      <>
        <div className='p-4 text-white bg-red-600 rounded-t-lg'>
          <h2 className='mb-4 text-2xl font-bold text-gray-800'>
            {isAuctionEndSold ? 'The winner is:' : isAuctionEndPassed ? 'No winner' : 'Top bid:'}
          </h2>
          {!isAuctionEndPassed && topBid && <TopBidDisplay bid={topBid} />}
          <HeaderControls
            backgroundColor='bg-red-500'
            status={statusLot}
            handlePause={() => handleStatusUpdate(AuctionLotStatus.Pause)}
            handleStart={() => handleStatusUpdate(AuctionLotStatus.Auctioning)}
            handleCancel={handleCancelAuction}
          />
        </div>
        <div className='p-4 bg-gray-100 rounded-b-lg'>
          {sortedBids.length > 0 ? (
            sortedBids.map((bid) => <BidItem key={`${bid.customerId}-${bid.bidTime}`} bid={bid} />)
          ) : (
            <div className='text-center text-gray-500'>No bids yet</div>
          )}
        </div>
      </>
    )
  }

  const GraduallyReducedAuction = () => {
    const startPrice = itemLot.startPrice || 0

    return (
      <>
        <div className='p-4 text-white bg-purple-600 rounded-t-lg'>
          <HeaderControls
            backgroundColor='bg-purple-500'
            status={statusLot}
            handlePause={() => handleStatusUpdate(AuctionLotStatus.Pause)}
            handleStart={() => handleStatusUpdate(AuctionLotStatus.Auctioning)}
            handleCancel={handleCancelAuction}
          />
          <div className='grid grid-cols-2 gap-4 mt-2'>
            <div className='p-3 bg-purple-500 rounded'>
              <div className='text-sm opacity-80'>Starting Price</div>
              <div className='text-2xl font-bold'>{parsePriceVND(startPrice)}</div>
            </div>
            <div className='p-3 bg-purple-500 rounded'>
              <div className='text-sm opacity-80'>Reduce Price</div>
              <div className='text-2xl font-bold'>{currentPrice ? parsePriceVND(currentPrice) : 'N/A'}</div>
            </div>
          </div>
          <div className='p-2 mt-4 text-center bg-purple-500 rounded'>
            <span className='text-lg'>
              Price Reduction: {calculatePriceReduction(startPrice, currentPrice || startPrice)}%
            </span>
          </div>
          {sortedSecretBids.map((bid) => (
            <div
              key={`${bid.customerId}-${bid.bidTime}`}
              className='flex justify-between p-2 my-4 mb-2 text-sm rounded bg-gray-50'
            >
              <span className='text-black'>{parseDate(bid.bidTime, 'dd/mm/yyyy hh:mm:ss')}</span>
              <span className='text-black'>
                {bid.customerId}: {bid.customerName}
              </span>
              <span className='text-black'>{parsePriceVND(bid.bidPrice)}</span>
            </div>
          ))}
        </div>
        <AuctionEndStatus />
      </>
    )
  }

  const SecretAuction = () => {
    return (
      <>
        <div className='p-4 text-white bg-blue-600 rounded-t-lg'>
          <h2 className='mb-2 text-2xl font-bold'>PRIVATE TOP BID</h2>
          <HeaderControls
            backgroundColor='bg-blue-500'
            status={statusLot}
            handlePause={() => handleStatusUpdate(AuctionLotStatus.Pause)}
            handleStart={() => handleStatusUpdate(AuctionLotStatus.Auctioning)}
            handleCancel={handleCancelAuction}
          />
          <p className='mt-2 text-4xl font-bold'>
            {sortedSecretBids[0]?.bidPrice ? (
              parsePriceVND(sortedSecretBids[0].bidPrice)
            ) : (
              <b className='text-xl'>No participants yet</b>
            )}
          </p>
        </div>
        <div className='mt-4'>
          {sortedSecretBids.map((bid) => (
            <div
              key={`${bid.customerId}-${bid.bidTime}`}
              className='flex justify-between p-2 mb-2 text-sm rounded bg-gray-50'
            >
              <span>{parseDate(bid.bidTime, 'dd/mm/yyyy hh:mm:ss')}</span>
              <span>
                {bid.customerId}: {bid.customerName}
              </span>
              <span>{parsePriceVND(bid.bidPrice)}</span>
            </div>
          ))}
          <AuctionEndStatus />
        </div>
      </>
    )
  }

  const FixedPriceAuction = () => {
    return (
      <>
        <div className='p-4 text-white bg-green-600 rounded-t-lg'>
          <h2 className='mb-2 text-2xl font-bold'>FIXED PRICE</h2>
          <HeaderControls
            backgroundColor='bg-green-500'
            status={statusLot}
            handlePause={() => handleStatusUpdate(AuctionLotStatus.Pause)}
            handleStart={() => handleStatusUpdate(AuctionLotStatus.Auctioning)}
            handleCancel={handleCancelAuction}
          />
          <p className='mt-2 text-4xl font-bold'>{itemLot.buyNowPrice ? parsePriceVND(itemLot.buyNowPrice) : 'N/A'}</p>
        </div>
        <div className='mt-4'>
          <h3 className='mb-2 text-lg font-semibold'>Interested Buyers</h3>
          {sortedFixedPriceBids.map((user) => (
            <div
              key={`${user.customerId}-${user.bidTime}`}
              className='flex items-center gap-3 p-3 mb-2 rounded bg-gray-50'
            >
              <div className='flex-1'>
                <div className='font-medium'>{user.customerName}</div>
                <div className='text-sm text-gray-500'>ID: {user.customerId}</div>
              </div>
              <div className='text-sm text-gray-500'>{parseDate(user.bidTime, 'dd/mm/yyyy hh:mm:ss')}</div>
            </div>
          ))}
          <AuctionEndStatus />
        </div>
      </>
    )
  }

  const renderBiddingContent = () => {
    switch (itemLot.lotType) {
      case 'Public_Auction':
        return <PublicAuction />
      case 'Auction_Price_GraduallyReduced':
        return <GraduallyReducedAuction />
      case 'Secret_Auction':
        return <SecretAuction />
      case 'Fixed_Price':
        return <FixedPriceAuction />
      default:
        return null
    }
  }

  return <div className='p-4 bg-white rounded-lg shadow-md h-[80vh] overflow-auto'>{renderBiddingContent()}</div>
}

export default LiveBidding
