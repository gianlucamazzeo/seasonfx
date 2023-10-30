import React from 'react';
import Plot from 'react-plotly.js';


function LineChart({ data, layout }) {

    return (
      <div>
        <Plot data={data} layout={layout} />
      </div>
    );
  }
  
  export default LineChart;