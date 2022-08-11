import type { FC } from 'react';
import type { RootState } from '../../app/store'
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment, incrementByAmount,incrementAsync } from './counterSlice'

export const Counter: FC = () => {
  const count = useSelector((state: RootState) => state.counter.value)
  const dispatch = useDispatch()

  return (
    <div>
      <div>
        <button
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          Increment
        </button>
        <span>{count}</span>
        
        <button
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          Decrement
        </button>

        <button
        aria-label="Increment by amount value"
          onClick={() => dispatch(incrementByAmount(10))}
        >
          Increment by amount
        </button>
        
        <button
          aria-label="Increment async value"
          onClick={() => dispatch(incrementAsync())}
        >
          Increment async
        </button>

      </div>
    </div>
  )
}