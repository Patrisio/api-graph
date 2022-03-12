import React, {useEffect, useState, forwardRef, useRef, memo, useMemo} from 'react';
import {Container, Text} from 'react-pixi-fiber';
import Rect from './Rect';

type MessageContainerProps = {
    id: string,
    order: number,
    lastX: number;
    lastY: number;
    rectPadding: number;
    extraPadding: number,
    prevBlocksHeight: number;
    text: string;
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
    prevBlocksHeight = 0,
    text,
}, ref) {
    const [height, setHeight] = useState(0);
    const textRef = useRef<any>();

    useEffect(() => {
        const height = textRef.current.height;
        setHeight(height);
    }, [text]);

    return useMemo(() => (
        <Container
            x={lastX + rectPadding}
            y={lastY + prevBlocksHeight + extraPadding}
            ref={ref}
        >
            <Rect
                width={350 - (rectPadding * 2)}
                height={height + (rectPadding * 2)}
                bg={0xf0f0f0}
                borderRadius={15}
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
        ), [height]
    );
}), areEquals);