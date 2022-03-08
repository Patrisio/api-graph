import React, {useState, useMemo, useCallback, useRef, ReactElement} from 'react';
import { nanoid } from 'nanoid'
import Button from '@mui/material/Button';
import {testMock} from './mock';
import TestItem from './TestItem';
import {TestItem2} from './TestItem2';

export default function Test() {
    const tests = testMock(10);
    const [totalTests, setTests] = useState(tests);
    
    const divRef = useRef<ReactElement | null>(null);

    const addBottomTest = () => {
        setTests(prev => {
            const id = nanoid();

            return [
                ...prev,
                {
                    id,
                    name: `Test #${id}`,
                    type: 'test1'
                },
            ];
        });
    };

    const addTopTest = () => {
        setTests(prev => {
            const id = nanoid();

            return [
                {
                    id,
                    name: `Test #${id}`,
                    type: 'test2',
                },
                ...prev,
            ];
        });
    };

    const removeTest = () => {
        setTests(prev => {
            return prev.slice(0, prev.length - 1);
        });
    };

    const changeName = useCallback((name: string, id: string | number) => {
        setTests((prev) => {
            const foundTestIndex = prev.findIndex((test) => test.id === id);
            const foundTest = prev.find((test) => test.id === id);

            prev.splice(foundTestIndex, 1, {
                ...foundTest,
                name: `${name}---updated`
            });

            return prev.slice();
        });
    }, []);

    const getComponentByType = (type: string, id: string, name: string, props: any) => {
        switch (type) {
            case 'test1':
                return (
                    <TestItem
                        key={id}
                        id={id}
                        name={name}
                        {...{a: 'test1'}}
                    />
                )
            case 'test2':
                return (
                    <TestItem2
                        key={id}
                        id={id}
                        name={name}
                        changeName={changeName}
                        {...{a: 'test2'}}
                        {...props}
                    />
                )
        }
    };

    const testComponent = useMemo(() => {
        return totalTests.map(({name, id, type}) => {
            const ref = (element: ReactElement) => {
                divRef.current = element;
            }

            return getComponentByType(type, id, name, {
                b: 'hello',
                ref,
            });
        });
    }, [totalTests]);

    console.log(testComponent, 'YYYYYYY');

    return (
        <div>
            {
                testComponent
            }

            <Button
                onClick={addBottomTest}
            >
                Add Bottom test
            </Button>

            <Button
                onClick={addTopTest}
            >
                Add Top test
            </Button>

            <Button
                onClick={removeTest}
            >
                Remove test
            </Button>
        </div>
    );
}