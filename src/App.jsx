import './App.css';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Collapse, IconButton } from '@mui/material';
import React, { useState, useEffect } from 'react';

import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

import dayjs from 'dayjs';
import axios from 'axios';


const App = () => {
  const [holdings, setHoldings] = useState([]);

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

  const renderRow = (holding) => (
    <TableRow key={holding.ticker}>
      <TableCell>{holding.name}</TableCell>
      <TableCell>{holding.ticker}</TableCell>
      <TableCell>{holding.asset_class}</TableCell>
      <TableCell>{holding.avg_price}</TableCell>
      <TableCell>{holding.market_price}</TableCell>
      <TableCell>{holding.latest_chg_pct}</TableCell>
      <TableCell>{holding.market_value_ccy}</TableCell>
    </TableRow>
  );

  const renderGroupedRows = () => {
    // Group holdings by asset_class
    const groupedHoldings = holdings.reduce((acc, holding) => {
      acc[holding.asset_class] = [...(acc[holding.asset_class] || []), holding];
      return acc;
    }, {});

    return Object.keys(groupedHoldings).map(assetClass => (
      <React.Fragment key={assetClass}>
        <TableRow className="groupHeader" onClick={() => toggleGroup(assetClass)}>
          <TableCell colSpan={7}>
            {assetClass} {/* Display asset class as group header */}
          </TableCell>
        </TableRow>
        {groupedHoldings[assetClass].map(holding => renderRow(holding))}
      </React.Fragment>
    ));
  };

  const toggleGroup = (assetClass) => {
    // Implement logic to toggle group expansion/collapse if desired
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Ticker</TableCell>
            <TableCell>Asset Class</TableCell>
            <TableCell>Average Price</TableCell>
            <TableCell>Market Price</TableCell>
            <TableCell>Latest Change Percentage</TableCell>
            <TableCell>Market Value (Base CCY)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {holdings.length > 0 ? renderGroupedRows() : <TableRow><TableCell colSpan={7}>Loading...</TableCell></TableRow>}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default App;
