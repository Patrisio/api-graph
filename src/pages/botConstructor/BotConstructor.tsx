import React, {useState, useCallback, useRef, ReactElement, useMemo, useEffect} from 'react';
import {Stage} from 'react-pixi-fiber';
import DraggableContainer from './DraggableContainer';
import MessageContainer from './MessageContainer';
import {HeaderContainer} from './HeaderContainer';
import Rect from './Rect';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';

const rectPadding = 15;

export default function BotConstructor() {
    const [pivotX, setPivotX] = React.useState<number>(0);
    const [pivotY, setPivotY] = React.useState<number>(0);

    const [posX, setPosX] = React.useState<number>(0);
    const [posY, setPosY] = React.useState<number>(0);

    const [lastX, setLastX] = React.useState(15);
    const [lastY, setLastY] = React.useState(5);

    const [cardHeight, setCardHeight] = useState(0);
    const [contentItems, setContentItems] = useState<any[]>([]);
    const [blockTypes, setBlockTypes] = useState(['header', 'message', 'message', 'message']);

    const handleChange = (event: Event, newValue: number | number[], coord: string) => {
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

    const addBlock = () => {
        setBlockTypes(prev => [...prev, 'message']);
    };

    const removeBlock = () => {
        setBlockTypes(prev => {
            console.log(prev.filter((item, idx) => idx !== 0), 'prev.filter((item, idx) => idx !== 0)');
            return prev.filter((item, idx) => idx !== 0);
        });
    };

    const refs = useRef<any[]>([]);

    const calculateCardHeight = (elements: ReactElement[]) => {
        return elements.reduce((acc: number, element: any) => {
            console.log(element.height, 'element.height');
            return acc + element.height;
        }, 0);
    };

    const cardContent = useMemo(() => {
        const calculatePrevBlocksHeight = (index: number) => {
            const getPrevBlockHeight = (prevBlocks: ReactElement[]) => {
                return calculateCardHeight(prevBlocks);
            };

            return index !== 0 ? getPrevBlockHeight(contentItems.slice(0, index)) : 0;
        };

        const getReactElementByBlockType = (blockType: string, props: any) => {
            switch (blockType) {
                case 'header':
                    return (
                        <HeaderContainer
                            {...props}
                        />
                    )
                default:
                    return (
                        <MessageContainer
                            rectPadding={rectPadding}
                            {...props}
                        />
                    );
            }
        };

        return blockTypes.map((blockType, index) => {
            const ref = (element: ReactElement) => {
                refs.current[index] = element;
            };

            return getReactElementByBlockType(blockType, {
                ref,
                key: index,
                lastX,
                lastY,
                prevBlocksHeight: calculatePrevBlocksHeight(index),
                verticalMargin: rectPadding * (index + 1),
            });
        });
    }, [lastX, lastY, contentItems, blockTypes]);

    useEffect(() => {
        refs.current = [];

        setTimeout(() => {
            const cardHeight = calculateCardHeight(refs.current);
            setCardHeight(cardHeight);
            setContentItems(refs.current);
        }, 0);
    }, [blockTypes]);
    
    return (
        <>
            <Stage options={{ backgroundColor: 0xe3e3e3, height: 1000, width: 1000 }}>
                <DraggableContainer
                    setLastX={setLastX}
                    setLastY={setLastY}
                >
                    <Rect
                        x={lastX}
                        y={lastY}
                        width={350}
                        height={cardHeight + (rectPadding * (contentItems.length + 1))}
                        bg={0xffffff}
                    >
                        {cardContent}
                    </Rect>
                </DraggableContainer>
            </Stage>

            <Button
                onClick={addBlock}
            >
                Add block
            </Button>

            <Button
                onClick={removeBlock}
            >
                Remove block
            </Button>

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