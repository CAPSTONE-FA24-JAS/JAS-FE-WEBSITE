import React, { useState } from 'react'
import { CaretRightOutlined, PauseOutlined } from '@ant-design/icons'
import { Message } from '../../../../../hooks/useBidding'
import { AuctionLotStatus, LotDetail, PLayerInLot } from '../../../../../types/Lot.type'
import { parseDate } from '../../../../../utils/convertTypeDayjs'
import { useGetWinnerForLotQuery, useUpdateStatusLotMutation } from '../../../../../services/lot.services'

interface HeaderControlsProps {
  backgroundColor: string
  status: AuctionLotStatus
  handlePause: () => void
  handleStart: () => void
  statusLot12?: string
}

const HeaderControls: React.FC<HeaderControlsProps> = ({ backgroundColor, status, handlePause, handleStart }) => {
  console.log('statuslot', status)

  const isDiableBtn =
    status === AuctionLotStatus.Canceled ||
    status === AuctionLotStatus.Sold ||
    status === AuctionLotStatus.Passed ||
    status === AuctionLotStatus.Waiting ||
    status === AuctionLotStatus.Ready
  return (
    <div className='flex justify-between py-1'>
      <div className='flex gap-2'>
        <button
          disabled={isDiableBtn}
          className={`flex items-center justify-center p-2 text-center ${backgroundColor} rounded-3xl`}
          onClick={() => {
            handlePause()
          }}
        >
          <PauseOutlined style={{ fontSize: '20px' }} />
        </button>
        <button
          disabled={isDiableBtn}
          className={`flex items-center justify-center p-2 text-center ${backgroundColor} rounded-3xl `}
          onClick={() => handleStart()}
        >
          <CaretRightOutlined style={{ fontSize: '20px' }} />
        </button>
      </div>
      <div className='text-sm'>
        Status:{' '}
        {status === AuctionLotStatus.Auctioning
          ? 'Running'
          : status === AuctionLotStatus.Canceled
          ? 'Canceled'
          : status === AuctionLotStatus.Pause
          ? 'Pause'
          : 'Waiting'}
      </div>
    </div>
  )
}

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
  const [statusLot, setStatusLot] = useState<AuctionLotStatus>(Number(status) ? Number(status) : 9)

  const calculatePriceReduction = (startPrice: number, currentPrice: number): string => {
    const reduction = ((startPrice - currentPrice) / startPrice) * 100
    return reduction.toFixed(1)
  }

  const [updateStatusLot] = useUpdateStatusLotMutation()

  const handlePause = () => {
    updateStatusLot({ lotid: itemLot.id, status: AuctionLotStatus.Pause }).then((res) => {
      if (res.data?.code === 200) {
        setStatusLot(AuctionLotStatus.Pause)
      }
    })
  }

  const handleStart = () => {
    updateStatusLot({ lotid: itemLot.id, status: AuctionLotStatus.Auctioning }).then((res) => {
      if (res.data?.code === 200) {
        setStatusLot(AuctionLotStatus.Auctioning)
      }
    })
  }

  const sortBidsByTime =
    Array.isArray(bids) && bids.length > 0
      ? bids.sort((a, b) => {
          const timediff = +new Date(b.bidTime) - +new Date(a.bidTime)
          if (timediff === 0) {
            return b.currentPrice - a.currentPrice
          }
          return timediff
        })
      : []

  const renderBiddingContent = () => {
    switch (itemLot.lotType) {
      case 'Public_Auction':
        const isAuctionEndSold = itemLot.status === 'Sold'
        const isAuctionEndPassed = itemLot.status === 'Passed'

        const topBid =
          Array.isArray(sortBidsByTime) && sortBidsByTime.length
            ? sortBidsByTime.filter((bid) => bid.status === 'Success')[0] || sortBidsByTime[0]
            : null
        return (
          <>
            <div className='p-4 text-white bg-red-600 rounded-t-lg'>
              <h2 className='mb-4 text-2xl font-bold text-gray-800'>
                {isAuctionEndSold ? 'The winner is:' : isAuctionEndPassed ? 'No winner' : 'Top bid:'}
              </h2>
              {!isAuctionEndPassed && Array.isArray(sortBidsByTime) && sortBidsByTime.length ? (
                <div className='p-4 bg-red-300 rounded-lg shadow-md'>
                  <div className='mb-2 text-lg font-semibold text-gray-700'>
                    <span className='text-red-500'>Id: {topBid?.customerId}</span>
                    <span className='ml-2'>
                      {topBid?.firstName} {topBid?.lastName}
                    </span>
                  </div>
                  <div className='text-xl font-bold text-green-600'>${topBid?.currentPrice}</div>
                </div>
              ) : (
                ''
              )}

              <HeaderControls
                backgroundColor='bg-red-500'
                status={statusLot}
                handlePause={handlePause}
                handleStart={handleStart}
              />
            </div>
            <div className='p-2 mt-4'>
              {Array.isArray(sortBidsByTime) && sortBidsByTime.length > 0 ? (
                bids.map((bid, index) => (
                  <div
                    key={index}
                    className={`flex justify-between p-2 mb-1 text-sm ${
                      bid.status === 'Processing'
                        ? 'bg-yellow-100'
                        : bid.status === 'Accepted'
                        ? 'bg-green-100'
                        : bid.status === 'Rejected'
                        ? 'bg-red-100'
                        : ''
                    }`}
                  >
                    <span>{parseDate(bid.bidTime, 'dd/mm/yyy hh/mm/ss')}</span>
                    <span>
                      {bid.customerId}: {bid.firstName} {bid.lastName}
                    </span>
                    <span>${bid.currentPrice}</span>
                    <span className='font-semibold'>
                      {bid.status === 'Processing'
                        ? 'Pending'
                        : bid.status === 'Success'
                        ? 'Success'
                        : bid.status === 'Failed'
                        ? 'Failed'
                        : bid.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className='text-center text-gray-500'>No bids yet</div>
              )}
            </div>
          </>
        )

      case 'Auction_Price_GraduallyReduced':
        const { data } = useGetWinnerForLotQuery(itemLot.id, {
          skip: itemLot.status !== 'Sold' && itemLot.status !== 'Passed'
        })
        const startPrice = itemLot.startPrice || 0
        console.log('current price', currentPrice)

        return (
          <>
            <div className='p-4 text-white bg-purple-600 rounded-t-lg'>
              <HeaderControls
                backgroundColor='bg-purple-500'
                status={statusLot}
                handlePause={handlePause}
                handleStart={handleStart}
              />
              <div className='grid grid-cols-2 gap-4 mt-2'>
                <div className='p-3 bg-purple-500 rounded'>
                  <div className='text-sm opacity-80'>Starting Price</div>
                  <div className='text-2xl font-bold'>${startPrice}</div>
                </div>
                <div className='p-3 bg-purple-500 rounded'>
                  <div className='text-sm opacity-80'>Reduce Price</div>
                  <div className='text-2xl font-bold'>
                    {currentPrice?.toLocaleString('vn-vi', {
                      style: 'currency',
                      currency: 'VND'
                    }) || 'N/A'}
                  </div>
                </div>
              </div>
              <div className='p-2 mt-4 text-center bg-purple-500 rounded'>
                <span className='text-lg'>
                  Price Reduction: {calculatePriceReduction(startPrice, currentPrice || startPrice)}%
                </span>
              </div>
            </div>

            {isEndAuction && (
              <div className='p-4 text-center bg-purple-100'>
                <h3 className='text-xl font-bold'>Auction Ended</h3>
                <p>Winner: {winnerCustomer}</p>
                <p>Winning Price: ${winnerPrice}</p>
              </div>
            )}

            {itemLot.status === 'Sold' && data ? (
              <div className='p-4 text-center bg-purple-100'>
                <h3 className='text-xl font-bold'>Auction Ended</h3>
                <p>
                  Winner: {data.data[0].customer.firstName} {data.data[0].customer.lastName}
                </p>
                <p>Winning Price: ${data.data[0].currentPrice}</p>
              </div>
            ) : (
              <div>
                <div className='p-4 text-center bg-purple-100'>
                  <h3 className='text-xl font-bold'>Auction Ended</h3>
                  <p>No winner for this auction.</p>
                </div>
              </div>
            )}
          </>
        )

      case 'Secret_Auction':
        const secretBids = [...(playerInLot || [])].sort((a, b) => b.bidPrice - a.bidPrice)
        return (
          <>
            <div className='p-4 text-white bg-blue-600 rounded-t-lg'>
              <h2 className='mb-2 text-2xl font-bold'>PRIVATE TOP BID</h2>
              <HeaderControls
                backgroundColor='bg-blue-500'
                status={statusLot}
                handlePause={handlePause}
                handleStart={handleStart}
              />
              <p className='mt-2 text-4xl font-bold'>
                {secretBids?.[0]?.bidPrice
                  ? secretBids[0].bidPrice.toLocaleString('vn-vi', {
                      style: 'currency',
                      currency: 'VND'
                    })
                  : 'N/A'}
              </p>
            </div>
            <div className='mt-4'>
              {secretBids.map((bid, index) => (
                <div key={index} className='flex justify-between p-2 mb-2 text-sm rounded bg-gray-50'>
                  <span>{parseDate(bid.bidTime, 'dd/mm/yyy hh/mm/ss')}</span>
                  <span>
                    {bid.customerId}: {bid.customerName}
                  </span>
                  <span>${bid.bidPrice}</span>
                </div>
              ))}
            </div>
          </>
        )

      case 'Fixed_Price':
        const fixedPrice = [...(playerInLot || [])].sort((a, b) => +new Date(a.bidTime) - +new Date(b.bidTime))
        return (
          <>
            <div className='p-4 text-white bg-green-600 rounded-t-lg'>
              <h2 className='mb-2 text-2xl font-bold'>FIXED PRICE</h2>
              <HeaderControls
                backgroundColor='bg-green-500'
                status={statusLot}
                handlePause={handlePause}
                handleStart={handleStart}
              />
              <p className='mt-2 text-4xl font-bold'>
                {itemLot.buyNowPrice
                  ? itemLot.buyNowPrice.toLocaleString('vn-vi', {
                      style: 'currency',
                      currency: 'VND'
                    })
                  : 'N/A'}
              </p>
            </div>
            <div className='mt-4'>
              <h3 className='mb-2 text-lg font-semibold'>Interested Buyers</h3>
              {fixedPrice.map((user, index) => (
                <div key={index} className='flex items-center gap-3 p-3 mb-2 rounded bg-gray-50'>
                  <div className='flex-1'>
                    <div className='font-medium'>{user.customerName}</div>
                    <div className='text-sm text-gray-500'>ID: {user.customerId}</div>
                  </div>
                  <div className='text-sm text-gray-500'>{parseDate(user.bidTime, 'dd/mm/yyy hh/mm/ss')}</div>
                </div>
              ))}
            </div>
          </>
        )

      default:
        return null
    }
  }

  return <div className='p-4 bg-white rounded-lg shadow-md h-[80vh] overflow-auto'>{renderBiddingContent()}</div>
}

export default LiveBidding
