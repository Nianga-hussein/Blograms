"use client";

export default function Chart({ type, dateRange }: { type: 'line' | 'bar'; dateRange: string }) {
  // Dans un projet réel, vous utiliseriez une bibliothèque comme Chart.js, Recharts, etc.
  // Pour cet exemple, nous allons simplement simuler un graphique avec des divs

  // Simuler des données différentes selon la plage de dates
  const getData = () => {
    if (dateRange === 'week') {
      return [10, 25, 15, 30, 20, 35, 25];
    } else if (dateRange === 'month') {
      return [15, 20, 25, 30, 35, 30, 25, 20, 15, 20, 25, 30, 35, 30, 25];
    } else {
      return [20, 25, 30, 35, 40, 45, 50, 45, 40, 35, 30, 25];
    }
  };

  const data = getData();
  const max = Math.max(...data);

  return (
    <div className="h-64 flex items-end space-x-2">
      {data.map((value, index) => (
        <div key={index} className="flex-1 flex flex-col items-center">
          <div 
            className={`w-full ${type === 'line' ? 'border-t-2 border-indigo-500' : 'bg-indigo-500 rounded-t'}`} 
            style={{ 
              height: `${(value / max) * 100}%`,
              marginTop: type === 'line' ? `${100 - (value / max) * 100}%` : '0'
            }}
          ></div>
          <div className="text-xs text-gray-500 mt-1">{index + 1}</div>
        </div>
      ))}
    </div>
  );
}