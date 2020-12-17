import React, { useState, useRef, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import { ForceGraph2D } from 'react-force-graph';

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
  const [nodes, setNodes] = useState([
    {
      id: 'X1',
      color: '#000000',
    },
    { id: 'X2' },
    { id: '中心节点' },
    { id: 'X4' },
    { id: 'X5' },
    { id: 'X6' },
    { id: 'X7' },
    { id: 'X8' },
    { id: 'X9' },
    { id: 'X10' },
    { id: 'X11' },
    { id: 'X12' },
    { id: 'Y1' },
    { id: 'Y2' },
    { id: 'Y3' },
  ]);

  const [links, setLinks] = useState([
    {
      source: 'X2',
      target: 'X1',
    },
    {
      source: '中心节点',
      target: 'X2',
    },
    {
      source: 'X4',
      target: '中心节点',
    },
    {
      source: 'X5',
      target: '中心节点',
    },
    {
      source: 'X6',
      target: '中心节点',
    },
    {
      source: 'X7',
      target: '中心节点',
    },
    {
      source: 'X8',
      target: '中心节点',
    },
    {
      source: 'X9',
      target: '中心节点',
    },
    {
      source: 'X10',
      target: '中心节点',
    },
    {
      source: 'X11',
      target: '中心节点',
    },
    {
      source: 'X12',
      target: '中心节点',
    },
    {
      source: 'Y1',
      target: 'X1',
    },
    {
      source: 'Y1',
      target: 'X4',
    },
    {
      source: 'Y1',
      target: 'X5',
    },
    {
      source: 'Y2',
      target: 'X9',
    },
    {
      source: 'Y2',
      target: 'X11',
    },
    {
      source: 'Y3',
      target: 'X12',
    },
    {
      source: 'Y3',
      target: 'Y2',
    },
  ]);
  const [data, setData] = useState({
    nodes: nodes,
    links: links,
  });
  const [tempPos, setTempPos] = useState({
    x: 100,
    y: 100,
  });
  const fgRef = useRef();
  useEffect(() => {
    fgRef.current.zoom(4, 1000);
    setNodes(() => {
      let tempNodes = nodes;
      tempNodes.forEach(node => {
        node.color = 'pink';
      });
      return tempNodes;
    });
    setLinks(() => {
      let tempLinks = links;
      tempLinks.forEach(link => {
        link.particles = 3;
      });
      return tempLinks;
    });
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
          changeColor(['Y3', 'Y2', 'X11', '中心节点']);
        }}
        onNodeHover={(node, prevNode) => {
          console.log(node);
          if (node) node.color = 'red';
          if (prevNode) prevNode.color = 'pink';
          console.log(prevNode);
        }}
        linkDirectionalParticleWidth={link => {
          if (link.index === 1) {
            return 0;
          }
          return 2;
        }}
        nodeRelSize={8}
        linkWidth={1}
        linkCurvature={0.2}
        nodeLabel={() => `<table border="1">
<tr>
<td>row 1, cell 1</td>
<td>row 1, cell 2</td>
</tr>
<tr>
<td>&nbsp;</td>
<td>row 2, cell 2</td>
</tr>
</table>`}
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
