import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';
import { Box } from '@chakra-ui/react';

const Graph = ({ priceHistory }) => {
  const chartContainerRef = useRef();
  const chartRef = useRef();
  const lineSeriesRef = useRef(); // Initialize lineSeriesRef her


  useEffect(() => {
    if (priceHistory.length === 0 || !chartContainerRef.current) return;

    const chartData = priceHistory.map(entry => ({
      time: new Date(entry.timestamp).getTime() / 1000,
      value: Number(entry.price),
    }));

    if (!chartRef.current) {
      chartRef.current = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.offsetWidth,
        height: 300,
        timeScale: {
          timeVisible: true,
          secondsVisible: false,
        },
      });
      
      chartRef.current.addLineSeries().setData(chartData);
    }
  }, [priceHistory]);


//   useEffect(() => {
//     const resizeObserver = new ResizeObserver(entries => {
//       if (entries.length === 0 || !entries[0].target) return;
//       const newWidth = entries[0].target.clientWidth;

//       if (chartRef.current) {
//         chartRef.current.applyOptions({ width: newWidth });
//       }
//     });

//     if (chartContainerRef.current) {
//       resizeObserver.observe(chartContainerRef.current);
//     }

//     return () => {
//       if (chartContainerRef.current) {
//         resizeObserver.unobserve(chartContainerRef.current);
//       }
//     };
//   }, []);

  return (
    <Box ref={chartContainerRef} style={{ width: '100%', height: '300px' }} />
  );
};

export default Graph;
