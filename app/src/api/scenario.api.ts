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
      endpoint: '/scenario/network-flood'

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

async function memoryLeak(){
    const response = await fetch('/api/scenario/memory-leak', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            duration: 30
        })
    });

    if (!response.ok) throw new Error('Failed to trigger memory leak');
}

async function cpuSpike(){
    const response = await fetch('/api/scenario/cpu-spike', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            duration: 15
        })
    });

    if (!response.ok) throw new Error('Failed to trigger CPU spike');
}

export { memoryLeak, cpuSpike };