import React, { useState, useRef, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import { ForceGraph2D } from 'react-force-graph';
import { useDispatch, useSelector } from 'react-redux';
import { getData, postData } from '../utils/request';
import tableform from '../utils/table';

const host = 'http://39.98.49.111:16009';

const useStyles = makeStyles(theme => ({
  box: {
    background: '#000000',
    width: '100px',
    height: '100px',
    position: 'absolute',
    zIndex: '2',
  },
  graph: {
    position: 'absolute',
    zIndex: '1',
  },
  chart: {},
  board: {
    position: 'relative',
  },
}));

function GraphTest() {
  const classes = useStyles();
  const { step4result } = useSelector(state => ({
    step4result: state.model.step4result,
  }));

  const [nodes, setNodes] = useState([{ id: 'hhh' }]);

  const [links, setLinks] = useState([]);
  const [data, setData] = useState({
    nodes: nodes,
    links: links,
  });
  useEffect(() => {
    console.log('graph', step4result);
    async function fetchData() {
      let data1 = await postData(`${host}/model/construct/`, step4result);
      console.log('graph data', data);

      setData({
        nodes: data1.dots.map(dot => ({
          id: dot,
          color: 'pink',
          table: data1.tables.find(item => item.dot === dot)
            ? data1.tables.find(item => item.dot === dot).table
            : null,
        })),
        links: data1.edges.map(item => ({ ...item, particles: 4 })),
      });
    }
    fetchData();
  }, [step4result]);

  useEffect(() => {
    console.log('final data', data);
  }, [data]);
  useEffect(() => {
    console.log('cur nodes', nodes);
  }, [nodes]);
  const [tempPos, setTempPos] = useState({
    x: 100,
    y: 100,
  });
  const fgRef = useRef();
  useEffect(() => {
    fgRef.current.zoom(4, 1000);
  }, [fgRef]);
  function sleep() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(1);
      }, 1000);
    });
  }
  async function changeColor(array) {
    const dots = array;
    for (
      let i = 0, dot = dots[i], nextDot = dots[i + 1];
      i < dots.length;
      dot = dots[++i], nextDot = dots[i + 1]
    ) {
      let tempNodes = nodes;
      let curNode = tempNodes.find(item => item.id === dot);
      curNode.color = '#000000';
      fgRef.current.centerAt(curNode.x, curNode.y, 500);
      setLinks(() => {
        console.log('dot->nextDot', dot, nextDot);
        let tempLinks = links;
        let curLink = tempLinks.find(
          link => link.source.id === dot && link.target.id === nextDot
        );
        console.log('curLink', curLink);
        if (curLink) {
          curLink.color = 'red';
        }
        //console.log(tempLinks);
        return tempLinks;
      });
      await sleep();
    }
    console.log('result', links);
  }
  return (
    <div className={classes.board}>
      <ForceGraph2D
        ref={fgRef}
        graphData={data}
        linkDirectionalParticles={link => link.particles}
        onNodeClick={(node, event) => {
          console.log(node);
          //changeColor(['Y3', 'Y2', 'X11', '中心节点']);
        }}
        onNodeHover={(node, prevNode) => {
          console.log(node);
          if (node) node.color = 'red';
          if (prevNode) prevNode.color = 'pink';
          console.log(prevNode);
        }}
        linkDirectionalParticleWidth={link => {
          return 2;
        }}
        nodeRelSize={8}
        linkWidth={1}
        linkCurvature={0.2}
        nodeLabel={node => {
          console.log('table sheet', node.table);
          console.log('table node', tableform(node.table));
          console.log('stringstring', JSON.stringify(node.table));
          return tableform(node.table);
        }}
        onNodeDragEnd={node => {
          node.fx = node.x;
          node.fy = node.y;
          node.fz = node.z;
        }}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.id;
          const fontSize = 5;
          ctx.font = `${fontSize}px Sans-Serif`;
          const textWidth = ctx.measureText(label).width;
          const bckgDimensions = [textWidth, fontSize].map(
            n => n + fontSize * 0.2 * 5
          ); // some padding
          ctx.fillStyle = node.color;
          ctx.fillRect(
            node.x - bckgDimensions[0] / 2,
            node.y - bckgDimensions[1] / 2,
            ...bckgDimensions
          );
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#ffffff';
          ctx.fillText(label, node.x, node.y);
        }}
      ></ForceGraph2D>
    </div>
  );
}

export default GraphTest;
