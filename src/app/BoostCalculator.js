import React, { useMemo, useState } from 'react'
import Card from './components/Card'
import {
  displayValue,
  displayValueShort,
  parseValueString,
} from './utils/suffixes'
import Input from './components/Input'
import BoostTable from './BoostTable'
import { useThrottle } from 'ahooks'

const BoostCalculator = (props) => {
  const [targetChickenCountValue, setTargetChickenCount] = useState('')
  const unthrottledTargetChickenCount = useMemo(
    () => parseValueString(targetChickenCountValue),
    [targetChickenCountValue]
  )
  const targetChickenCount = useThrottle(unthrottledTargetChickenCount)

  const [unthrottledHatchRate, setInternalHatchRate] = useState(null)
  const internalHatchRate = useThrottle(unthrottledHatchRate)

  const [
    unthrottledMonocleBoostBonus,
    setMonocleBoostBonus,
  ] = useState(0)
  const monocleBoostBonus = useThrottle(
    unthrottledMonocleBoostBonus
  )

  const [dilithiumT2, setDilithiumT2] = useState(0)
  const [dilithiumT3, setDilithiumT3] = useState(0)
  const [dilithiumT4, setDilithiumT4] = useState(0)

  const [internalHatcheryCalm, setInternalHatcheryCalm] = useState(200)
  const [isOffline, setIsOffline] = useState(true)
  const [hasProPermit, setHasProPermit] = useState(true)

  const haveValues = !!(targetChickenCount && internalHatchRate)

  const hatchRate =
    haveValues &&
    (isOffline
      ? internalHatchRate * (1 + internalHatcheryCalm / 100)
      : internalHatchRate) * 4

  const dilithiumStoneMultiplier = Math.pow(1.03, dilithiumT2) * Math.pow(1.06, dilithiumT3) * Math.pow(1.08, dilithiumT4)

  return (
    <Card
      title="What boosts can I use?"
      subtitle="Includes November 22, 2021 boost price changes"
    >
      <div className="p-4 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-6">
          <label className="flex flex-col font-semibold">
            <div className="mb-2 dark:text-white text-opacity-80">
              Chickens Desired
            </div>
            <Input
              type="text"
              value={targetChickenCountValue}
              className={
                targetChickenCountValue &&
                !unthrottledTargetChickenCount &&
                'border-red-500'
              }
              onChange={({ target: { value } }) => setTargetChickenCount(value)}
              placeholder="4200, 10K, 5.2B, 6e9, …"
            />
            <div className="h-5 text-sm text-gray-500 mt-1 ml-2 font-normal">
              {unthrottledTargetChickenCount &&
                `${displayValue(
                  unthrottledTargetChickenCount
                )} (${displayValueShort(unthrottledTargetChickenCount)})`}
            </div>
          </label>

          <label className="flex flex-col">
            <div className="mb-2 dark:text-white text-opacity-80 font-semibold">
              Current Internal Hatch Rate
            </div>
            <div className="flex space-x-2">
              <Input
                type="number"
                className="flex-grow"
                placeholder="1, 2, 10, …"
                value={unthrottledHatchRate || ''}
                onChange={({ target: { value } }) =>
                  setInternalHatchRate(parseInt(value, 10) || null)
                }
              />{' '}
              <div className="flex items-center dark:text-white text-opacity-50">
                🐔 / hab / minute
              </div>
            </div>
          </label>

          <label className="flex flex-col">
            <div className="mb-2 dark:text-white text-opacity-80 font-semibold">
              Dilithium Monocle Boost Bonus
              <span className="uppercase bg-gray-100 dark:bg-gray-700 text-xs px-2 py-1 rounded-xl ml-2">
                Beta
              </span>
            </div>
            <div className="flex space-x-2">
              <div className="flex items-center dark:text-white text-opacity-50">
                +
              </div>
              <Input
                type="number"
                className="flex-grow"
                placeholder="1, 2, 10, …"
                value={unthrottledMonocleBoostBonus}
                onChange={({ target: { value } }) =>
                  setMonocleBoostBonus(parseInt(value, 10) || null)
                }
              />{' '}
              <div className="flex items-center dark:text-white text-opacity-50">
                % boost boost
              </div>
            </div>
          </label>

          <label className="flex flex-col">
            <div className="mb-2 dark:text-white text-opacity-80 font-semibold">
              Dilithium Stones
              <span className="uppercase bg-gray-100 dark:bg-gray-700 text-xs px-2 py-1 rounded-xl ml-2">
                Beta
              </span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12">
              <div className="flex space-x-2">
                <div className="flex items-center font-semibold	dark:text-white text-opacity-50">
                  T2
                </div>
                <Input
                  type="number"
                  className="flex-grow min-w-0 w-8"
                  placeholder="1, 2, 10, …"
                  min={0}
                  value={dilithiumT2}
                  onChange={({ target: { value } }) =>
                    setDilithiumT2(parseInt(value, 10) || 0)
                  }
                />{' '}
              </div>
              
              <div className="flex space-x-2">
                <div className="flex items-center font-semibold dark:text-white text-opacity-50">
                  T3
                </div>
                <Input
                  type="number"
                  className="flex-grow min-w-0 w-8"
                  placeholder="1, 2, 10, …"
                  min={0}
                  value={dilithiumT3}
                  onChange={({ target: { value } }) =>
                    setDilithiumT3(parseInt(value, 10) || 0)
                  }
                />{' '}
              </div>
              
              <div className="flex space-x-2">
                <div className="flex items-center font-semibold dark:text-white text-opacity-50">
                  T4
                </div>
                <Input
                  type="number"
                  className="flex-grow min-w-0 w-8"
                  placeholder="1, 2, 10, …"
                  min={0}
                  value={dilithiumT4}
                  onChange={({ target: { value } }) =>
                    setDilithiumT4(parseInt(value, 10) || 0)
                  }
                />{' '}
              </div>
            </div>
          </label>

          <div className="col-span-1 lg:col-span-2 grid grid-cols-1 lg:grid-cols-3 space-y-6 lg:space-y-0 lg:space-x-6">
            <label className="flex flex-col">
              <div className="mb-2 dark:text-white text-opacity-80 font-semibold">
                Internal Hatchery Calm
              </div>
              <div className="flex space-x-2">
                <input
                  type="range"
                  className="flex-grow"
                  value={internalHatcheryCalm}
                  min={0}
                  max={200}
                  step={10}
                  onChange={({ target: { value } }) =>
                    setInternalHatcheryCalm(value)
                  }
                />{' '}
                <div className="flex items-center justify-end dark:text-white text-opacity-50 w-12">
                  {internalHatcheryCalm}%
                </div>
              </div>
            </label>

            <div className="flex flex-col">
              <div className="mb-2 dark:text-white text-opacity-80 font-semibold">
                Offline
              </div>
              <div className="flex space-x-2">
                <div className="flex-grow flex items-center dark:text-white text-opacity-50 w-12">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={isOffline}
                      onChange={({ target: { checked } }) =>
                        setIsOffline(checked)
                      }
                    />
                    <span>Away from farm</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="mb-2 dark:text-white text-opacity-80 font-semibold">
                Pro Permit
              </div>
              <div className="flex space-x-2">
                <div className="flex-grow flex items-center dark:text-white text-opacity-50 w-12">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={hasProPermit}
                      onChange={({ target: { checked } }) =>
                        setHasProPermit(checked)
                      }
                    />
                    <span>Have Pro Permit</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {haveValues && (
          <BoostTable
            target={targetChickenCount}
            hatchRate={hatchRate}
            hasProPermit={hasProPermit}
            monocleBoostBonus={monocleBoostBonus}
            dilithiumStoneMultiplier = {dilithiumStoneMultiplier}
          />
        )}
      </div>
    </Card>
  )
}

BoostCalculator.propTypes = {}

export default BoostCalculator
