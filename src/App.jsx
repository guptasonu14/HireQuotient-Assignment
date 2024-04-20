import './App.css';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import axios from 'axios';

const App = () => {
  const [holdings, setHoldings] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState({});

  useEffect(() => {
    // Fetch holdings data from API
    axios.get('https://canopy-frontend-task.now.sh/api/holdings')
      .then(response => {
        setHoldings(response.data.payload);
      })
      .catch(error => {
        console.error('Error fetching holdings:', error);
      });
  }, []);

  const renderRow = (holding, index) => (
    <TableRow key={holding.ticker} className={`colorClasses ${index % 2 === 0 ? '' : 'odd'}`}>
      <TableCell>{holding.name}</TableCell>
      <TableCell>{holding.ticker}</TableCell>
      <TableCell>{holding.avg_price}</TableCell>
      <TableCell>{holding.market_price}</TableCell>
      <TableCell>{holding.latest_chg_pct}</TableCell>
      <TableCell>{holding.market_value_ccy}</TableCell>
    </TableRow>
  );

  const toggleGroup = (assetClass) => {
    setExpandedGroups(prevState => ({
      ...prevState,
      [assetClass]: !prevState[assetClass] 
    }));
  };

  const renderGroupedRows = () => {
   
    const groupedHoldings = holdings.reduce((acc, holding) => {
      acc[holding.asset_class] = [...(acc[holding.asset_class] || []), holding];
      return acc;
    }, {});

    return Object.keys(groupedHoldings).map(assetClass => (
      <React.Fragment key={assetClass}>
        <TableRow className="groupHeader" onClick={() => toggleGroup(assetClass)}>
          <TableCell colSpan={7}>
            {expandedGroups[assetClass] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            {assetClass} ({groupedHoldings[assetClass].length})
          </TableCell>
        </TableRow>
        {expandedGroups[assetClass] &&
          <React.Fragment>
            <TableRow>
              <TableCell colSpan={7}> 
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>NAME OF THE HOLDING</TableCell>
                      <TableCell>TICKER</TableCell>
                      <TableCell>AVERAGE PRICE</TableCell>
                      <TableCell>MARKET PRICE</TableCell>
                      <TableCell>LATEST CHANGE PERCENTAGE</TableCell>
                      <TableCell>MARKET VALUE IN BASE CCY</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {groupedHoldings[assetClass].map((holding, index) => renderRow(holding, index))}
                  </TableBody>
                </Table>
              </TableCell>
            </TableRow>
          </React.Fragment>
        }
      </React.Fragment>
    ));
  };

  return (
    <TableContainer component={Paper} className="paperContainer">
      <Table>
        <TableBody>
          {holdings.length > 0 ? renderGroupedRows() : <TableRow><TableCell colSpan={7}>Loading...</TableCell></TableRow>}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default App;
