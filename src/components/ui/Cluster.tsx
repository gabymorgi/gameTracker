import styled from 'styled-components';
import { Tag } from './Tags';
import { Cluster as ClusterClass } from '@/utils/tagClustering';
import { useEffect, useRef, useState } from 'react';

const StyledCluster = styled.div`
  position: relative;
  border-radius: 50%;
  border: 1px solid white;
  width: 100%;
  height: 100%;
`;

const NoName = styled.div<{ angle: number }>`
  position: absolute;
  top: ${props => `${50 + 50 * Math.sin(props.angle)}%`};
  left: ${props => `${50 + 50 * Math.cos(props.angle)}%`};
  transform: ${props => `translate(-${50 + 50 * Math.cos(props.angle)}%, -${50 + 50 * Math.sin(props.angle)}%)`};
`;

const StyledMember = styled(NoName)`
  &:hover {
    z-index: 1;
  }
`

const StyledSubCluster = styled(NoName)<{ angle: number; size: number }>`
  width: ${props => `${props.size}%`};
  height: ${props => `${props.size}%`};
`;


interface ClusterProps {
  cluster: ClusterClass
}

// Componente Cluster
const Cluster = (props: ClusterProps) => {
  const range = props.cluster.colorRange.end - props.cluster.colorRange.start;
  return (
    <StyledCluster>
      {props.cluster.clusters.length > 1 ? (
        props.cluster.clusters.map((subCluster, index) => {
          const angle = index * Math.PI * 2 / props.cluster.clusters.length;
          // const angle = (subCluster.colorRange.end + subCluster.colorRange.start) / 2
          console.log(subCluster.members.join('-'), angle)
          // const size = subCluster.clusters.length ? 100 : 100 * (subCluster.colorRange.end - subCluster.colorRange.start) / range;
          const size = 100 * (subCluster.colorRange.end - subCluster.colorRange.start) / range;
          // const size = 75
          return (
            <StyledSubCluster key={subCluster.members.join('-')} angle={angle} size={size}>
              <Cluster cluster={subCluster} />
            </StyledSubCluster>
          );
        })
      ) : (
        props.cluster.members.map((member, index) => {
          const angle = index * Math.PI * 2 / props.cluster.members.length;
          return (
            <StyledMember angle={angle} key={member}>
              <Tag hue={Math.round(
                props.cluster.colorRange.start +
                (index + 1) * ((
                  props.cluster.colorRange.end - props.cluster.colorRange.start
                ) / (props.cluster.members.length + 1))
              )}>
                {member}
              </Tag>
            </StyledMember>
          );
        })
      )}
    </StyledCluster>
  );
};

const ClusterTree = (props: ClusterProps) => {
  const refCluster = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    function handleResize() {
      setHeight(refCluster.current?.offsetWidth || 0);
    }

    // Se llama una vez para obtener el tamaño inicial
    handleResize();

    // Se establece el observador para cambios de tamaño
    window.addEventListener('resize', handleResize);

    // Limpiamos el observador cuando el componente se desmonta
    return () => window.removeEventListener('resize', handleResize);
  }, []);  // Dependencias vacías para que se ejecute solo al montar y desmontar

  return (
    <div ref={refCluster} style={{ height: `${height}px` }}>
      <Cluster cluster={props.cluster} />
    </div>
  );
}

export default ClusterTree;