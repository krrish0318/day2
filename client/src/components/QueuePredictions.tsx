import { useEffect, useState, memo } from 'react';
import { Activity, Clock } from 'lucide-react';

interface QueueNode {
  id: string;
  name: string;
  type: string;
  estimatedWaitTime: number;
  density: 'Low' | 'Medium' | 'High';
}

/**
 * QueuePredictions Component - Polls and displays wait-time metrics.
 * Wrapped in React memo to avoid useless re-renders since payload updates sparingly.
 * 
 * @returns {JSX.Element} Wait-time feed list.
 */
const QueuePredictions = memo(function QueuePredictions(): JSX.Element {
  const [queues, setQueues] = useState<QueueNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQueues = async () => {
      try {
        const baseUrl = import.meta.env.MODE === 'development' ? 'http://localhost:8080' : '';
        const response = await fetch(`${baseUrl}/api/queues`);
        const data = await response.json();
        setQueues(data.queues || []);
      } catch (e) {
        console.error('Failed to load queues', e);
      } finally {
        setLoading(false);
      }
    };
    fetchQueues();
    // Refresh every 10s roughly
    const id = setInterval(fetchQueues, 10000);
    return () => clearInterval(id);
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        <Activity className="animate-pulse mr-2" /> Loading data...
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-3">
      {queues.map(q => {
        let colorClass = 'text-secondary bg-secondary/10 border-secondary/20';
        if (q.density === 'Medium') colorClass = 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
        if (q.density === 'High') colorClass = 'text-alert bg-alert/10 border-alert/20';

        return (
          <div key={q.id} className={`p-3 rounded-lg border ${colorClass} flex justify-between items-center transition-all hover:scale-[1.02]`}>
            <div>
              <p className="font-semibold text-sm">{q.name}</p>
              <div className="flex items-center text-xs opacity-80 mt-1">
                <Clock size={12} className="mr-1" />
                Wait: {q.estimatedWaitTime} min
              </div>
            </div>
            <div className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider backdrop-blur-sm ${colorClass}`}>
              {q.density}
            </div>
          </div>
        );
      })}
    </div>
  );
});

export default QueuePredictions;
