import { useState } from 'react';
import { Play, Square, AlertTriangle } from 'lucide-react';
import NavHeader from '../components/NavHeader';

const Soundboard = () => {
  const [activeScenarios, setActiveScenarios] = useState(new Set());
  const [feedback, setFeedback] = useState('');

  const scenarios = [
    {
      id: 'memory-leak',
      name: 'Memory Leak',
      description: 'Simulates a memory leak by accumulating large arrays',
      severity: 'high',
      duration: '30s',
      endpoint: '/scenario/memory-leak'
    },
    {
      id: 'cpu-spike',
      name: 'CPU Spike',
      description: 'Triggers heavy computation loops',
      severity: 'medium',
      duration: '15s',
        endpoint: '/scenario/cpu-spike'

    },
    {
      id: 'network-flood',
      name: 'Network Flood',
      description: 'Sends rapid API requests to test rate limiting',
      severity: 'high',
      duration: '20s',
      endppoint: '/scenario/network-flood'

    },
    {
      id: 'dom-explosion',
      name: 'DOM Explosion',
      description: 'Creates thousands of DOM elements rapidly',
      severity: 'medium',
      duration: '10s',
        endpoint: '/scenario/dom-explosion'
    },
    {
      id: 'async-chaos',
      name: 'Async Chaos',
      description: 'Triggers multiple conflicting async operations',
      severity: 'low',
      duration: '25s',
        endpoint: '/scenario/async-chaos'
    },
    {
      id: 'storage-overflow',
      name: 'Storage Overflow',
      description: 'Fills localStorage with large data chunks',
      severity: 'medium',
      duration: '15s',
      endpoint: '/scenario/storage-overflow'
    },
    {
      id: 'event-storm',
      name: 'Event Storm',
      description: 'Triggers rapid fire DOM events',
      severity: 'high',
      duration: '20s',
      endpoint: '/scenario/event-storm'
    },
    {
      id: 'render-loop',
      name: 'Render Loop',
      description: 'Forces continuous re-renders',
      severity: 'medium',
      duration: '30s',
      endpoint: '/scenario/render-loop'
    }
  ];

  const handleScenario = (id) => {
    if (activeScenarios.has(id)) {
      setActiveScenarios(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setFeedback(`Stopping scenario: ${id}`);
    } else {
      setActiveScenarios(prev => new Set([...prev, id]));
      setFeedback(`Running scenario: ${id}`);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 p-6">
      {/* Header */}
      <NavHeader />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Performance Soundboard</h1>
        <p className="text-zinc-400">Trigger various performance scenarios to test system resilience and</p>
      </div>

      {/* Feedback Display */}
      {feedback && (
        <div className="mb-6 p-4 bg-zinc-800 rounded-lg border border-zinc-700">
          <p className="text-white font-mono">{feedback}</p>
        </div>
      )}

      {/* Warning Banner */}
      <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg flex items-center space-x-3">
        <AlertTriangle className="h-5 w-5 text-red-400" />
        <p className="text-red-200">
          Warning: These scenarios will temporarily impact application stability.
        </p>
      </div>

      {/* Soundboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {scenarios.map((scenario) => (
          <div
            key={scenario.id}
            className="bg-zinc-800 rounded-lg border border-zinc-700 p-4 hover:border-zinc-600 transition-colors"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-white font-semibold">{scenario.name}</h3>
              <div className={`${getSeverityColor(scenario.severity)} w-2 h-2 rounded-full`} />
            </div>
            
            <p className="text-zinc-400 text-sm mb-4">{scenario.description}</p>
            
            <div className="flex justify-between items-center">
              <span className="text-zinc-500 text-sm">Duration: {scenario.duration}</span>
              
              <button
                onClick={() => handleScenario(scenario.id)}
                className={`p-2 rounded-md transition-colors ${
                  activeScenarios.has(scenario.id)
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {activeScenarios.has(scenario.id) ? (
                  <Square className="h-4 w-4 text-white" />
                ) : (
                  <Play className="h-4 w-4 text-white" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Soundboard;