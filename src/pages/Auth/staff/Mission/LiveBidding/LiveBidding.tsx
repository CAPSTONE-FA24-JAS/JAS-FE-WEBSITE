import React, { useEffect, useId, useState } from 'react'
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
  const [statusLot, setStatusLot] = useState<string>(() => status || '')
  const [updateStatusLot] = useOpenAndPauseLotMutation()
  const [cancelLot] = useCancelLotMutation()
  const id = useId()

  const { data: winnerData } = useGetWinnerForLotQuery(itemLot.id, {
    skip: itemLot.status !== 'Sold' && itemLot.status !== 'Passed'
  })

  useEffect(() => {
    setStatusLot(status || '')
  }, [status])

  const calculatePriceReduction = (startPrice: number, currentPrice: number): string => {
    const reduction = ((startPrice - currentPrice) / startPrice) * 100
    return reduction.toFixed(1)
  }

  const handlePause = () => {
    updateStatusLot({ lotid: itemLot.id, status: AuctionLotStatus.Pause }).then((res) => {
      if (res.data?.code === 200) {
        setStatusLot('Pause')
      }
    })
  }

  const handleStart = () => {
    updateStatusLot({ lotid: itemLot.id, status: AuctionLotStatus.Auctioning }).then((res) => {
      if (res.data?.code === 200) {
        setStatusLot('Auctioning')
      }
    })
  }

  const handleCancel = () => {
    cancelLot(itemLot.id).then((res) => {
      if (res.data?.code === 200) {
        setStatusLot('Canceled')
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

  const renderPublicAuction = () => {
    const isAuctionEndSold = itemLot.status === 'Sold'
    const isAuctionEndPassed = itemLot.status === 'Passed'
    const topBid = sortBidsByTime.length
      ? sortBidsByTime.filter((bid) => bid.status === 'Success')[0] || sortBidsByTime[0]
      : null

    return (
      <>
        <div className='p-4 text-white bg-red-600 rounded-t-lg'>
          <h2 className='mb-4 text-2xl font-bold text-gray-800'>
            {isAuctionEndSold ? 'The winner is:' : isAuctionEndPassed ? 'No winner' : 'Top bid:'}
          </h2>
          {!isAuctionEndPassed && topBid && (
            <div className='p-4 bg-red-300 rounded-lg shadow-md'>
              <div className='mb-2 text-lg font-semibold text-gray-700'>
                <span className='text-red-500'>Id: {topBid.customerId}</span>
                <span className='ml-2'>
                  {topBid.firstName} {topBid.lastName}
                </span>
              </div>
              <div className='text-xl font-bold text-green-600'>{parsePriceVND(topBid.currentPrice)}</div>
            </div>
          )}

          <HeaderControls
            backgroundColor='bg-red-500'
            status={statusLot}
            handlePause={handlePause}
            handleStart={handleStart}
            handleCancel={handleCancel}
          />
        </div>
        <div className='p-4 bg-gray-100 rounded-b-lg'>
          {sortBidsByTime.length > 0 ? (
            sortBidsByTime.map((bid) => (
              <div
                key={id}
                className={`flex justify-between items-center p-3 mb-2 rounded-lg shadow ${
                  bid.status === 'Processing'
                    ? 'bg-yellow-100'
                    : bid.status === 'Accepted'
                    ? 'bg-green-100'
                    : bid.status === 'Rejected'
                    ? 'bg-red-100'
                    : 'bg-white'
                }`}
              >
                <span className='flex-1 text-left text-gray-600'>{parseDate(bid.bidTime, 'dd/mm/yyyy hh:mm:ss')}</span>
                <span className='flex-1 font-medium text-left text-gray-700'>
                  {bid.customerId}: {bid.firstName} {bid.lastName}
                </span>
                <span className='flex-1 font-bold text-right text-green-600'>${bid.currentPrice}</span>
                <span className='flex-1 font-semibold text-center text-gray-700'>
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
  }

  const renderGraduallyReducedAuction = () => {
    const startPrice = itemLot.startPrice || 0

    return (
      <>
        <div className='p-4 text-white bg-purple-600 rounded-t-lg'>
          <HeaderControls
            backgroundColor='bg-purple-500'
            status={statusLot}
            handlePause={handlePause}
            handleStart={handleStart}
            handleCancel={handleCancel}
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
        </div>

        {renderAuctionEndStatus()}
      </>
    )
  }

  const renderSecretAuction = () => {
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
            handleCancel={handleCancel}
          />
          <p className='mt-2 text-4xl font-bold'>
            {secretBids?.[0]?.bidPrice ? (
              secretBids[0].bidPrice.toLocaleString('vn-vi', {
                style: 'currency',
                currency: 'VND'
              })
            ) : (
              <b className='text-xl'>No participants yet</b>
            )}
          </p>
        </div>
        <div className='mt-4'>
          {secretBids.map((bid) => (
            <div key={id} className='flex justify-between p-2 mb-2 text-sm rounded bg-gray-50'>
              <span>{parseDate(bid.bidTime, 'dd/mm/yyyy hh:mm:ss')}</span>
              <span>
                {bid.customerId}: {bid.customerName}
              </span>
              <span>${bid.bidPrice}</span>
            </div>
          ))}

          {renderAuctionEndStatus()}
        </div>
      </>
    )
  }

  const renderFixedPriceAuction = () => {
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
            handleCancel={handleCancel}
          />
          <p className='mt-2 text-4xl font-bold'>{itemLot.buyNowPrice ? parsePriceVND(itemLot.buyNowPrice) : 'N/A'}</p>
        </div>
        <div className='mt-4'>
          <h3 className='mb-2 text-lg font-semibold'>Interested Buyers</h3>
          {fixedPrice.map((user) => (
            <div key={id} className='flex items-center gap-3 p-3 mb-2 rounded bg-gray-50'>
              <div className='flex-1'>
                <div className='font-medium'>{user.customerName}</div>
                <div className='text-sm text-gray-500'>ID: {user.customerId}</div>
              </div>
              <div className='text-sm text-gray-500'>{parseDate(user.bidTime, 'dd/mm/yyyy hh:mm:ss')}</div>
            </div>
          ))}

          {renderAuctionEndStatus()}
        </div>
      </>
    )
  }

  const renderAuctionEndStatus = () => {
    if (isEndAuction) {
      return (
        <div className='p-4 text-center bg-purple-100'>
          <h3 className='text-xl font-bold'>Auction Ended</h3>
          <p>Winner: {winnerCustomer}</p>
          <p>Winning Price: ${winnerPrice}</p>
        </div>
      )
    }

    if (itemLot.status === 'Sold' && winnerData?.data?.[0]) {
      return (
        <div className='p-4 text-center bg-purple-100'>
          <h3 className='text-xl font-bold'>Auction Ended</h3>
          <p>
            Winner: {winnerData.data[0].customer.firstName} {winnerData.data[0].customer.lastName}
          </p>
          <p>Winning Price: ${winnerData.data[0].currentPrice}</p>
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

  const renderBiddingContent = () => {
    switch (itemLot.lotType) {
      case 'Public_Auction':
        return renderPublicAuction()
      case 'Auction_Price_GraduallyReduced':
        return renderGraduallyReducedAuction()
      case 'Secret_Auction':
        return renderSecretAuction()
      case 'Fixed_Price':
        return renderFixedPriceAuction()
      default:
        return null
    }
  }

  return <div className='p-4 bg-white rounded-lg shadow-md h-[80vh] overflow-auto'>{renderBiddingContent()}</div>
}

export default LiveBidding
