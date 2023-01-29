import { useNavigate } from 'react-router-dom';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Movie, SearchResultMovie, SearchResultTv } from '../../../interfaces';
import styles from './LineGraph.module.css';

interface LineGraphProps {
  data: {
    id: number;
    vote_average: number;
    media_type?: 'person' | 'movie' | 'tv';
  }[];
  xAxisLabel: string;
  allowClick?: boolean;
}

interface ClickPayload {
  activePayload?: {
    payload: SearchResultMovie | SearchResultTv | Movie;
  }[];
}

const LineGraph = ({
  data,
  xAxisLabel,
  allowClick = false,
}: LineGraphProps) => {
  const navigate = useNavigate();
  const tickFormatter = (value: string): string => {
    const limit = 20;
    if (value.length < limit) return value;
    return `${value.substring(0, limit)}...`;
  };

  const handleClick = (e: ClickPayload) => {
    if (e !== null && allowClick && e.activePayload) {
      const { payload } = e.activePayload[0];

      // media_type wont exist on Movie
      // tv shows will always include media_type
      const type =
        'media_type' in payload && payload.media_type === 'tv'
          ? 'tvshow'
          : 'movie';

      navigate(`/${type}/${payload.id}`);
    }
  };

  return (
    <div className={styles.graph}>
      <ResponsiveContainer width='100%' height={400}>
        <LineChart
          // Key makes sure animation works
          key={Math.random()}
          data={data}
          onClick={(e) => handleClick(e)}
          style={allowClick && { cursor: 'pointer' }}
          margin={{
            top: 5,
            right: 75,
            left: 0,
            bottom: 50,
          }}
        >
          <Line
            name='Rating'
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
            contentStyle={{ backgroundColor: 'var(--background)' }}
            cursor={{ stroke: 'var(--text', opacity: '75%' }}
          />
          <CartesianGrid strokeDasharray='2 1' opacity='50%' />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineGraph;
