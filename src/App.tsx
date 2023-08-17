import { csv } from 'd3-fetch';
import { useEffect, useState } from 'react';
import { DebtGdp, CategoryData } from './Types';
import { RegionLineChart } from './RegionLineChart';

function App() {
  const [debtToGdpData, setDebtToGdpData] = useState<DebtGdp[] | undefined>();
  const [categoriesData, setCategoriesData] = useState<
    CategoryData[] | undefined
  >(undefined);
  useEffect(() => {
    Promise.all([
      csv('./data/debtToGdp.csv'),
      csv('./data/categories.csv'),
    ]).then(([data, categories]) => {
      setDebtToGdpData(data);
      setCategoriesData(categories);
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
