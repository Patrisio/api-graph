import React, {ChangeEvent} from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

type SidebarContentProps = {
    nodeName: string,
    isDisabledResetButton: boolean,
    depsTreeUI: any,
    isVisibleCoincidenceNotice: boolean,
    coincidenceNoticeText: string,
    highlightGraphLinksByNodeName: (e: any) => void,
    resetGraph: VoidFunction,
    handleChange: (event: ChangeEvent<HTMLInputElement>) => void,
};

export default function SidebarContentView({
    nodeName,
    isDisabledResetButton,
    depsTreeUI,
    isVisibleCoincidenceNotice,
    coincidenceNoticeText,
    handleChange,
    highlightGraphLinksByNodeName,
    resetGraph,
}: SidebarContentProps) {
    return (
        <Box
            component='form'
            sx={{'& > :not(style)': { ml: 3, width: '40ch' }}}
            noValidate
            autoComplete='off'
         >
            <TextField
               label='Введите название/описание сущности'
               variant='outlined'
               onChange={handleChange}
               value={nodeName}
               onKeyPress={highlightGraphLinksByNodeName}
            />
            {
                isVisibleCoincidenceNotice &&
                <Typography variant='body2' gutterBottom>
                    {coincidenceNoticeText}
                </Typography>
            }
            <Button
               variant='text'
               onClick={resetGraph}
               disabled={isDisabledResetButton}
            >
               Reset
            </Button>
            {depsTreeUI}
         </Box>
    );
}