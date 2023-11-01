import React from 'react';
import Plot from 'react-plotly.js';


function LineChart({ data, layout, config }) {

    return (
      <div>
        <Plot data={data} layout={layout}  style={{ width: '90%', height: '500px' }}  />
      </div>
    );
  }
  
  export default LineChart;