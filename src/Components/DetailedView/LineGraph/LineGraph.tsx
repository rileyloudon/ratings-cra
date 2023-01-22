import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import styles from './LineGraph.module.css';

interface LineGraphProps {
  data: {
    vote_average: number;
  }[];
  xAxisLabel: string;
}

const LineGraph = ({ data, xAxisLabel }: LineGraphProps) => {
  const tickFormatter = (value: string): string => {
    const limit = 20;
    if (value.length < limit) return value;
    return `${value.substring(0, limit)}...`;
  };

  return (
    <div className={styles.graph}>
      <ResponsiveContainer width='100%' height={400}>
        <LineChart
          // Key makes sure animation works
          key={Math.random()}
          data={data}
          margin={{
            top: 5,
            right: 105,
            left: 75,
            bottom: 50,
          }}
        >
          <Line
            name='Average'
            dataKey='vote_average'
            stroke='var(--text)'
            type='monotone'
          />
          <XAxis
            tick={{ fill: 'var(--text)' }}
            dataKey={xAxisLabel}
            interval={0}
            tickFormatter={tickFormatter}
            angle={315}
          />
          <YAxis
            tick={{ fill: 'var(--text)' }}
            type='number'
            domain={[0, 10]}
            tickCount={6}
            allowDataOverflow={false}
          />
          <Tooltip
            wrapperClassName={styles['tooltip-wrapper']}
            contentStyle={{ backgroundColor: 'var(background)' }}
          />
          <CartesianGrid strokeDasharray='2 1' opacity='50%' />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineGraph;
