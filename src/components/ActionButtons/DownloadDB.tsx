import { Button } from 'antd';
import React from 'react';
// import { GameContext } from '@/contexts/GamesContext';
import { downloadTxtFile } from '@/utils/download';

export const DownloadDB: React.FC = (props) => {
  // const { fullData } = React.useContext(GameContext)
  const handleClick = () => {
    // downloadTxtFile(JSON.stringify(fullData), 'dataBase')
  };
  return (
    <div>not implemented</div>
    // <Button disabled={!fullData?.length} onClick={handleClick}>Download database</Button>
  )
}
