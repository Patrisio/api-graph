import { TrendingUpTwoTone } from '@mui/icons-material';
import React, {useEffect, useState, forwardRef, useRef, memo, useMemo} from 'react';
import {Sprite, Stage, Container, Text} from 'react-pixi-fiber';
import Rect from './Rect';

type MessageContainerProps = {
    id: string,
    order: number,
    lastX: number;
    lastY: number;
    rectPadding: number;
    extraPadding: number,
    prevBlocksHeight?: number;
    verticalMargin?: number;
    text: string;
    height: number;
    calculatePrevBlocksHeight: any,
    onChangeHeight: (height: number, order: number) => void;
};

const areEquals = (prev: any, next: any) => {
    console.log(prev, '__PREV__EE');
    console.log(next, '__NEXT__EE');
    return true;
}

export default memo(forwardRef<Container, MessageContainerProps>(function MessageContainer({
    id,
    order,
    lastX,
    lastY,
    rectPadding,
    extraPadding,
    // prevBlocksHeight = 0,
    verticalMargin = 0,
    text,
    height,
    calculatePrevBlocksHeight,
    onChangeHeight,
}, ref) {
    // console.log(prevBlocksHeight, '__prevBlocksHeight__');
    // console.log(id, '__ID__MESSAGE');
    const [h, setH] = useState(0);
    const [prevBlocksHeight, setPrevBlocksHeight] = useState(0);
    const textRef = useRef<any>();
    const rectRef = useRef<any>();

    useEffect(() => {
        console.log(text, '__TEXT__');
        const height = textRef.current.height;
        const rectHeight = rectRef.current.height;
        // console.log(rectRef.current.getGlobalPosition(), 'rectRef.current');
        // console.log(rectHeight, 'rectHeight__');
        // console.log(height, '__textRef__');
        // console.log(id, 'ORDER__');
        // console.log(order, '__ORDER__');
        // onChangeHeight(height, id);
        // console.log(verticalMargin, 'verticalMargin');
        // console.log(prevBlocksHeight, '__prevBlocksHeight');
        // console.log(lastY + verticalMargin + prevBlocksHeight, 'lastY + verticalMargin + prevBlocksHeight');
        // console.log(height, 'height__co');
        setH(height);
        // console.log(calculatePrevBlocksHeight(order), 'calculatePrevBlocksHeight(order)');
        setPrevBlocksHeight(calculatePrevBlocksHeight(order));

        console.log(extraPadding / 15, 'AAAAAAAA');
        console.log(lastY + calculatePrevBlocksHeight(order) + extraPadding, 'PIZDA');
    }, []);

    return useMemo(() => (
        <Container
            x={lastX + rectPadding}
            y={lastY + prevBlocksHeight + extraPadding}
            ref={ref}
        >
            <Rect
                width={350 - (rectPadding * 2)}
                height={h + (rectPadding * 2)}
                bg={0xf0f0f0}
                borderRadius={15}
                ref={rectRef}
            >
                <Text
                    text={text}
                    style={{
                        fill: 0x000000,
                        fontSize: 14,
                        wordWrap: true,
                        wordWrapWidth: 350 - (rectPadding * 4),
                    }}
                    x={rectPadding}
                    y={rectPadding}
                    ref={textRef}
                />
            </Rect>
        </Container>
        ), [h]
    );
}), areEquals);