import React from 'react';
import {Sprite, Stage, Container, Text} from 'react-pixi-fiber';
import DraggableContainer from './DraggableContainer';
import * as PIXI from 'pixi.js';
import logo192 from '../../assets/logo192.png';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';


export default function BotConstructor() {
    function Bunny(props: any) {
        return <Sprite texture={PIXI.Texture.from(logo192)} {...props} />;
    }

    const [pivotX, setPivotX] = React.useState<number>(0);
    const [pivotY, setPivotY] = React.useState<number>(0);

    const [posX, setPosX] = React.useState<number>(0);
    const [posY, setPosY] = React.useState<number>(0);

    const [lastX, setLastX] = React.useState(15);
    const [lastY, setLastY] = React.useState(5);

    const handleChange = (event: Event, newValue: number | number[], coord: string) => {
        console.log(newValue, '__NEW__');
        switch (coord) {
            case 'x':
                setPivotX(newValue as number);
                break;
            case 'y':
                setPivotY(newValue as number);
                break;
            case 'px':
                setPosX(newValue as number);
                break;
            default:
                setPosY(newValue as number);
        }
    };
    
    return (
        <>
            <Stage options={{ backgroundColor: 0x10bb99, height: 500, width: 500 }}>
                <DraggableContainer
                    pivotXExternal={pivotX}
                    pivotYExternal={pivotY}

                    posXExternal={posX}
                    posYExternal={posY}

                    lastX={lastX}
                    lastY={lastY}

                    setLastX={setLastX}
                    setLastY={setLastY}

                    setPivotX={setPivotX}
                    setPivotY={setPivotY}
                >
                    {/* <Bunny x={200} y={500} /> */}
                    <Text text={`hiu iy353`} style={{ fill: 0xffff00, fontSize: 14 }} x={lastX} y={lastY} />
                </DraggableContainer>
            </Stage>

            <Box sx={{ width: 200 }}>
                <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
                    <Slider aria-label="Volume" value={pivotX} onChange={(e: any, value: number | number[]) => handleChange(e, value, 'x')} min={-50} max={250}/>X
                </Stack>
                <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
                    <Slider aria-label="Volume" value={pivotY} onChange={(e: any, value: number | number[]) => handleChange(e, value, 'y')} min={-50} max={250}/>Y
                </Stack>

                <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
                    <Slider aria-label="Volume" value={posX} onChange={(e: any, value: number | number[]) => handleChange(e, value, 'px')} min={-50} max={250}/>PositionX
                </Stack>
                <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
                    <Slider aria-label="Volume" value={posY} onChange={(e: any, value: number | number[]) => handleChange(e, value, 'py')} min={-50} max={250}/>PositionY
                </Stack>
            </Box>
        </>
    );
}