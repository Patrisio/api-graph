import React, {ReactElement, useEffect, useRef, memo, useMemo, useCallback, forwardRef} from 'react';
import Rect from './Rect';
import {Container, Text, Sprite} from 'react-pixi-fiber';
import logo192 from '../../assets/logo192.png';
import * as PIXI from 'pixi.js';

type HeaderContainerProps = {
    lastX: number;
    lastY: number;
    prevBlocksHeight?: number;
    verticalMargin?: number;
};

const logoPadding = 15;
const TITLE = 'Facebook';
const SUBTITLE = 'Отправить сообщение';

export const HeaderContainer = forwardRef<Container, HeaderContainerProps>(({
    lastX,
    lastY,
    prevBlocksHeight = 0,
    verticalMargin = 0,
}, ref) => {

    function Logo(props: any) {
        return <Sprite texture={PIXI.Texture.from(logo192)} {...props} />;
    }

    const rect = useMemo(() => 350 - (verticalMargin * 2), []);
    const textX = useMemo(() => verticalMargin + 40, []);
    const textY = useMemo(() => verticalMargin * 2.2, []);
    const textTitle = useMemo(() => ({
        fill: 0x9e9d9d,
        fontSize: 12,
    }), []);

    const textSubTitle = useMemo(() => ({
        fill: 0x000000,
        fontSize: 16,
    }), []);

    return (
        <Container
            x={lastX}
            y={lastY + prevBlocksHeight}
            ref={ref}
        >
            <Logo
                x={logoPadding}
                y={verticalMargin}
                width={40}
                height={40}
            />
            <Text
                text={TITLE}
                style={textTitle}
                x={textX}
                y={verticalMargin}
            />
            <Text
                text={SUBTITLE}
                style={textSubTitle}
                x={textX}
                y={textY}
            />
        </Container>
    );
})