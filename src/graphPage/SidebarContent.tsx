import React, {useState} from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { isNumber } from 'lodash';
import DepsTree from '../components/DepsTree';

type SidebarContentProps = {
    foundEntitiesCount: number | null,
    prevHighlightedNodes: any,
    currentPointerIndex: number | null,
    movePointer: VoidFunction,
    resetNodesHighlight: VoidFunction,
    handleGraph: (entityName: string) => void,
    resetGraph: VoidFunction,
};

let prevEntityName: string;

export default function SidebarContent({
    foundEntitiesCount,
    prevHighlightedNodes,
    currentPointerIndex,
    movePointer,
    resetNodesHighlight,
    handleGraph,
    resetGraph,
}: SidebarContentProps) {
	const [nodeName, setNodeName] = useState<string>('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNodeName(event.target.value);
    };

    const getCurrentPointerIndex = () => {
        if (currentPointerIndex !== null) {
            return currentPointerIndex + 1;
        }
    };

    const highlightGraphLinksByNodeName = (e: any) => {
        if (e.key !== 'Enter') return;

        e.preventDefault();
        const entityName = e.target.value;
        
        if (entityName === '') {
            setNodeName('');
            resetGraph();
            return;
        }

        if (prevEntityName === entityName) {
            movePointer();
            return;
        }

        if (prevHighlightedNodes.length !== 0) {
            resetNodesHighlight();
        }
        
        handleGraph(entityName);
        prevEntityName = entityName;
    }

    return (
        <Box
            component="form"
            sx={{'& > :not(style)': { ml: 3, width: '40ch' }}}
            noValidate
            autoComplete="off"
         >
            <TextField
               label="Введите название/описание сущности"
               variant="outlined"
               onChange={handleChange}
               value={nodeName}
               onKeyPress={highlightGraphLinksByNodeName}
            />
            {
                foundEntitiesCount !== null ?
                    foundEntitiesCount > 0 ?
                        (
                            <Typography variant="body2" gutterBottom>
                                Найдено {foundEntitiesCount} совпадений ({getCurrentPointerIndex()}/{foundEntitiesCount})
                            </Typography>
                        ) :
                        (
                            <Typography variant="body2" gutterBottom>
                                Cовпадений не найдено
                            </Typography>
                        ) :
                    null
            }
            <Button
               variant="text"
               onClick={resetGraph}
               disabled={prevHighlightedNodes.length === 0}
            >
               Reset
            </Button>
            {
               prevHighlightedNodes.length > 0 && isNumber(currentPointerIndex) &&
               <DepsTree
                  data={prevHighlightedNodes[currentPointerIndex]}
               />
            }
         </Box>
    );
}