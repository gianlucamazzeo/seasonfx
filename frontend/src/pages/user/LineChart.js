import React from 'react';
import Plot from 'react-plotly.js';


function LineChart({ data, layout }) {

/*
    const data = [
      {
        x: [1, 2, 3, 4, 5],
        y: [1, 3, 2, 4, 2],
        type: 'scatter',
        mode: 'lines+markers',
        marker: { color: 'blue' },
      },
    ];
  
    const layout = {
      title: 'Grafico a Linee',
      xaxis: {
        title: 'Valori x',
      },
      yaxis: {
        title: 'Valori y',
      },
    };
  */
 console.log(data)
    return (
      <div>
        <Plot data={data} layout={layout} />
      </div>
    );
  }
  
  export default LineChart;