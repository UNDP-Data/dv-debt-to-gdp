/* eslint-disable no-console */
import { useEffect, useRef, useState } from 'react';
import { Select, Radio, RadioChangeEvent } from 'antd';
import styled from 'styled-components';
import { DebtGdp, CategoryData } from '../Types';
import { Graph } from './Graph';

interface Props {
  data: DebtGdp[];
  categories: CategoryData[];
}

const GraphDiv = styled.div`
  flex-grow: 1;
  height: 800px;
  @media (max-width: 960px) {
    height: 70vw;
    max-height: 31.25rem;
  }
`;
const meanMedianOptions = ['Mean', 'Median'];

export function RegionLineChart(props: Props) {
  const { data, categories } = props;
  const [meanMedianSelection, setMeanMedianSelection] = useState('Mean');
  const [categorySelection, setCategorySelection] = useState('All developing');
  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);
  const graphDiv = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (graphDiv.current) {
      setSvgHeight(graphDiv.current.clientHeight);
      setSvgWidth(graphDiv.current.clientWidth);
    }
  }, [graphDiv]);
  return (
    <GraphDiv ref={graphDiv}>
      <div>
        <div className='margin-bottom-05'>
          <div>
            <p className='label undp-typography'>Select a category</p>
            <Select
              options={categories.map(d => ({
                label: d.description,
                value: d.category,
              }))}
              className='undp-select'
              style={{ width: '100%' }}
              onChange={el => {
                setCategorySelection(el);
                console.log('categorySelection', el, categorySelection);
              }}
              value={categorySelection}
            />
          </div>
        </div>
      </div>
      <div className='chart-container'>
        <div className='flex-div flex-space-between flex-wrap margin-bottom-03'>
          <div>
            <h6 className='undp-typography margin-bottom-01'>
              General government debt as a percentage of GDP
            </h6>
            <p className='undp-typography small-font'>Years: 2000-2023</p>
          </div>
          <div>
            <Radio.Group
              defaultValue={meanMedianSelection}
              onChange={(el: RadioChangeEvent) =>
                setMeanMedianSelection(el.target.value)
              }
            >
              {meanMedianOptions.map((d, i) => (
                <Radio key={i} className='undp-radio' value={d}>
                  {d}
                </Radio>
              ))}
            </Radio.Group>
          </div>
        </div>
        {svgHeight && svgWidth ? (
          <Graph
            data={data.filter(d => d.region === categorySelection)}
            option={meanMedianSelection}
            svgWidth={svgWidth}
            svgHeight={svgHeight}
          />
        ) : null}
        <p className='source'>Source:</p>
      </div>
    </GraphDiv>
  );
}
