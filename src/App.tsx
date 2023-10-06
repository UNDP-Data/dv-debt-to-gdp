/* eslint-disable @typescript-eslint/no-explicit-any */
import { csv } from 'd3-fetch';
import { useEffect, useState } from 'react';
import { DebtGdp, CategoryData } from './Types';
import { RegionLineChart } from './RegionLineChart';
import './style.css';

function App() {
  const [debtToGdpData, setDebtToGdpData] = useState<DebtGdp[] | undefined>();
  const [categoriesData, setCategoriesData] = useState<
    CategoryData[] | undefined
  >(undefined);
  const dataurl =
  'https://raw.githubusercontent.com/UNDP-Data/dv-debt-to-gdp/main/public/data/';
  useEffect(() => {
    Promise.all([
      csv(`${dataurl}data/debtToGDPall.csv`),
      csv(`${dataurl}data/categories.csv`),
    ]).then(([data, categories]) => {
      setDebtToGdpData(data as any);
      setCategoriesData(categories as any);
    });
  }, []);
  return (
    <div className='undp-container'>
      {debtToGdpData && categoriesData ? (
        <RegionLineChart data={debtToGdpData} categories={categoriesData} />
      ) : null}
    </div>
  );
}

export default App;
