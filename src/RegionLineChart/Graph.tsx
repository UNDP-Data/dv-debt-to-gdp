/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import { line, curveMonotoneX } from 'd3-shape';
import { scaleLinear } from 'd3-scale';
import { min, max, extent } from 'd3-array';
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

/// two lines for mean and median
export function Graph(props: Props) {
  const { data, option, svgWidth, svgHeight } = props;
  console.log('data', data);
  // const indicatorName = `${indicator}Debt${option}`;
  // console.log('indicator', indicatorName);
  const indicators = ['total', 'external'];
  /* const [hoveredCountry, setHoveredCountry] = useState<undefined | string>(
    undefined,
  ); */
  const margin = { top: 20, right: 10, bottom: 50, left: 80 };
  const graphWidth = svgWidth - margin.left - margin.right;
  const graphHeight = svgHeight - margin.top - margin.bottom;

  const valueArray: number[] = data.map((d: any) =>
    Number(d[`totalDebt${option}`]),
  );

  const minParam = min(valueArray)
    ? (min(valueArray) as number) > 0
      ? 0
      : min(valueArray)
    : 0;
  const maxParam = max(valueArray) ? max(valueArray) : 0;
  const dateRange = extent(data.map((d: any) => Number(d.year)));

  const x = scaleLinear()
    .domain(dateRange as [number, number])
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
              {indicators.map((d, i) => (
                <g key={i}>
                  <path
                    d={
                      lineShape1(`${d}Debt${option}` as string)(
                        data as any,
                      ) as string
                    }
                    fill='none'
                    stroke={UNDPColorModule.graphGray}
                    strokeWidth={2}
                  />
                </g>
              ))}
            </g>
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
        <div className='center-area-error-el'>
          No data available for the countries selected
        </div>
      )}
    </div>
  );
}
