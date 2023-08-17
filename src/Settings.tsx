import { useContext, useState } from 'react';
import { Select, Checkbox, Slider, Radio } from 'antd';
import domtoimage from 'dom-to-image';
import { CtxDataType, IndicatorMetaDataType } from '../Types';
import Context from '../Context/Context';
import {
  DEFAULT_END_YEAR,
  DEFAULT_START_YEAR,
  DEFAULT_VALUES,
  INCOME_GROUPS,
} from '../Constants';
import { ChevronDown, ChevronLeft } from '../Icons';

interface Props {
  indicators: IndicatorMetaDataType[];
  regions: string[];
  countries: string[];
}

export function Settings(props: Props) {
  const { indicators, regions, countries } = props;
  const {
    graphType,
    xAxisIndicator,
    selectedCountries,
    selectedIncomeGroups,
    selectedRegions,
    showLabel,
    sorting,
    filterStartYear,
    filterEndYear,
    reverseOrder,
    updateXAxisIndicator,
    updateSelectedRegions,
    updateSelectedCountries,
    updateSelectedIncomeGroups,
    updateShowSource,
    updateShowLabel,
    updateReverseOrder,
    verticalBarLayout,
    updateBarLayout,
    dataListCountry,
    updateDataListCountry,
    updateFilterStartYear,
    updateFilterEndYear,
    updateSorting,
  } = useContext(Context) as CtxDataType;
  const options = indicators.filter(d => d.isCategorical).map(d => d.Indicator);
  const [settingExpanded, setSettingsExpanded] = useState(true);
  const [filterExpanded, setFilterExpanded] = useState(true);
  return (
    <div className='undp-scrollbar settings-container'>
      {graphType !== 'dataList' ? (
        <>
          <div className='settings-sections-container'>
            <div className='settings-sections-options-container'>
              <div className='settings-option-div'>
                <p className='label'>Primary Indicator</p>
                <Select
                  showSearch
                  className='undp-select'
                  placeholder='Please select'
                  maxTagCount='responsive'
                  value={xAxisIndicator}
                  onChange={d => {
                    updateXAxisIndicator(d);
                  }}
                  defaultValue={DEFAULT_VALUES.firstMetric}
                >
                  {options.map(d => (
                    <Select.Option className='undp-select-option' key={d}>
                      {d}
                    </Select.Option>
                  ))}
                </Select>
              </div>
              <div className='flex-div flex-wrap'>
                <button
                  className='undp-button button-primary'
                  type='button'
                  onClick={() => {
                    updateShowSource(true);
                  }}
                >
                  Download Data
                </button>
                <button
                  className='undp-button button-secondary'
                  type='button'
                  onClick={() => {
                    const node = document.getElementById(
                      'graph-node',
                    ) as HTMLElement;
                    domtoimage
                      .toPng(node, { height: node.scrollHeight })
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      .then((dataUrl: any) => {
                        const link = document.createElement('a');
                        link.download = 'graph.png';
                        link.href = dataUrl;
                        link.click();
                      });
                  }}
                >
                  Download Graph
                </button>
              </div>
            </div>
          </div>
          {graphType !== 'trendLines' ? (
            <div className='settings-sections-container'>
              <button
                type='button'
                aria-label='Expand or collapse settings'
                className='settings-sections-container-title'
                onClick={() => {
                  setSettingsExpanded(!settingExpanded);
                }}
              >
                <div>
                  {settingExpanded ? (
                    <ChevronDown fill='#212121' size={24} />
                  ) : (
                    <ChevronLeft fill='#212121' size={24} />
                  )}
                </div>
                <h6 className='undp-typography margin-bottom-00'>
                  Settings & Options
                </h6>
              </button>
              <div
                className='settings-sections-options-container'
                style={{ display: settingExpanded ? 'flex' : 'none' }}
              >
                {graphType === 'tableView' ? (
                  <div>
                    <p className='label'>Sort By</p>
                    <Radio.Group
                      value={sorting}
                      onChange={d => {
                        updateSorting(d.target.value);
                      }}
                    >
                      <Radio className='undp-radio' value='country'>
                        Country Name
                      </Radio>
                      <Radio className='undp-radio' value='region'>
                        Regions
                      </Radio>
                    </Radio.Group>
                  </div>
                ) : null}
                {graphType === 'multiCountryTrendLine' ? (
                  <Checkbox
                    style={{ margin: 0 }}
                    className='undp-checkbox'
                    checked={showLabel}
                    onChange={e => {
                      updateShowLabel(e.target.checked);
                    }}
                  >
                    Show Labels
                  </Checkbox>
                ) : null}
                {graphType === 'barGraph' ? (
                  <>
                    <Checkbox
                      style={{ margin: 0 }}
                      className='undp-checkbox'
                      checked={!verticalBarLayout}
                      onChange={e => {
                        updateBarLayout(!e.target.checked);
                      }}
                    >
                      Show Horizontal
                    </Checkbox>
                    <Checkbox
                      style={{ margin: 0 }}
                      className='undp-checkbox'
                      disabled={!verticalBarLayout}
                      checked={reverseOrder}
                      onChange={e => {
                        updateReverseOrder(e.target.checked);
                      }}
                    >
                      Show Largest First
                    </Checkbox>
                  </>
                ) : null}
              </div>
            </div>
          ) : null}
          <div className='settings-sections-container'>
            <button
              type='button'
              aria-label='Expand or collapse filters'
              className='settings-sections-container-title'
              onClick={() => {
                setFilterExpanded(!filterExpanded);
              }}
            >
              <div>
                {filterExpanded ? (
                  <ChevronDown fill='#212121' size={24} />
                ) : (
                  <ChevronLeft fill='#212121' size={24} />
                )}
              </div>
              <h6 className='undp-typography margin-bottom-00'>
                Filter or Highlight By
              </h6>
            </button>
            <div
              className='settings-sections-options-container'
              style={{ display: filterExpanded ? 'flex' : 'none' }}
            >
              {graphType === 'trendLines' ||
              graphType === 'multiCountryTrendLine' ? (
                <div className='settings-option-div'>
                  <p className='label'>
                    Years: {filterStartYear} - {filterEndYear}
                  </p>
                  <Slider
                    className='undp-slider'
                    range
                    step={1}
                    min={2000}
                    max={new Date().getFullYear()}
                    defaultValue={[DEFAULT_START_YEAR, DEFAULT_END_YEAR]}
                    onAfterChange={d => {
                      updateFilterStartYear(d[0]);
                      updateFilterEndYear(d[1]);
                    }}
                  />
                </div>
              ) : null}
              <div className='settings-option-div'>
                <p className='label'>Region</p>
                <Select
                  mode='multiple'
                  allowClear
                  style={{ width: '100%' }}
                  maxTagCount='responsive'
                  clearIcon={<div className='clearIcon' />}
                  className='undp-select'
                  placeholder='Filter By Regions'
                  value={selectedRegions}
                  onChange={(d: string[]) => {
                    updateSelectedRegions(d);
                  }}
                >
                  {regions.map(d => (
                    <Select.Option className='undp-select-option' key={d}>
                      {d}
                    </Select.Option>
                  ))}
                </Select>
              </div>
              <div className='settings-option-div'>
                <p className='label'>Income Group</p>
                <Select
                  className='undp-select'
                  mode='multiple'
                  maxTagCount='responsive'
                  allowClear
                  clearIcon={<div className='clearIcon' />}
                  style={{ width: '100%' }}
                  placeholder='Filter By Income Group'
                  value={selectedIncomeGroups}
                  onChange={(d: string[]) => {
                    updateSelectedIncomeGroups(d);
                  }}
                >
                  {INCOME_GROUPS.map(d => (
                    <Select.Option className='undp-select-option' key={d}>
                      {d}
                    </Select.Option>
                  ))}
                </Select>
              </div>
              {graphType === 'trendLines' || graphType === 'barGraph' ? (
                <div className='settings-option-div'>
                  <p className='label'>Countries</p>
                  <Select
                    className='undp-select'
                    mode='multiple'
                    maxTagCount='responsive'
                    allowClear
                    clearIcon={<div className='clearIcon' />}
                    style={{ width: '100%' }}
                    value={selectedCountries}
                    placeholder='Filter By Countries'
                    onChange={(d: string[]) => {
                      updateSelectedCountries(d);
                    }}
                  >
                    {countries.map(d => (
                      <Select.Option className='undp-select-option' key={d}>
                        {d}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
              ) : null}
            </div>
          </div>
        </>
      ) : (
        <div className='settings-sections-container'>
          <div className='settings-sections-options-container'>
            <div className='settings-option-div'>
              <div className='settings-option-div'>
                <p className='label'>Select a Country</p>
                <Select
                  showSearch
                  className='undp-select'
                  placeholder='Please select a country'
                  value={dataListCountry}
                  onChange={d => {
                    updateDataListCountry(d);
                  }}
                >
                  {countries.map(d => (
                    <Select.Option className='undp-select-option' key={d}>
                      {d}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
