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

export default function BotConstructor() {
    const [pivotX, setPivotX] = React.useState<number>(0);
    const [pivotY, setPivotY] = React.useState<number>(0);

    const [posX, setPosX] = React.useState<number>(0);
    const [posY, setPosY] = React.useState<number>(0);

    const [lastX, setLastX] = React.useState(15);
    const [lastY, setLastY] = React.useState(5);

    const [messageContainerHeight, setMessageContainerHeight] = useState(0);

    const [cardHeight, setCardHeight] = useState(0);
    const [contentItems, setContentItems] = useState<any[]>([]);
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
            console.log(prev.filter((item, idx) => idx !== 0), 'prev.filter((item, idx) => idx !== 0)');
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

    const onChangeHeight = useCallback((height: number, order: string) => {
        // setMessageContainerHeight(height);
        // console.log(height, 'uuuuuuuuuuuuuu');
        // console.log(blockTypes);

        // const foundIndex = blockTypes.findIndex((block) => block.id === order);
        // console.log(blockTypes);
        // console.log(order);
        // console.log(foundIndex, 'foundIndex');
        // setBlockTypes((prev: any) => {
        //     prev.splice(foundIndex, 1, {
        //         id: order,
        //         type: 'message',
        //         props: {
        //             ...(prev[foundIndex].props),
        //             height,
        //         },
        //     });
        //     console.log(prev.slice(), 'HERE');
        //     return prev.slice();
        // });
    }, []);

    const calculateCardHeight = (elements: ReactElement[]) => {
        console.log(elements, 'wwwwwwwwww__');
        return elements.reduce((acc: number, element: any) => {
            // console.log(element?.height, 'ELEMENT__');
            // console.log(element.children[0].getLocalBounds(), 'CALC__')
            return element ? acc + element.height : acc;
        }, 0);
    };

    const calculatePrevBlocksHeight = (index: number) => {
        const getPrevBlockHeight = (prevBlocks: ReactElement[]) => {
            console.log(prevBlocks, '__prevBlocks__');
            return calculateCardHeight(prevBlocks);
        };
        console.log(contentItems, 'yyyyyyyyyy__');
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
                        height={messageContainerHeight}
                        onChangeHeight={onChangeHeight}
                        {...props}
                    />
                );
        }
    }, []);

    // const getRef = useMemo(() => {
    //     return (index: number) => (element: ReactElement) => {
    //         refs.current[index] = element;
    //     };
    // }, [])

    const cardContent = useMemo(() => {
        console.log('MEMO');
        return blockTypes.map((blockType, index, allItems) => {
            const ref = (element: ReactElement) => {
                refs.current[index] = element;
            }
            const id = blockType.id;
            console.log(refs.current, 'CURRENT__');

            const extraPadding = lastRectPaddingSum = 
                index > 0 ?
                    allItems[index - 1].type === 'message' ?
                        lastRectPaddingSum + (rectPadding * 2) :
                        rectPadding * (index + 1) :
                    rectPadding * (index + 1);

            console.log(extraPadding / 15, 'extraPadding');

            return getReactElementByBlockType(blockType.type, {
                ref,
                key: id,
                order: index,
                extraPadding,
                id,
                lastX,
                lastY,
                prevBlocksHeight: calculatePrevBlocksHeight(index),
                calculatePrevBlocksHeight,
                verticalMargin: rectPadding * (index + 1),
                ...(blockType.props ? blockType.props : {}),
            });
        });
    }, [lastX, lastY, contentItems, blockTypes]);

    console.log(cardContent, 'EEEEEE_—');

    useEffect(() => {
        refs.current = [];
        console.log('RENDER__');
        const timerId = setTimeout(() => {
            const cardHeight = calculateCardHeight(refs.current);
            const totalCardHeight = cardHeight + (rectPadding * (refs.current.length + 1));
            console.log(refs.current, 'TTTTTTTT__')
            setCardHeight(totalCardHeight);
            setContentItems(refs.current);
        }, 0);

        console.log(lastY, 'QQQQQQQQ__');

        return () => clearTimeout(timerId);
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
                        height={cardHeight}
                        bg={0xffffff}
                    >
                        {cardContent}
                        {/* <HeaderContainer
                            id={blockTypes[0].id}
                            lastX={lastX}
                            lastY={lastY}
                            prevBlocksHeight={calculatePrevBlocksHeight(0)}
                        /> */}
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