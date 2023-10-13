/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { line, curveMonotoneX, area } from 'd3-shape';
import { scaleLinear } from 'd3-scale';
import { min, max } from 'd3-array';
// import { format } from 'd3-format';
import { axisBottom, axisLeft } from 'd3-axis';
import { select } from 'd3-selection';
import UNDPColorModule from 'undp-viz-colors';
import { DebtGdp } from '../Types';

interface Props {
  data: DebtGdp[];
  option: string;
  svgWidth: number;
  svgHeight: number;
}
/*
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
`; */
const colors = {
  Median: UNDPColorModule.categoricalColors.colors[0],
  Q1: UNDPColorModule.categoricalColors.colors[1],
  Q3: UNDPColorModule.categoricalColors.colors[1],
};
/// two lines for mean and median
export function Graph(props: Props) {
  const { data, option, svgWidth, svgHeight } = props;
  const indicators = ['Median', 'Q1', 'Q3'];
  const margin = { top: 20, right: 40, bottom: 50, left: 80 };
  const graphWidth = svgWidth - margin.left - margin.right;
  const graphHeight = svgHeight - margin.top - margin.bottom;
  const [hoveredYear, setHoveredYear] = useState<undefined | string>(undefined);
  const valueArray: number[] = data.map((d: any) =>
    Number(d[`${option}DebtQ3`]),
  );
  const minParam = min(valueArray)
    ? (min(valueArray) as number) > 0
      ? 0
      : min(valueArray)
    : 0;
  const maxParam = max(valueArray) ? max(valueArray) : 0;
  const dateDomain = option === 'total' ? [2000, 2023] : [2000, 2021];

  const x = scaleLinear()
    .domain(dateDomain as [number, number])
    .range([0, graphWidth]);
  const y = scaleLinear()
    .domain([minParam as number, maxParam as number])
    .range([graphHeight, 0])
    .nice();

  const yAxis = axisLeft(y as any)
    .tickSize(-graphWidth)
    .tickFormat((d: any) => `${d}%`);
  const xAxis = axisBottom(x)
    .tickSize(0)
    .tickSizeOuter(0)
    .tickPadding(6)
    .tickFormat((d: any) => `${d}`);
  const lineShape1 = (indicator: string) =>
    line()
      .defined((d: any) => d[indicator])
      .x((d: any) => x(d.year))
      .y((d: any) => y(d[indicator]))
      .curve(curveMonotoneX);
  const areaBetween = area()
    .x0((d: any) => x(d.year))
    .x1((d: any) => x(d.year))
    .y0((d: any) => y(d[`${option}DebtQ1`]))
    .y1((d: any) => y(d[`${option}DebtQ3`]))
    .curve(curveMonotoneX);

  useEffect(() => {
    const svg = select('#debtToGdpLine');
    svg.select('.yAxis').call(yAxis as any);
    svg.select('.xAxis').call(xAxis as any);
    svg.selectAll('.domain').remove();
    svg
      .selectAll('.yAxis text')
      .attr('dy', '-4px')
      .attr('x', '-4px')
      .attr('text-anchor', 'end');
  }, [option, data]);
  return (
    <div>
      {valueArray.length > 0 ? (
        <svg
          width='100%'
          height='100%'
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          id='debtToGdpLine'
        >
          <g transform={`translate(${margin.left},${margin.top})`}>
            <g className='xAxis' transform={`translate(0 ,${graphHeight})`} />
            <g className='yAxis' transform='translate(0,0)' />
            <g>
              <path
                d={
                  areaBetween(
                    data.filter(k => (k as any)[`${option}DebtMedian`]) as any,
                  ) as string
                }
                fill={(colors as any).Q1}
                strokeWidth={2}
                opacity='0.2'
              />
              {indicators.map((d, i) => (
                <g key={i}>
                  <path
                    d={
                      lineShape1(`${option}Debt${d}` as string)(
                        data as any,
                      ) as string
                    }
                    fill='none'
                    stroke={(colors as any)[d]}
                    strokeWidth={2}
                  />
                </g>
              ))}
            </g>
            <g className='overlay'>
              {data.map((d, i) => (
                <g
                  className='focus'
                  style={{ display: 'block' }}
                  key={i}
                  transform={`translate(${x(Number(d.year))},0)`}
                >
                  <line
                    x1={0}
                    y1={0}
                    x2={0}
                    y2={graphHeight}
                    stroke='#FFF'
                    strokeWidth={2}
                    opacity={hoveredYear === d.year ? 1 : 0}
                  />
                  {indicators.map((k, j) => (
                    <g
                      key={j}
                      transform={`translate(0,${y(
                        (d as any)[`${option}Debt${k}`],
                      )})`}
                      style={{
                        display:
                          (d as any)[`${option}Debt${k}`] !== ''
                            ? 'block'
                            : 'none',
                      }}
                    >
                      <circle
                        r={hoveredYear === d.year ? 5 : 3}
                        fill={(colors as any)[k]}
                      />
                      <text
                        x={-25}
                        y={-5}
                        opacity={hoveredYear === d.year ? 1 : 0}
                      >
                        {(d as any)[`${option}Debt${k}`]}%
                      </text>
                    </g>
                  ))}
                  <rect
                    onMouseEnter={() => {
                      setHoveredYear(d.year);
                    }}
                    onMouseLeave={() => {
                      setHoveredYear(undefined);
                    }}
                    x='-15px'
                    y={0}
                    width='30px'
                    height={svgHeight}
                    opacity={0}
                  />
                </g>
              ))}
            </g>
            <line
              x1={0}
              y1={graphHeight}
              x2={graphWidth}
              y2={graphHeight}
              stroke='#232E3D'
              strokeWidth={2}
            />
          </g>
          <text
            x={-graphHeight / 2}
            y='20'
            transform='rotate(-90)'
            textAnchor='middle'
          >
            Debt as % of GDP
          </text>
        </svg>
      ) : (
        <div className='center-area-error-el'>No data available</div>
      )}
    </div>
  );
}
