import React, {useState, useCallback, useRef, ReactElement, useMemo, useEffect} from 'react';
import {Stage} from 'react-pixi-fiber';
import DraggableContainer from './DraggableContainer';
import MessageContainer from './MessageContainer';
import {HeaderContainer} from './HeaderContainer';
import Rect from './Rect';
import {debounce} from 'lodash';
import {nanoid} from 'nanoid';
import { TestItem2 } from '../test/TestItem2';

import Box from '@mui/material/Box';
import TextArea from '@mui/material/TextareaAutosize';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';

const rectPadding = 15;
const mockText = 'TypeORM is an ORM that can run in NodeJS, Browser, Cordova, PhoneGap, Ionic, React Native, NativeScript, Expo, and Electron platforms and can be used with TypeScript and JavaScript (ES5, ES6, ES7, ES8). Its goal is to always support the latest JavaScript features and provide additional';
let lastRectPaddingSum = 0;
const borderColor = '0x4d4dff';

export default function BotConstructor() {
    const [pivotX, setPivotX] = React.useState<number>(0);
    const [pivotY, setPivotY] = React.useState<number>(0);

    const [posX, setPosX] = React.useState<number>(0);
    const [posY, setPosY] = React.useState<number>(0);

    const [lastX, setLastX] = React.useState(15);
    const [lastY, setLastY] = React.useState(5);

    const [cardHeight, setCardHeight] = useState(0);
    const [contentItems, setContentItems] = useState<any[]>([]);
    const [isVisibleBorder, setVisibleBorder] = useState(false);
    const [blockTypes, setBlockTypes] = useState<any[]>([
        {
            id: nanoid(),
            type: 'header',
            props: null,
        },
        {
            id: nanoid(),
            type: 'message',
            props: {
                text: `This message was made with ManyChat Flow Builder, jjjj🥰the most convenient visual bot building tool! 🐙{{email}}kkkkrdds dgg ggd fgdfg`,
            },
        },
        {
            id: nanoid(),
            type: 'message',
            props: {
                text: `This message was made with ManyChat Flow Builder, jjjj🥰the most convenient visual bot building tool! 🐙{{email}}kkkkrdds dgg ggd fgdfg`,
            },
        },
        {
            id: nanoid(),
            type: 'message',
            props: {
                text: `This message was made with ManyChat Flow Builder, jjjj🥰the most convenient visual bot building tool! 🐙{{email}}kkkkrdds dgg ggd fgdfg`,
            },
        },
        {
            id: nanoid(),
            type: 'message',
            props: {
                text: `This message was made with ManyChat Flow Builder, jjjj🥰the most convenient visual bot building tool! 🐙{{email}}kkkkrdds dgg ggd fgdfg`,
            },
        },
        {
            id: nanoid(),
            type: 'message',
            props: {
                text: `This message was made with ManyChat Flow Builder, jjjj🥰the most convenient visual bot building tool! 🐙{{email}}kkkkrdds dgg ggd fgdfg`,
            },
        },
    ]);

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
        setBlockTypes(prev => [
            ...prev,
            {
                id: nanoid(),
                type: 'message',
                props: {
                    text: mockText,
                }
            },
        ]);
    };

    const removeBlock = () => {
        setBlockTypes(prev => {
            return prev.filter((item, idx) => idx !== 0);
        });
    };

    const changeText = debounce((e: any) => {
        console.log(e.target.value);
        const value = e.target.value;

        setBlockTypes((prev: any) => {
            prev.splice(1, 1, {
                type: 'message',
                props: {
                    text: value,
                },
            });

            return prev.slice();
        });
    }, 500);

    const refs = useRef<any[]>([]);

    const calculateCardHeight = (elements: ReactElement[]) => {
        return elements.reduce((acc: number, element: any) => {
            return element ? acc + element.height : acc;
        }, 0);
    };

    const calculatePrevBlocksHeight = (index: number) => {
        const getPrevBlockHeight = (prevBlocks: ReactElement[]) => {
            return calculateCardHeight(prevBlocks);
        };

        return index !== 0 ? getPrevBlockHeight(contentItems.slice(0, index)) : 0;
    };

    const getReactElementByBlockType = useCallback((blockType: string, props: any) => {
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
    }, []);

    const cardContent = useMemo(() => {
        return blockTypes.map((blockType, index, allItems) => {
            const ref = (element: ReactElement) => {
                refs.current[index] = element;
            }
            const id = blockType.id;

            const extraPadding = lastRectPaddingSum = 
                index > 0 ?
                    allItems[index - 1].type === 'message' ?
                        lastRectPaddingSum + (rectPadding * 2) :
                        rectPadding * (index + 1) :
                    rectPadding * (index + 1);


            return getReactElementByBlockType(blockType.type, {
                ref,
                key: id,
                order: index,
                extraPadding,
                id,
                lastX,
                lastY,
                prevBlocksHeight: calculatePrevBlocksHeight(index),
                verticalMargin: rectPadding * (index + 1),
                ...(blockType.props ? blockType.props : {}),
            });
        });
    }, [lastX, lastY, contentItems, blockTypes]);

    useEffect(() => {
        refs.current = [];

        const timerId = setTimeout(() => {
            const cardHeight = calculateCardHeight(refs.current);
            const totalCardHeight = cardHeight + (rectPadding * (refs.current.length + 1));
            setCardHeight(totalCardHeight);
            setContentItems(refs.current);
        }, 0);

        return () => clearTimeout(timerId);
    }, [blockTypes]);

    const setLastXC = useCallback((x: any) => {
        setLastX(x);
    }, []);
    const setLastYC = useCallback((y: any) => {
        setLastY(y);
    }, []);
    const setVisibleBorderC = useCallback((isVisible: any, text: string) => {
        setVisibleBorder(isVisible)
        console.log(text);
    }, []);

    const draw = useCallback((instance: any, borderColor: string) => {
        borderColor && instance.lineStyle(3, borderColor);
        instance.beginFill('0xffffff');
        instance.drawRoundedRect(lastX, lastY, 350, cardHeight, 20);
        instance.endFill();

        console.log('DRAW_RENDER_FRAME');
        instance.lineStyle(3, borderColor);
        instance.clear();
    }, [borderColor]);
    
    return (
        <>
            <Stage options={{ backgroundColor: 0xe3e3e3, height: 1000, width: 1000 }}>
                <DraggableContainer
                    setLastX={setLastXC}
                    setLastY={setLastYC}
                    lastX={lastX}
                    lastY={lastY}
                    setVisibleBorder={setVisibleBorderC}
                    // x={lastX}
                    // y={lastY}
                    // draw={(instance: any) => {
                    //     // console.log(instance, '__INSSSSSS_');
                    //     setVisibleBorder(true);
                    // }}
                    // pointerover={() => setVisibleBorderC(true, 'OVER')}
                    // pointerout={() => setVisibleBorderC(false, 'OUT')}
                >
                    <Rect
                        x={lastX}
                        y={lastY}
                        width={350}
                        height={cardHeight}
                        bg={'0xffffff'}
                        borderColor={isVisibleBorder ? borderColor : null}
                        // draw={draw}
                    >
                        {cardContent}
                    </Rect>
                </DraggableContainer>
            </Stage>

            <TestItem2
                id={nanoid()}
                name={'hello man'}
                changeName={() => {}}
            >
            </TestItem2>

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

            <TextArea
                onChange={changeText}
            />

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