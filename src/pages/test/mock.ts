import {nanoid} from 'nanoid';

export const testMock = (length: number): any[] => {
    const tests: any = [];

    for (let i = 0; i < length; i++) {
        tests.push({
            id: nanoid(),
            name: `test #${i}`,
            type: i % 2 === 0 ? 'test1' : 'test2',
        });
    }

    return tests;
};