import React from "react";
import "./ParameterGraph.css";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function ParameterGraph(props) {
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
          const date = payload[0].payload.date;
          const data = payload[0].value;
      
          return (
            <div 
                className="custom-tooltip" 
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                    padding: '3px', 
                    border: '1px solid white', 
                    fontSize: '12px',
                    borderRadius: '5px'
                }}>
    
              <p className="label" style={{ margin: '0' }}>{`Date: ${date}`}</p>
              <p className="label" style={{ margin: '0' }}>{`${props.parameter}: ${data} ${props.unit}`}</p>
            </div>
          );
        }
        return null;
    };

    return (
        <div className="graph-container">
            {props.data.length != 0 ? (
                    <LineChart
                        width={374}
                        height={186}
                        data={props.data}
                        margin={{
                            top: 15,
                            right: 30,
                            left: 0,
                            bottom: 5,
                        }}
                        >
                        <CartesianGrid strokeDasharray="3 3" stroke="white"/>
                        <YAxis stroke="white"/>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend formatter={() => `${props.parameter}`}/>
                        <Line type="monotone" dataKey="data" stroke="white" activeDot={{ r: 8 }} />
                    </LineChart>
                ):
                (
                    <span style={{color: "white"}}>No {props.parameter} data</span>
                )
            }
        </div>
    );
}

export default ParameterGraph;
