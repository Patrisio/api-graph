import React, {useEffect, memo} from 'react';

export default memo(function TestItem({
    id,
    name,
}: any) {
    useEffect(() => {
        console.log(id);

        return () => {
            console.log(`unmount ${id}`);
        };
    });

    return (
        <div>{name}</div>
    );
});