import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Calculator = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState([]);

  // Fetch previous operations from the server
  useEffect(() => {
    axios.get('http://localhost:5000/api/operations')
      .then((res) => setHistory(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleClick = (value) => {
    setInput((prev) => prev + value);
  };

  const clearInput = () => {
    setInput('');
    setResult('');
  };

  const calculate = () => {
    try {
      const evaluatedResult = eval(input).toString();
      setResult(evaluatedResult);

      // Save the operation to the backend
      axios.post('http://localhost:5000/api/operation', {
        expression: input,
        result: evaluatedResult,
      }).then(() => {
        // Refresh history after adding the new operation
        axios.get('http://localhost:5000/api/operations')
          .then((res) => setHistory(res.data));
      });

      setInput('');
    } catch (error) {
      setResult('Error');
    }
  };

  return (
    <div className="calculator">
      <div className="display">
        <input type="text" value={input} readOnly />
        <div className="result">{result}</div>
      </div>

      <div className="buttons">
        {[1, 2, 3, '+', 4, 5, 6, '-', 7, 8, 9, '*', 0, '.', '=', '/'].map((value) => (
          <button
            key={value}
            onClick={() => value === '=' ? calculate() : handleClick(value)}
          >
            {value}
          </button>
        ))}
        <button onClick={clearInput}>C</button>
      </div>

      <div className="history">
        <h2>History</h2>
        <ul>
          {history.map((operation) => (
            <li key={operation._id}>
              {operation.expression} = {operation.result}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Calculator;
