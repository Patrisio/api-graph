import React, {ReactElement, memo, useEffect, useRef} from 'react';
import {Container} from 'react-pixi-fiber';

type PixiContainerProps  = {
    lastX: number;
    lastY: number;
    updateHeight: any;
    children: ReactElement;
};

const areEquals = () => {
    return true;
};

export default memo(function PixiContainer({
    lastX,
    lastY,
    updateHeight,
    children
}: PixiContainerProps) {
    const containerElement = useRef<any>(null);

    useEffect(() => {
        const el = containerElement.current;
        if (el) {
            console.log(el.height, 'containerElement');
            // updateHeight((prev: any) => prev + el.height);
        }
        
        // updateHeight((prev: any) => prev + 1);
    }, []);

    return (
        <Container
            x={lastX}
            y={lastY}
            ref={containerElement}
        >
            {children}
        </Container>
    );
}, areEquals);
