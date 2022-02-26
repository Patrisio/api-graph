import React, {forwardRef} from 'react';
import {Sprite, Stage, Container, Text} from 'react-pixi-fiber';
import Rect from './Rect';

const text = `This message was made with ManyChat Flow Builder, jjjj🥰the most convenient visual bot building tool! 🐙{{email}}kkkkrdds dgg ggd fgdfg`;

type MessageContainerProps = {
    lastX: number;
    lastY: number;
    rectPadding: number;
    prevBlocksHeight?: number;
    verticalMargin?: number;
};

export default forwardRef<Container, MessageContainerProps>(function MessageContainer({
    lastX,
    lastY,
    rectPadding,
    prevBlocksHeight = 0,
    verticalMargin = 0,
}, ref) {
    console.log(prevBlocksHeight, '__prevBlocksHeight__');
    return (
        <Container
            x={lastX + rectPadding}
            y={lastY + verticalMargin + prevBlocksHeight}
            ref={ref}
        >
            <Rect
                width={350 - (rectPadding * 2)}
                height={79 + rectPadding}
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
                />
            </Rect>
        </Container>
    );
});