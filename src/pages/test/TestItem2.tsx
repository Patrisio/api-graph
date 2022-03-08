import React, {useEffect, memo, forwardRef} from 'react';

const areEq = (prev: any, next: any) => {
    console.log(prev, 'PREV');
    return true;
};

export const TestItem2 = memo(
    forwardRef<any, any>(({
        id,
        name,
        changeName,
        aloha = 1,
        children
    }, ref) => {
        useEffect(() => {
            console.log(id, 'TEST_2');
            changeName(name, id);

            return () => {
                console.log(`unmount ${id}`);
            };
        }, []);

        return (
            <div style={{border: '1px solid blue'}} ref={ref}>
                test2-fake
                <br/>
                {name}
                {aloha}
                {children}
            </div>
        );
    }), areEq
)