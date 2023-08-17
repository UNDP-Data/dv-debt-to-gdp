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
const totalExternalOptions = ['total', 'external'];
const meanMedianOptions = ['Mean', 'Median'];

export function RegionLineChart(props: Props) {
  const { data, categories } = props;
  const [meanMedianSelection, setMeanMedianSelection] = useState('Mean');
  const [totalExternalSelection, setTotalExternalSelection] = useState('total');
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
        <div className='flex-div flex-wrap'>
          <div>
            <p className='label undp-typography'>Select</p>
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
          <div>
            <p className='label undp-typography'>Select</p>
            <Select
              options={totalExternalOptions.map(option => ({
                label: option,
                value: option,
              }))}
              className='undp-select'
              style={{ width: '100%' }}
              onChange={el => setTotalExternalSelection(el)}
              value={totalExternalSelection}
            />
          </div>
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
      {svgHeight && svgWidth ? (
        <Graph
          data={data.filter(d => d.region === categorySelection)} /// filter data by category
          indicator={totalExternalSelection}
          option={meanMedianSelection}
          svgWidth={svgWidth}
          svgHeight={svgHeight}
        />
      ) : null}
    </GraphDiv>
  );
}
