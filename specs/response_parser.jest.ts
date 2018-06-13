import {
  getAnnotationsFromResult,
  getNameFromRecord,
  getTableModelFromResult,
  getTimeSeriesFromResult,
  getValuesFromResult,
  parseResults,
  parseValue,
} from '../src/response_parser';
import response from './sample_response_csv';

describe('influxdb flux response parser', () => {
  describe('parseResults()', () => {
    it('expects three results', () => {
      const results = parseResults(response);
      expect(results.length).toBe(2);
    });
  });

  describe('getAnnotationsFromResult()', () => {
    it('expects a list of annotations', () => {
      const results = parseResults(response);
      const annotations = getAnnotationsFromResult(results[0], { tagsCol: 'cpu' });
      expect(annotations.length).toBe(300);
      expect(annotations[0].tags.length).toBe(1);
      expect(annotations[0].tags[0]).toBe('cpu-total');
      expect(annotations[0].text).toBe('0');
    });
  });

  describe('getTableModelFromResult()', () => {
    it('expects a table model', () => {
      const results = parseResults(response);
      const table = getTableModelFromResult(results[0]);
      expect(table.columns.length).toBe(6);
      expect(table.rows.length).toBe(300);
    });
  });

  describe('getTimeSeriesFromResult()', () => {
    it('expects time series', () => {
      const results = parseResults(response);
      const series = getTimeSeriesFromResult(results[0]);
      expect(series.length).toBe(50);
      expect(series[0].datapoints.length).toBe(6);
    });
  });

  describe('getValuesFromResult()', () => {
    it('returns all values from the _value field in the response', () => {
      const results = parseResults(response);
      const values = getValuesFromResult(results[0]);
      expect(values.length).toBe(300);
    });
  });

  describe('getNameFromRecord()', () => {
    it('expects name based on measurements and tags', () => {
      const record = {
        '': '',
        result: '',
        table: '0',
        _start: '2018-06-02T06:35:25.651942602Z',
        _stop: '2018-06-02T07:35:25.651942602Z',
        _time: '2018-06-02T06:35:31Z',
        _value: '0',
        _field: 'usage_guest',
        _measurement: 'cpu',
        cpu: 'cpu-total',
        host: 'kenobi-3.local',
      };
      expect(getNameFromRecord(record)).toBe('cpu usage_guest cpu=cpu-total host=kenobi-3.local');
    });
  });

  describe('parseValue()', () => {
    it('parses a number', () => {
      expect(parseValue('42.3')).toBe(42.3);
    });
    it('parses a non-number to null', () => {
      expect(parseValue('foo')).toBe(null);
    });
  });
});
