import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement } from '../../store/counterSlice';
import './Counter.css';

const Counter = () => {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div className="counter">
      <h2>Счетчик: {count}</h2>
      <div className="counter-controls">
        <button onClick={() => dispatch(decrement())}>-</button>
        <button onClick={() => dispatch(increment())}>+</button>
      </div>
    </div>
  );
};

export default Counter; 