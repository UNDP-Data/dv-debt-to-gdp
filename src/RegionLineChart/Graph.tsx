/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState } from 'react';
import { line, curveMonotoneX } from 'd3-shape';
import { scaleLinear } from 'd3-scale';
import { min, max } from 'd3-array';
import { format } from 'd3-format';
import UNDPColorModule from 'undp-viz-colors';
import styled from 'styled-components';
import { DebtGdp } from '../Types';

interface Props {
  data: DebtGdp[];
  indicator: string;
  option: string;
  svgWidth: number;
  svgHeight: number;
}

const XTickText = styled.text`
  font-size: 12px;
  @media (max-width: 980px) {
    font-size: 10px;
  }
  @media (max-width: 600px) {
    font-size: 9px;
  }
  @media (max-width: 420px) {
    display: none;
  }
`;

/// two lines for mean and median
export function Graph(props: Props) {
  const { data, option, indicator, svgWidth, svgHeight } = props;
  console.log('data', data);
  const indicatorName = `${indicator}Debt${option}`;
  console.log('indicator', indicatorName);
  /* const [hoveredCountry, setHoveredCountry] = useState<undefined | string>(
    undefined,
  ); */
  const margin = {
    top: 40,
    bottom: 50,
    left: 90,
    right: 90,
  };
  const graphWidth = svgWidth - margin.left - margin.right;
  const graphHeight = svgHeight - margin.top - margin.bottom;

  const valueArray: number[] = data.map((d: any) => Number(d[indicatorName]));

  const minParam = min(valueArray)
    ? (min(valueArray) as number) > 0
      ? 0
      : min(valueArray)
    : 0;
  const maxParam = max(valueArray) ? max(valueArray) : 0;
  console.log('minParam, maxParam', minParam, maxParam);
  const x = scaleLinear()
    .domain([2000, 2021]) /// change this!!!
    .range([0, graphWidth]);
  const y = scaleLinear()
    .domain([minParam as number, maxParam as number])
    .range([graphHeight, 0])
    .nice();

  const dateRange = [2000, 2021]; /// change this!!
  const lineShape1 = line()
    .defined((d: any) => d[indicatorName])
    .x((d: any) => x(d.year))
    .y((d: any) => y(d[indicatorName]))
    .curve(curveMonotoneX);
  const yTicks = y.ticks(5);
  const xTicks = dateRange;
  return (
    <div>
      {valueArray.length > 0 ? (
        <svg
          width='100%'
          height='100%'
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        >
          <g transform={`translate(${margin.left},${margin.top})`}>
            <line
              y1={y(0)}
              y2={y(0)}
              x1={-15}
              x2={graphWidth + 15}
              stroke='#212121'
              strokeWidth={1}
            />
            <text
              x={-25}
              y={y(0)}
              fill='#666'
              textAnchor='end'
              fontSize={12}
              dy={3}
            >
              0
            </text>
            <g>
              {yTicks.map((d, i) => (
                <g key={i}>
                  <line
                    y1={y(d)}
                    y2={y(d)}
                    x1={-15}
                    x2={graphWidth}
                    stroke='#AAA'
                    strokeWidth={1}
                    strokeDasharray='4,8'
                    opacity={d === 0 ? 0 : 1}
                  />
                  <text
                    x={-25}
                    y={y(d)}
                    fill='#666'
                    textAnchor='end'
                    fontSize={12}
                    dy={3}
                    opacity={d === 0 ? 0 : 1}
                  >
                    {Math.abs(d) < 1 ? d : format('~s')(d).replace('G', 'B')}
                  </text>
                </g>
              ))}
            </g>
            <g>
              {xTicks.map((d, i) => (
                <g key={i}>
                  <XTickText
                    y={graphHeight}
                    x={x(d)}
                    fill='#AAA'
                    textAnchor='middle'
                    fontSize={12}
                    dy={15}
                  >
                    {d}
                  </XTickText>
                </g>
              ))}
            </g>
            <g>
              <g>
                <path
                  d={lineShape1(data as any) as string}
                  fill='none'
                  stroke={UNDPColorModule.graphGray}
                  strokeWidth={2}
                />
              </g>
            </g>
          </g>
        </svg>
      ) : (
        <div className='center-area-error-el'>
          No data available for the countries selected
        </div>
      )}
    </div>
  );
}
